// ═══════════════════════════════════════════
// FRAGMENT SHADER — Dark Grid / Tron aesthetic
// Neon green grid lines, pulse nodes, mouse glow
// ═══════════════════════════════════════════

precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform vec2  uMouse;      // 0..1 normalised
uniform vec2  uResolution;

// ── Simplex noise helpers ──
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                           dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 coord = uv * vec2(aspect, 1.0);

  // ── Base dark gradient ──
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  vec3 bgColor = vec3(0.02, 0.02, 0.04) * vignette;

  // ── Grid lines ──
  float gridSize = 30.0;
  vec2 grid = coord * gridSize;
  vec2 gridFrac = fract(grid);
  float lineX = smoothstep(0.02, 0.0, gridFrac.x) + smoothstep(0.98, 1.0, gridFrac.x);
  float lineY = smoothstep(0.02, 0.0, gridFrac.y) + smoothstep(0.98, 1.0, gridFrac.y);
  float gridLine = max(lineX, lineY);

  // Dim the grid slightly with noise movement
  float noiseWarp = snoise(coord * 2.0 + uTime * 0.05) * 0.3;
  gridLine *= 0.06 + noiseWarp * 0.02;

  vec3 gridColor = vec3(0.0, 1.0, 0.533) * gridLine; // neon green

  // ── Grid intersection nodes ──
  float nodeX = smoothstep(0.06, 0.0, gridFrac.x) + smoothstep(0.94, 1.0, gridFrac.x);
  float nodeY = smoothstep(0.06, 0.0, gridFrac.y) + smoothstep(0.94, 1.0, gridFrac.y);
  float node = nodeX * nodeY;

  // Animated pulse at nodes
  float pulse = sin(uTime * 1.5 + floor(grid.x) * 0.7 + floor(grid.y) * 1.1) * 0.5 + 0.5;
  node *= pulse * 0.3;

  vec3 nodeColor = vec3(0.0, 0.83, 1.0) * node; // cyan nodes

  // ── Mouse glow ──
  vec2 mousePos = uMouse * vec2(aspect, 1.0);
  float mouseDist = length(coord - mousePos);
  float glow = exp(-mouseDist * 3.0) * 0.25;
  vec3 glowColor = mix(
    vec3(0.0, 1.0, 0.533),  // green core
    vec3(0.0, 0.83, 1.0),   // cyan halo
    smoothstep(0.0, 0.3, mouseDist)
  ) * glow;

  // ── Subtle noise fog ──
  float fog = snoise(coord * 3.0 - uTime * 0.08) * 0.015;
  vec3 fogColor = vec3(0.0, 0.6, 0.4) * max(fog, 0.0);

  // ── Energy wave (slow radial pulse from center) ──
  float centerDist = length(coord - vec2(aspect * 0.5, 0.5));
  float wave = sin(centerDist * 8.0 - uTime * 0.8) * 0.5 + 0.5;
  wave = smoothstep(0.4, 0.6, wave) * 0.02;
  wave *= exp(-centerDist * 0.8);
  vec3 waveColor = vec3(0.0, 1.0, 0.533) * wave;

  // ── Combine ──
  vec3 color = bgColor + gridColor + nodeColor + glowColor + fogColor + waveColor;

  // Slight scanline darken (complements CSS scanlines)
  float scanline = sin(uv.y * uResolution.y * 0.8) * 0.5 + 0.5;
  color *= 0.95 + scanline * 0.05;

  gl_FragColor = vec4(color, 1.0);
}
