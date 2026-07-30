/**
 * Composes the skyline bands from the parts kit with seeded randomness:
 * the layout varies across the band but is identical on every build.
 *
 * Output is plain SVG markup (groups of paths) placed by Vista.astro.
 * Depth = fog: each band's fill mixes toward the sky colour in CSS, so
 * this module only decides SHAPE, never colour.
 *
 * Windows are emitted INSIDE each building's group, immediately after its
 * shapes — a building placed later occludes an earlier building's windows
 * naturally, the way real depth does.
 */
import type { Part, RNG, Win } from './parts';
import {
  farBlock,
  gantrySmall,
  mast,
  mulberry32,
  roofArm,
  rowhouse,
  sawtooth,
  silo,
  tower,
  tree,
  watertank,
  workshop,
} from './parts';

const F = (n: number) => n.toFixed(1);

export interface Band {
  svg: string;
}

/** A lit window: soft radial glow (gradient, not a disc) under a warm pane.
    dayLit windows stay warm in daylight so the cool/warm contrast survives. */
function winSvg(win: Win, glow: number, flicker = false, dayLit = false): string {
  const cx = win.x + win.w / 2;
  const cy = win.y + win.h / 2;
  const cls = `w-window${flicker ? ' w-flicker' : ''}${dayLit ? ' w-daylit' : ''}`;
  return (
    `<ellipse cx="${F(cx)}" cy="${F(cy)}" rx="${F(win.w * glow)}" ry="${F(win.h * glow * 0.85)}" fill="url(#v-wglow)" class="w-glow"/>` +
    `<rect x="${F(win.x)}" y="${F(win.y)}" width="${F(win.w)}" height="${F(win.h)}" rx="1" class="${cls}"/>`
  );
}

function partWithWindows(
  part: Part,
  x: number,
  y: number,
  rng: RNG,
  opts: { litChance: number; glow: number; flickerBudget: { n: number } },
): string {
  let wins = '';
  for (const win of part.windows) {
    if (rng() > opts.litChance) continue;
    const flicker = opts.flickerBudget.n > 0 && rng() < 0.08;
    if (flicker) opts.flickerBudget.n--;
    const dayLit = !flicker && rng() < 0.16;
    wins += winSvg(win, opts.glow, flicker, dayLit);
  }
  return `<g transform="translate(${F(x)},${F(y)})">${part.svg}${wins}</g>`;
}

/** The far skyline: pale silhouette blocks touching the horizon. */
export function farBand(seed: number, width: number, baseline: number): Band {
  const rng = mulberry32(seed);
  let x = -30;
  let svg = '';
  while (x < width + 30) {
    const w = 50 + rng() * 130;
    const h = 36 + rng() * 120;
    const part = farBlock(rng, w, h);
    svg += `<g transform="translate(${F(x)},${F(baseline - h)})">${part.svg}</g>`;
    x += w + (rng() < 0.25 ? 26 + rng() * 60 : -6 + rng() * 10);
    if (rng() < 0.14) {
      const mh = 60 + rng() * 60;
      const m = mast(rng, mh, false);
      svg += `<g transform="translate(${F(x)},${F(baseline - mh)})">${m.svg}</g>`;
      x += 30;
    }
  }
  return { svg };
}

/** The mid town: workshops, towers, tanks — where the windows live. */
export function midBand(seed: number, width: number, baseline: number): Band {
  const rng = mulberry32(seed);
  let x = -20;
  let svg = '';
  const flickerBudget = { n: 3 };
  let armPlaced = false;
  let tankPlaced = false;

  while (x < width + 20) {
    const roll = rng();
    let part: Part;
    if (!tankPlaced && x > 820) {
      part = watertank(rng, 50 + rng() * 14);
      tankPlaced = true;
    } else if (roll < 0.34) part = workshop(rng, 76 + rng() * 90, 96 + rng() * 120);
    else if (roll < 0.5) part = rowhouse(rng, 64 + rng() * 66, 80 + rng() * 110);
    else if (roll < 0.62) part = sawtooth(rng, 110 + rng() * 80, 100 + rng() * 60);
    else if (roll < 0.74) part = tower(rng, 34 + rng() * 14, 150 + rng() * 110);
    else if (roll < 0.82) part = silo(rng, 60 + rng() * 26);
    else if (roll < 0.9) part = gantrySmall(rng, 90 + rng() * 60, 80 + rng() * 50);
    else part = workshop(rng, 90 + rng() * 70, 150 + rng() * 70);

    const y = baseline - part.h;
    svg += partWithWindows(part, x, y, rng, { litChance: 0.72, glow: 1.35, flickerBudget });
    if (!armPlaced && roll < 0.44 && part.h > 120 && rng() < 0.3) {
      const a = roofArm(rng, 34);
      svg += `<g transform="translate(${F(x + part.w * 0.55)},${F(y - a.h + 4)})">${a.svg}</g>`;
      armPlaced = true;
    }
    // buildings touch or leave a small gap; heavy overlap makes floaters
    x += part.w + (rng() < 0.3 ? 16 + rng() * 44 : 2 + rng() * 8);
  }
  // one tall beacon mast breaking the roofline into open sky
  const bm = mast(rng, 168, true);
  svg += `<g transform="translate(1108,${F(baseline - 168)})">${bm.svg}</g>`;
  return { svg };
}

