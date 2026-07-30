/**
 * The parts kit for the maker-district skyline.
 *
 * Every part is drawn procedurally with a seeded RNG so edges are slightly
 * irregular (painted, not vector-crisp) but identical on every build.
 * Parts draw in a local box with the ground at y = h; the band composer
 * places them. Fills reference CSS custom properties so day/night is a
 * token swap, never a redraw.
 */

export type RNG = () => number;

export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Part {
  w: number;
  h: number;
  svg: string;
  windows: Win[];
}

const F = (n: number) => n.toFixed(1);

/** Jittered polygon: hand-painted edges instead of machine-straight ones. */
function poly(rng: RNG, pts: [number, number][], amount = 1.4): string {
  const j = (v: number) => v + (rng() * 2 - 1) * amount;
  return (
    pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${F(j(p[0]))},${F(j(p[1]))}`)
      .join('') + 'Z'
  );
}

/** Sawtooth-roof factory: the classic industrial profile. */
export function sawtooth(rng: RNG, w: number, h: number): Part {
  const teeth = 2 + Math.floor(rng() * 2);
  const toothW = w / teeth;
  const roofTop = h * 0.3;
  const roofBase = h * 0.52;
  const pts: [number, number][] = [[0, roofBase]];
  for (let i = 0; i < teeth; i++) {
    const x0 = i * toothW;
    pts.push([x0, roofTop]);
    pts.push([x0 + toothW, roofBase]);
  }
  pts.push([w, h], [0, h]);
  const body = poly(rng, pts, 1.2);
  // the vertical faces of each tooth catch the sky
  let faces = '';
  for (let i = 0; i < teeth; i++) {
    const x0 = i * toothW;
    faces += `<path d="${poly(rng, [
      [x0, roofBase],
      [x0, roofTop],
      [x0 + toothW * 0.34, roofTop + (roofBase - roofTop) * 0.34],
      [x0 + toothW * 0.34, roofBase],
    ], 0.9)}" class="w-roof"/>`;
  }
  const windows: Win[] = [];
  const cols = Math.max(2, Math.floor(w / 30));
  for (let c = 0; c < cols; c++) {
    if (rng() < 0.45) continue;
    windows.push({ x: (w / (cols + 1)) * (c + 1) - 4, y: h * 0.66, w: 8, h: 11 });
  }
  return { w, h, svg: `<path d="${body}"/>${faces}`, windows };
}

/** Storage silo: tall cylinder, domed cap, side ladder. */
export function silo(rng: RNG, s: number): Part {
  const w = s * 0.66;
  const h = s * 1.7;
  const domeH = w * 0.4;
  const body = poly(rng, [
    [w * 0.08, domeH],
    [w * 0.92, domeH],
    [w * 0.92, h],
    [w * 0.08, h],
  ], 1);
  const dome = `<path d="M${F(w * 0.08)},${F(domeH + 1)} Q${F(w / 2)},${F(-domeH * 0.5)} ${F(w * 0.92)},${F(domeH + 1)} Z" class="w-roof"/>`;
  let bands = '';
  for (let i = 1; i <= 2; i++) {
    const y = domeH + ((h - domeH) / 3) * i;
    bands += `<rect x="${F(w * 0.08)}" y="${F(y)}" width="${F(w * 0.84)}" height="1.6" opacity="0.5"/>`;
  }
  const ladder = `<rect x="${F(w * 0.94)}" y="${F(domeH + 6)}" width="1.6" height="${F(h - domeH - 10)}"/>`;
  return { w, h, svg: `<path d="${body}"/>${dome}${bands}${ladder}`, windows: [] };
}

/** Pitched-roof workshop: the bread of the skyline. */
export function workshop(rng: RNG, w: number, h: number): Part {
  const roofH = h * (0.2 + rng() * 0.26);
  const bodyTop = roofH;
  const ridge = w * (0.35 + rng() * 0.3); // asymmetric ridge position
  const body = poly(rng, [
    [0, bodyTop],
    [w, bodyTop],
    [w, h],
    [0, h],
  ]);
  const roof = poly(rng, [
    [-w * 0.05, bodyTop + 1],
    [ridge, 0],
    [w * 1.05, bodyTop + 1],
  ]);
  let extras = '';
  // rooftop vent or tiny chimney
  if (rng() > 0.4) {
    const cx = w * (0.15 + rng() * 0.7);
    const ch = 8 + rng() * 10;
    extras += `<path d="${poly(rng, [
      [cx - 3, bodyTop * 0.45],
      [cx + 3, bodyTop * 0.45],
      [cx + 3, bodyTop * 0.45 - ch],
      [cx - 3, bodyTop * 0.45 - ch],
    ], 0.8)}"/>`;
  }
  const windows: Win[] = [];
  const rows = h - bodyTop > 46 ? 2 : 1;
  const cols = Math.max(1, Math.floor(w / 26));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rng() < 0.42) continue; // dark rooms exist
      windows.push({
        x: (w / (cols + 1)) * (c + 1) - 3.5,
        y: bodyTop + 12 + r * ((h - bodyTop - 20) / rows),
        w: 7,
        h: 9,
      });
    }
  }
  return { w, h, svg: `<path d="${body}"/><path d="${roof}" class="w-roof"/>${extras}`, windows };
}

