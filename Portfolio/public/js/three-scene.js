/* ══════════════════════════════════════════════
   THREE-SCENE — WebGL background with shaders
   ══════════════════════════════════════════════ */

const ThreeScene = (() => {
  let scene, camera, renderer, material, mesh;
  let rafId = null;
  let startTime = Date.now();
  let mouseX = 0, mouseY = 0;
  let isInitialized = false;

  async function init() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || typeof THREE === 'undefined') {
      console.warn('[ThreeScene] Canvas or THREE.js not available');
      return;
    }

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Load shaders
      let vertexShader, fragmentShader;
      try {
        const [vRes, fRes] = await Promise.all([
          fetch('/shaders/vertex.glsl'),
          fetch('/shaders/fragment.glsl'),
        ]);
        vertexShader = await vRes.text();
        fragmentShader = await fRes.text();
      } catch {
        // Fallback inline shaders
        vertexShader = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
        fragmentShader = `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec2 uResolution;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float d = length(uv - 0.5);
            vec3 col = mix(
              vec3(0.04, 0.04, 0.06),
              vec3(0.08, 0.06, 0.14),
              d + 0.1 * sin(uTime * 0.5 + uv.x * 3.0)
            );
            float mouseDist = length(uv - uMouse);
            col += vec3(0.42, 0.39, 1.0) * 0.04 * smoothstep(0.4, 0.0, mouseDist);
            gl_FragColor = vec4(col, 1.0);
          }
        `;
      }

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Listen for mouse
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1.0 - e.clientY / window.innerHeight;
      }, { passive: true });

      // Handle resize
      window.addEventListener('resize', Utils.debounce(onResize, 200));

      isInitialized = true;
      animate();
    } catch (err) {
      console.error('[ThreeScene] Init error:', err);
    }
  }

  function animate() {
    if (!isInitialized) return;

    material.uniforms.uTime.value = (Date.now() - startTime) / 1000;
    material.uniforms.uMouse.value.set(
      Utils.lerp(material.uniforms.uMouse.value.x, mouseX, 0.05),
      Utils.lerp(material.uniforms.uMouse.value.y, mouseY, 0.05)
    );

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  function onResize() {
    if (!renderer || !material) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    if (renderer) renderer.dispose();
    if (material) material.dispose();
    isInitialized = false;
  }

  return { init, destroy };
})();
