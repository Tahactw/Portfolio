/* ══════════════════════════════════════════════
   TRANSITIONS — Glitch/static section transition
   Game-style screen tear between sections
   ══════════════════════════════════════════════ */

const SectionTransitions = (() => {
  let overlay, bars, staticEl;

  /* Section colors — tinted dark for bars */
  const sectionColors = [
    '#0a1a0f', // hero: green tint
    '#0a1418', // about: cyan tint
    '#120a1a', // skills: violet tint
    '#141008', // projects: amber tint
    '#140a10', // experience: red tint
    '#0a140f', // contact: green tint
  ];

  function init() {
    overlay = document.getElementById('glitchOverlay');
    bars = overlay ? Array.from(overlay.querySelectorAll('.glitch-overlay__bar')) : [];
    staticEl = overlay ? overlay.querySelector('.glitch-overlay__static') : null;
  }

  /**
   * Play glitch transition.
   * @param {number} targetIndex
   * @param {Function} onMidpoint — called when screen is covered
   * @param {Function} onComplete — called when transition done
   */
  function play(targetIndex, onMidpoint, onComplete) {
    if (!overlay || bars.length === 0) {
      onMidpoint();
      setTimeout(onComplete, 50);
      return;
    }

    const color = sectionColors[targetIndex] || sectionColors[0];
    overlay.classList.add('active');

    // Phase 1: Glitch bars sweep in + static flash
    bars.forEach((bar, i) => {
      const top = (i / bars.length) * 100;
      const height = 100 / bars.length;
      bar.style.cssText = `
        top: ${top}%; height: ${height}%;
        background: ${color};
        opacity: 0; transform: translateX(-100%);
        transition: none;
      `;
    });

    // Static noise flash
    if (staticEl) {
      staticEl.style.transition = 'none';
      staticEl.style.opacity = '0';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Sweep bars in from left with stagger
        bars.forEach((bar, i) => {
          bar.style.transition = `opacity 0.08s ${i * 30}ms, transform 0.2s ${i * 30}ms cubic-bezier(0.76, 0, 0.24, 1)`;
          bar.style.opacity = '0.95';
          bar.style.transform = 'translateX(0)';
        });

        // Flash static noise
        if (staticEl) {
          staticEl.style.transition = 'opacity 0.1s';
          staticEl.style.opacity = '0.6';
        }

        // Midpoint — bars cover screen
        const coverTime = 200 + bars.length * 30 + 60;
        setTimeout(() => {
          onMidpoint();

          // Brief hold, then sweep bars out to right
          setTimeout(() => {
            if (staticEl) {
              staticEl.style.transition = 'opacity 0.15s';
              staticEl.style.opacity = '0';
            }

            bars.forEach((bar, i) => {
              bar.style.transition = `opacity 0.08s ${i * 25}ms, transform 0.2s ${i * 25}ms cubic-bezier(0.76, 0, 0.24, 1)`;
              bar.style.transform = 'translateX(100%)';
              bar.style.opacity = '0';
            });

            const revealTime = 200 + bars.length * 25 + 80;
            setTimeout(() => {
              overlay.classList.remove('active');
              bars.forEach(bar => bar.style.cssText = '');
              if (staticEl) staticEl.style.cssText = '';
              onComplete();
            }, revealTime);
          }, 80);
        }, coverTime);
      });
    });
  }

  /* ── Magnetic hover ──────────────────────── */
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    Utils.$$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  return { init, play, initMagnetic };
})();
