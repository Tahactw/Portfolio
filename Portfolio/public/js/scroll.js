/* ══════════════════════════════════════════════
   SCROLL — Section-at-a-time navigation
   Wheel / Keyboard / Touch / Nav clicks
   ══════════════════════════════════════════════ */

const Scroll = (() => {
  let sections = [];
  let currentIndex = 0;
  let isTransitioning = false;
  let touchStartY = 0;
  const COOLDOWN = 1200; // ms between transitions
  const TOUCH_THRESHOLD = 50; // px swipe distance

  function init() {
    sections = [...document.querySelectorAll('.section')];
    if (!sections.length) return;

    // Show first section
    sections[0].classList.add('active');
    updateNav(0);
    updateCounter(0);

    // Input bindings
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Nav dot clicks
    document.querySelectorAll('.nav__link').forEach((link, i) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        goTo(i);
      });
    });

    // Nav toggle (mobile)
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // Admin gate (triple-click counter → navigate to admin)
    const counter = document.querySelector('.nav__counter');
    if (counter) {
      let clicks = 0;
      let clickTimer;
      counter.addEventListener('click', () => {
        clicks++;
        clearTimeout(clickTimer);
        if (clicks >= 3) {
          clicks = 0;
          window.location.href = '/admin';
        }
        clickTimer = setTimeout(() => { clicks = 0; }, 600);
      });
    }
  }

  function onWheel(e) {
    // Don't hijack scroll if modal is open
    if (document.querySelector('.project-modal.open')) return;
    // Don't hijack if scrolling inside an overflow element
    const target = e.target.closest('.section');
    if (target && target.scrollHeight > target.clientHeight + 10) {
      const atTop = target.scrollTop <= 0;
      const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
    }

    e.preventDefault();
    if (isTransitioning) return;

    if (e.deltaY > 30) goTo(currentIndex + 1);
    else if (e.deltaY < -30) goTo(currentIndex - 1);
  }

  function onKey(e) {
    if (document.querySelector('.project-modal.open')) return;
    if (isTransitioning) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        goTo(currentIndex + 1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        goTo(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(sections.length - 1);
        break;
    }
  }

  function onTouchStart(e) {
    touchStartY = e.changedTouches[0].screenY;
  }

  function onTouchEnd(e) {
    if (document.querySelector('.project-modal.open')) return;
    if (isTransitioning) return;

    const diff = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(diff) > TOUCH_THRESHOLD) {
      goTo(currentIndex + (diff > 0 ? 1 : -1));
    }
  }

  function goTo(index) {
    if (index < 0 || index >= sections.length || index === currentIndex || isTransitioning) return;
    isTransitioning = true;

    const prev = currentIndex;
    const target = index;

    SectionTransitions.play(
      target,
      // midpoint callback — swap active section
      () => {
        sections[prev].classList.remove('active');
        sections[target].classList.add('active');
        currentIndex = target;
        updateNav(target);
        updateCounter(target);
        // Trigger entry animations on new section
        Animations.animateSection(sections[target]);
      },
      // complete callback
      () => {
        isTransitioning = false;
      }
    );
  }

  /**
   * Scroll to index (allows external calls, e.g., CTA buttons)
   */
  function scrollToIndex(index) {
    goTo(index);
  }

  function updateNav(index) {
    document.querySelectorAll('.nav__link').forEach((link, i) => {
      link.classList.toggle('active', i === index);
    });
  }

  function updateCounter(index) {
    const current = document.querySelector('.nav__counter-current');
    if (current) current.textContent = String(index + 1).padStart(2, '0');
  }

  return { init, goTo, scrollToIndex };
})();