/**
 * The near band is composed, not generated: a ground terrace ties it
 * together, the owner's workshop anchors the left, one big tree breaks
 * the roofline, and a portal gantry frames the right.
 */
export function nearBand(seed: number, width: number, bottom: number): Band {
  const rng = mulberry32(seed);
  let svg = '';

  const groundY = bottom - 92;

  // --- the owner's workshop, left, sitting on the ground line
  const wsW = 330;
  const wsH = 210;
  const wsX = -46;
  const wsY = groundY - wsH + 16;
  const ws = workshop(rng, wsW, wsH);
  let wsWins = '';
  wsWins += winSvg({ x: 168, y: 118, w: 20, h: 26 }, 1.5);
  wsWins += winSvg({ x: 216, y: 122, w: 16, h: 20 }, 1.5);
  svg += `<g transform="translate(${F(wsX)},${F(wsY)})">${ws.svg}${wsWins}</g>`;
  // its chimney, smoking
  const chX = wsX + 104;
  svg += `<rect x="${F(chX)}" y="${F(wsY - 30)}" width="15" height="42" rx="2"/>`;
  svg += `<rect x="${F(chX - 3)}" y="${F(wsY - 36)}" width="21" height="8" rx="2"/>`;
  svg += smoke(chX + 7.5, wsY - 40);

  // --- trees: repeated so the green belongs to the place, not one orphan
  const t = tree(rng, 110, true);
  svg += `<g transform="translate(300,${F(groundY - t.h + 10)})">${t.svg}</g>`;
  const t2 = tree(rng, 62, true);
  svg += `<g transform="translate(668,${F(groundY - t2.h + 8)})">${t2.svg}</g>`;
  const t3 = tree(rng, 74, true);
  svg += `<g transform="translate(1382,${F(groundY - t3.h + 8)})">${t3.svg}</g>`;

  // --- low shed in the middle distance of the band
  const sh = workshop(rng, 140, 84);
  const shWin = winSvg({ x: 58, y: 40, w: 11, h: 14 }, 1.4, false, true);
  svg += `<g transform="translate(500,${F(groundY - 84 + 8)})">${sh.svg}${shWin}</g>`;

  // --- the portal gantry, right: the district's signature machine
  const gw = 470;
  const gx = width - gw - 60;
  const beamY = groundY - 238;
  const legW = 38;
  const leg = (lx: number) =>
    `<path d="M${F(lx)},${F(beamY + 8)} L${F(lx + legW)},${F(beamY + 8)} L${F(lx + legW + 16)},${F(groundY + 10)} L${F(lx - 16)},${F(groundY + 10)} Z"/>` +
    `<path d="M${F(lx + 5)},${F(beamY + 42)} L${F(lx + legW + 8)},${F(beamY + 118)} M${F(lx + legW - 5)},${F(beamY + 42)} L${F(lx - 8)},${F(beamY + 118)} M${F(lx + 1)},${F(beamY + 128)} L${F(lx + legW + 12)},${F(beamY + 204)} M${F(lx + legW - 1)},${F(beamY + 128)} L${F(lx - 12)},${F(beamY + 204)}" fill="none" stroke-width="4" class="w-stroke"/>`;
  svg += `<g>${leg(gx + 26)}${leg(gx + gw - 60)}`;
  // beam + rail
  svg += `<rect x="${F(gx - 12)}" y="${F(beamY - 20)}" width="${F(gw + 24)}" height="32" rx="4"/>`;
  svg += `<rect x="${F(gx - 12)}" y="${F(beamY - 27)}" width="${F(gw + 24)}" height="6" rx="2"/>`;
  // trolley + cable + hook + a crate mid-lift, forever
  const tx = gx + gw * 0.4;
  svg += `<rect x="${F(tx)}" y="${F(beamY + 12)}" width="46" height="24" rx="3"/>`;
  svg += `<circle cx="${F(tx + 38)}" cy="${F(beamY + 24)}" r="3" class="w-ind"/>`;
  svg += `<rect x="${F(tx + 21)}" y="${F(beamY + 36)}" width="3.6" height="72"/>`;
  svg += `<path d="M${F(tx + 14)},${F(beamY + 108)} h18 l-4,9 h-10 z"/>`;
  svg += `<rect x="${F(tx + 4)}" y="${F(beamY + 124)}" width="42" height="32" rx="3" transform="rotate(2.5 ${F(tx + 25)} ${F(beamY + 140)})"/>`;
  svg += `</g>`;

  // --- the ground terrace: an irregular dark strip tying the band together
  let ground = `M-20,${F(groundY + 14)}`;
  for (let x = 0; x <= width + 40; x += 90) {
    ground += `L${F(x)},${F(groundY + 10 + (rng() * 2 - 1) * 5)}`;
  }
  ground += `L${F(width + 20)},${F(bottom + 20)}L-20,${F(bottom + 20)}Z`;
  svg += `<path d="${ground}"/>`;
  // low guard rail along the terrace edge, broken in places
  let rail = '';
  for (let x = 60; x < width - 40; x += 34) {
    if (rng() < 0.12) {
      x += 60;
      continue;
    }
    rail += `<rect x="${F(x)}" y="${F(groundY - 12)}" width="3" height="24" rx="1.5"/>`;
  }
  rail += `<rect x="40" y="${F(groundY - 13)}" width="${F(width - 80)}" height="3.4" rx="1.7" opacity="0.85"/>`;
  svg += `<g opacity="0.9">${rail}</g>`;
  // one lamp post on the terrace, pooling warm light
  const lampX = 760;
  svg += `<rect x="${F(lampX)}" y="${F(groundY - 74)}" width="4" height="76" rx="2"/>`;
  svg += `<path d="M${F(lampX - 8)},${F(groundY - 74)} h20 l-3,-10 h-14 z"/>`;
  svg += `<circle cx="${F(lampX + 2)}" cy="${F(groundY - 70)}" r="5" class="w-lamp-bulb"/>`;
  svg += `<ellipse cx="${F(lampX + 2)}" cy="${F(groundY - 66)}" rx="46" ry="30" fill="url(#v-lampglow)" class="w-glow"/>`;

  return { svg };
}

