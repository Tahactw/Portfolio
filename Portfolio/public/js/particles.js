/* ══════════════════════════════════════════════
   PARTICLES — Geometric grid-aligned particles
   Neon green/cyan/pink palette
   ══════════════════════════════════════════════ */

const Particles = (() => {
  let canvas, ctx;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animId;
  let w, h;

  const COUNT = 60;
  const CONNECT_DIST = 140;
  const REPULSE_DIST = 120;
  const SPEED = 0.3;

  const COLORS = [
    { r: 0, g: 255, b: 136 },   // neon green
    { r: 0, g: 212, b: 255 },   // cyan
    { r: 255, g: 0, b: 102 },   // pink
    { r: 255, g: 170, b: 0 },   // amber
  ];

  function init() {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', Utils.debounce(resize, 200));
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        size: Math.random() * 2 + 1,
        color,
        alpha: Math.random() * 0.3 + 0.2,
        shape: Math.random() > 0.5 ? 'square' : 'diamond',
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPULSE_DIST) {
        const force = (REPULSE_DIST - dist) / REPULSE_DIST * 0.02;
        p.vx += dx * force;
        p.vy += dy * force;
      }

      // Friction
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Draw particle
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `rgb(${p.color.r},${p.color.g},${p.color.b})`;

      if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        // Diamond
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < CONNECT_DIST) {
          const lineAlpha = (1 - cdist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 136, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
  }

  return { init, destroy };
})();