/** Flat-roof rowhouse with a parapet — density filler. */
export function rowhouse(rng: RNG, w: number, h: number): Part {
  const body = poly(rng, [
    [0, 6],
    [w, 6],
    [w, h],
    [0, h],
  ]);
  const parapet = poly(rng, [
    [-2, 0],
    [w + 2, 0],
    [w + 2, 7],
    [-2, 7],
  ], 0.9);
  const windows: Win[] = [];
  const rows = Math.max(1, Math.floor((h - 18) / 26));
  const cols = Math.max(1, Math.floor(w / 24));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (rng() < 0.5) continue;
      windows.push({
        x: (w / (cols + 1)) * (c + 1) - 3.5,
        y: 16 + r * 26,
        w: 7,
        h: 9,
      });
    }
  return { w, h, svg: `<path d="${body}"/><path d="${parapet}" class="w-roof"/>`, windows };
}

/** Narrow tower with a railed platform on top. */
export function tower(rng: RNG, w: number, h: number): Part {
  const body = poly(rng, [
    [w * 0.12, 14],
    [w * 0.88, 14],
    [w * 0.8, h],
    [w * 0.2, h],
  ]);
  const cap = poly(rng, [
    [0, 8],
    [w, 8],
    [w, 14],
    [0, 14],
  ], 0.8);
  let rail = '';
  for (let i = 0; i <= 4; i++) {
    const x = (w / 4) * i;
    rail += `<rect x="${F(x - 0.8)}" y="0" width="1.6" height="8"/>`;
  }
  const windows: Win[] = [];
  const rows = Math.floor((h - 26) / 30);
  for (let r = 0; r < rows; r++) {
    if (rng() < 0.35) continue;
    windows.push({ x: w / 2 - 3, y: 24 + r * 30, w: 6, h: 8 });
  }
  return { w, h, svg: `<path d="${body}"/><path d="${cap}" class="w-roof"/>${rail}`, windows };
}

/** Water tank on legs — every workshop district has one. */
export function watertank(rng: RNG, s: number): Part {
  const w = s;
  const h = s * 1.5;
  const tankH = s * 0.62;
  const legTop = tankH + s * 0.08;
  let legs = '';
  for (const lx of [w * 0.16, w * 0.84]) {
    legs += `<path d="${poly(rng, [
      [lx - 2, legTop],
      [lx + 2, legTop],
      [lx + 2 + (lx < w / 2 ? -3 : 3), h],
      [lx - 2 + (lx < w / 2 ? -3 : 3), h],
    ], 0.8)}"/>`;
  }
  // cross brace
  legs += `<path d="M${F(w * 0.16)},${F(legTop + 6)}L${F(w * 0.84)},${F(h - 4)}M${F(w * 0.84)},${F(legTop + 6)}L${F(w * 0.16)},${F(h - 4)}" fill="none" stroke-width="1.6" class="w-stroke"/>`;
  const tank = poly(rng, [
    [w * 0.08, s * 0.16],
    [w * 0.92, s * 0.16],
    [w * 0.9, tankH],
    [w * 0.1, tankH],
  ]);
  const lid = poly(rng, [
    [w * 0.08, s * 0.18],
    [w / 2, 0],
    [w * 0.92, s * 0.18],
  ], 0.9);
  return { w, h, svg: `${legs}<path d="${tank}"/><path d="${lid}"/>`, windows: [] };
}

/** Antenna mast with crossarms; the tip carries the district's one beacon. */
export function mast(rng: RNG, h: number, beacon = false): Part {
  const w = 26;
  const cx = w / 2;
  let svg = `<path d="${poly(rng, [
    [cx - 1.6, 4],
    [cx + 1.6, 4],
    [cx + 3.4, h],
    [cx - 3.4, h],
  ], 0.7)}"/>`;
  for (let i = 0; i < 3; i++) {
    const y = 10 + i * (h * 0.2);
    const aw = 10 - i * 2.4;
    svg += `<rect x="${F(cx - aw)}" y="${F(y)}" width="${F(aw * 2)}" height="1.8"/>`;
  }
  if (beacon) svg += `<circle cx="${cx}" cy="2.6" r="2.6" class="w-beacon"/>`;
  return { w, h, svg, windows: [] };
}

