/* ══════════════════════════════════════════════
   APP — Boot sequence + initialization chain
   ══════════════════════════════════════════════ */

const App = (() => {
  const BOOT_LINES = [
    { text: '> PORTFOLIO_OS v2.0', delay: 0 },
    { text: '> Initializing system...', delay: 200 },
    { text: '  [██████████] GPU OK', delay: 500 },
    { text: '  [██████████] NETWORK OK', delay: 700 },
    { text: '> Loading assets...', delay: 1000 },
    { text: '  [██████████] SHADERS COMPILED', delay: 1300 },
    { text: '  [██████████] DATA LOADED', delay: 1600 },
    { text: '> Building interface...', delay: 1900 },
    { text: '> SYSTEM READY', delay: 2400, accent: true },
  ];

  async function init() {
    const loader = document.getElementById('loader');
    const loaderLines = document.getElementById('loaderLines');
    const loaderBarFill = document.getElementById('loaderBarFill');

    // Start boot sequence
    if (loaderLines && loaderBarFill) {
      await runBootSequence(loaderLines, loaderBarFill);
    }

    // Initialize Three.js background
    try {
      ThreeScene.init('bgCanvas', '/shaders/vertex.glsl', '/shaders/fragment.glsl');
    } catch (e) {
      console.warn('[App] WebGL init failed:', e);
    }

    // Initialize cursor
    try {
      Cursor.init();
    } catch (e) {
      console.warn('[App] Cursor init failed:', e);
    }

    // Load data + render sections
    try {
      await Renderer.init();
    } catch (e) {
      console.error('[App] Renderer init failed:', e);
    }

    // Initialize particles
    try {
      Particles.init();
    } catch (e) {
      console.warn('[App] Particles init failed:', e);
    }

    // Hide loader
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        loader.remove();
      }, 500);
    }

    // Show nav
    const nav = document.getElementById('nav');
    if (nav) {
      setTimeout(() => nav.classList.add('nav--visible'), 100);
    }

    // Initialize navigation + animations
    SectionTransitions.init?.();
    Animations.init();
    Scroll.init();

    // Magnetic hover on buttons/links
    SectionTransitions.initMagnetic?.();

    // Render lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Wire modal
    wireModal();

    // Wire CTA
    wireCTA();
  }

  function runBootSequence(linesEl, barFill) {
    return new Promise(resolve => {
      const totalDuration = BOOT_LINES[BOOT_LINES.length - 1].delay + 400;

      BOOT_LINES.forEach(line => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'line' + (line.accent ? ' accent' : '');
          div.textContent = line.text;
          linesEl.appendChild(div);
          linesEl.scrollTop = linesEl.scrollHeight;

          // Update progress bar
          const progress = Math.min((line.delay / totalDuration) * 100 + 10, 100);
          barFill.style.width = progress + '%';
        }, line.delay);
      });

      // Complete bar and resolve
      setTimeout(() => {
        barFill.style.width = '100%';
      }, totalDuration - 200);

      setTimeout(resolve, totalDuration);
    });
  }

  function wireModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const backdrop = modal.querySelector('.project-modal__backdrop');
    const closeBtn = modal.querySelector('.project-modal__close');

    if (backdrop) {
      backdrop.addEventListener('click', () => Renderer.closeProjectModal());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => Renderer.closeProjectModal());
    }

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        Renderer.closeProjectModal();
      }
    });
  }

  function wireCTA() {
    // "Enter" button on hero — let the inline onclick handler work
    // No additional wiring needed since renderer.js uses onclick="Scroll.goTo(3)"
  }

  // Boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => App.init());

  return { init };
})();
