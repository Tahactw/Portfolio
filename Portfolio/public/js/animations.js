/* ══════════════════════════════════════════════
   ANIMATIONS — Typing effect + section reveals
   + glitch trigger + skill bar fills
   ══════════════════════════════════════════════ */

const Animations = (() => {
  const animated = new Set();
  const typeQueues = new Map(); // element → timeout IDs

  function init() {
    // Animate hero immediately
    const hero = document.getElementById('hero');
    if (hero) animateSection(hero);
  }

  /**
   * Trigger entry animations for a section.
   */
  function animateSection(section) {
    if (!section) return;

    // Reveal elements with stagger
    const reveals = section.querySelectorAll('.reveal, .stagger');
    reveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 100);
    });

    // Skill bar fills
    const skillPanels = section.querySelectorAll('.skill-panel');
    skillPanels.forEach((panel, i) => {
      setTimeout(() => panel.classList.add('visible'), 200 + i * 120);
    });

    // Hero-specific: typing + glitch
    if (section.id === 'hero' && !animated.has('hero')) {
      animateHero(section);
      animated.add('hero');
    }
  }

  /**
   * Hero entrance — typing effect + glitch
   */
  function animateHero(section) {
    const greeting = section.querySelector('.hero__greeting');
    const nameSpan = section.querySelector('.hero__name .typed-text');
    const tagline = section.querySelector('.hero__tagline');
    const cta = section.querySelector('.hero__cta');
    const nameContainer = section.querySelector('.hero__name');

    // Show greeting first
    if (greeting) {
      greeting.style.transition = 'opacity 0.6s, transform 0.6s';
      setTimeout(() => {
        greeting.style.opacity = '1';
        greeting.style.transform = 'translateY(0)';
        // Type the greeting
        typeText(greeting, greeting.dataset.type, parseInt(greeting.dataset.typeSpeed) || 50, 0);
      }, 300);
    }

    // Type the name
    if (nameSpan && nameContainer) {
      nameContainer.style.transition = 'opacity 0.4s, transform 0.4s';
      const delay = parseInt(nameSpan.dataset.typeDelay) || 800;
      setTimeout(() => {
        nameContainer.style.opacity = '1';
        nameContainer.style.transform = 'translateY(0)';
        typeText(nameSpan, nameSpan.dataset.type, parseInt(nameSpan.dataset.typeSpeed) || 80, 0, () => {
          // Glitch after typing finishes
          triggerGlitch(nameContainer);
          // Remove cursor after a moment
          const cursor = nameContainer.querySelector('.typed-cursor');
          if (cursor) {
            setTimeout(() => { cursor.style.opacity = '0'; }, 2000);
          }
        });
      }, delay);
    }

    // Type the tagline
    if (tagline) {
      tagline.style.transition = 'opacity 0.4s, transform 0.4s';
      const delay = parseInt(tagline.dataset.typeDelay) || 2200;
      setTimeout(() => {
        tagline.style.opacity = '1';
        tagline.style.transform = 'translateY(0)';
        typeText(tagline, tagline.dataset.type, parseInt(tagline.dataset.typeSpeed) || 18, 0);
      }, delay);
    }

    // Fade in CTA
    if (cta) {
      setTimeout(() => {
        cta.style.transition = 'opacity 0.6s, transform 0.6s';
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }, 3200);
    }
  }

  /**
   * Typewriter effect — types text character by character
   * @param {Element} el - target element
   * @param {string} text - text to type
   * @param {number} speed - ms per character
   * @param {number} startDelay - delay before start
   * @param {Function} onComplete - callback when done
   */
  function typeText(el, text, speed = 40, startDelay = 0, onComplete) {
    if (!el || !text) return;

    // Clear any existing typing on this element
    if (typeQueues.has(el)) {
      typeQueues.get(el).forEach(id => clearTimeout(id));
    }

    const timeouts = [];
    el.textContent = '';

    const chars = text.split('');
    chars.forEach((char, i) => {
      const tid = setTimeout(() => {
        el.textContent += char;
      }, startDelay + i * speed);
      timeouts.push(tid);
    });

    // On complete callback
    if (onComplete) {
      const tid = setTimeout(onComplete, startDelay + chars.length * speed + 100);
      timeouts.push(tid);
    }

    typeQueues.set(el, timeouts);
  }

  /**
   * Trigger brief glitch effect on element
   */
  function triggerGlitch(el) {
    if (!el) return;
    el.classList.add('glitch-active');
    setTimeout(() => el.classList.remove('glitch-active'), 300);

    // Random repeat glitches
    setTimeout(() => {
      el.classList.add('glitch-active');
      setTimeout(() => el.classList.remove('glitch-active'), 200);
    }, 3000 + Math.random() * 5000);
  }

  function destroy() {
    typeQueues.forEach(timeouts => timeouts.forEach(id => clearTimeout(id)));
    typeQueues.clear();
  }

  return { init, animateSection, typeText, triggerGlitch, destroy };
})();
