/* ══════════════════════════════════════════════
   CURSOR — Custom cursor with smooth tracking
   ══════════════════════════════════════════════ */

const Cursor = (() => {
  let dot, ring;
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let isHovering = false;
  let rafId = null;

  function init() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    dot = document.getElementById('cursorDot');
    ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);

    // Track hover on interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [role="button"], .magnetic, input, textarea, select')) {
        isHovering = true;
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, [role="button"], .magnetic, input, textarea, select')) {
        isHovering = false;
        document.body.classList.remove('cursor-hover');
      }
    });

    loop();
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function loop() {
    // Dot follows instantly
    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    }

    // Ring follows with lag
    ringX = Utils.lerp(ringX, mouseX, 0.15);
    ringY = Utils.lerp(ringY, mouseY, 0.15);

    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
    }

    rafId = requestAnimationFrame(loop);
  }

  function show() {
    if (dot) dot.style.opacity = '1';
    if (ring) ring.style.opacity = '1';
  }

  function hide() {
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
  }

  return { init, destroy };
})();