/** Chunky cube-canopy tree, straight from the reference language. */
export function tree(rng: RNG, s: number, near = false): Part {
  const w = s;
  const h = s * 1.25;
  const cls = near ? 'w-tree-near' : 'w-tree';
  const trunk = poly(rng, [
    [w * 0.46, h * 0.5],
    [w * 0.54, h * 0.5],
    [w * 0.58, h],
    [w * 0.42, h],
  ], 0.9);
  let canopy = '';
  const blobs = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < blobs; i++) {
    const bw = w * (0.5 + rng() * 0.4);
    const bh = h * (0.28 + rng() * 0.14);
    const bx = (w - bw) * rng();
    const by = h * 0.06 + i * bh * 0.62;
    const r = 4 + rng() * 5;
    canopy += `<rect x="${F(bx)}" y="${F(by)}" width="${F(bw)}" height="${F(bh)}" rx="${F(r)}" transform="rotate(${F((rng() * 2 - 1) * 4)} ${F(bx + bw / 2)} ${F(by + bh / 2)})"/>`;
  }
  return { w, h, svg: `<g class="${cls}"><path d="${trunk}"/>${canopy}</g>`, windows: [] };
}

/** Small gantry crane for the mid band. */
export function gantrySmall(rng: RNG, w: number, h: number): Part {
  const beamY = h * 0.22;
  const legW = 5;
  let svg = '';
  for (const lx of [legW, w - legW * 2]) {
    svg += `<path d="${poly(rng, [
      [lx, beamY],
      [lx + legW, beamY],
      [lx + legW + 3, h],
      [lx - 3, h],
    ], 0.8)}"/>`;
  }
  svg += `<rect x="0" y="${F(beamY - 5)}" width="${F(w)}" height="6"/>`;
  const tx = w * (0.3 + rng() * 0.4);
  svg += `<rect x="${F(tx)}" y="${F(beamY + 1)}" width="9" height="6"/>`;
  svg += `<rect x="${F(tx + 3.6)}" y="${F(beamY + 7)}" width="1.4" height="${F(h * 0.3)}"/>`;
  svg += `<path d="M${F(tx + 1)},${F(beamY + 7 + h * 0.3)} h5 l-2.5,5 z"/>`;
  return { w, h, svg, windows: [] };
}

/** A small articulated-arm silhouette to mount on a roof — his machines live here. */
export function roofArm(_rng: RNG, s: number): Part {
  const w = s;
  const h = s * 0.9;
  const bx = w * 0.5;
  const seg = (x1: number, y1: number, x2: number, y2: number, t: number) => {
    return `<path d="M${F(x1)},${F(y1)}L${F(x2)},${F(y2)}" fill="none" stroke-width="${F(t)}" stroke-linecap="round" class="w-stroke"/>`;
  };
  const j1: [number, number] = [bx, h * 0.86];
  const j2: [number, number] = [bx - w * 0.18, h * 0.38];
  const j3: [number, number] = [bx + w * 0.22, h * 0.18];
  const tip: [number, number] = [bx + w * 0.4, h * 0.34];
  let svg = `<rect x="${F(bx - w * 0.16)}" y="${F(h * 0.86)}" width="${F(w * 0.32)}" height="${F(h * 0.14)}" rx="2"/>`;
  svg += seg(j1[0], j1[1], j2[0], j2[1], 5);
  svg += seg(j2[0], j2[1], j3[0], j3[1], 4);
  svg += seg(j3[0], j3[1], tip[0], tip[1], 3);
  for (const [cx, cy] of [j1, j2, j3])
    svg += `<circle cx="${F(cx)}" cy="${F(cy)}" r="3.2"/>`;
  return { w, h, svg, windows: [] };
}

/** Simple silhouette blocks for the far band — shape only, no detail. */
export function farBlock(rng: RNG, w: number, h: number): Part {
  const kind = rng();
  let svg: string;
  if (kind < 0.3) {
    // pitched
    svg = `<path d="${poly(rng, [
      [0, h * 0.32],
      [w * (0.3 + rng() * 0.4), 0],
      [w, h * 0.32],
      [w, h],
      [0, h],
    ])}"/>`;
  } else if (kind < 0.5) {
    // tower + block
    svg = `<path d="${poly(rng, [
      [0, h * 0.4],
      [w * 0.55, h * 0.4],
      [w * 0.55, 0],
      [w * 0.8, 0],
      [w * 0.8, h * 0.4],
      [w, h * 0.4],
      [w, h],
      [0, h],
    ])}"/>`;
  } else {
    svg = `<path d="${poly(rng, [
      [0, rng() * h * 0.2],
      [w, rng() * h * 0.2],
      [w, h],
      [0, h],
    ])}"/>`;
  }
  return { w, h, svg, windows: [] };
}