/** Chimney smoke: four puffs on a slow loop, still under reduced motion. */
function smoke(x: number, y: number): string {
  let out = `<g class="w-smoke-col" aria-hidden="true">`;
  for (let i = 0; i < 4; i++) {
    out += `<circle cx="${F(x)}" cy="${F(y)}" r="${F(7 + i * 2.5)}" class="w-smoke" style="animation-delay:${F(i * 2.8)}s"/>`;
  }
  return out + '</g>';
}

/** Stars for the night sky; opacity is a theme token so day hides them. */
export function stars(seed: number, width: number, maxY: number): string {
  const rng = mulberry32(seed);
  let out = '';
  for (let i = 0; i < 46; i++) {
    const x = rng() * width;
    const y = rng() * maxY;
    const r = 0.7 + rng() * 0.9;
    const o = 0.25 + rng() * 0.6;
    const tw = rng() < 0.18 ? ` w-twinkle" style="animation-delay:${F(rng() * 8)}s` : '';
    out += `<circle cx="${F(x)}" cy="${F(y)}" r="${F(r)}" opacity="${F(o)}" class="w-star${tw}"/>`;
  }
  return out;
}

/** Chunky paper clouds, two drifting sheets. */
export function clouds(seed: number): string {
  const rng = mulberry32(seed);
  const cloud = (cx: number, cy: number, s: number) => {
    let c = `<g class="w-cloud" transform="translate(${F(cx)},${F(cy)}) scale(${F(s)})">`;
    const blobs = 3 + Math.floor(rng() * 2);
    for (let i = 0; i < blobs; i++) {
      const bw = 60 + rng() * 70;
      const bh = 18 + rng() * 14;
      c += `<rect x="${F(i * 34 - rng() * 20)}" y="${F(-i * 9 + rng() * 6)}" width="${F(bw)}" height="${F(bh)}" rx="${F(bh / 2)}"/>`;
    }
    return c + '</g>';
  };
  return (
    `<g class="w-cloud-drift-a">${cloud(140, 150, 1)}${cloud(1180, 90, 0.7)}</g>` +
    `<g class="w-cloud-drift-b">${cloud(760, 210, 0.55)}${cloud(1460, 250, 0.85)}</g>`
  );
}
