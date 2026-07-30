# Design & engineering decisions

A record of the judgement calls in this build — what was decided and why — so future changes can
be made with the reasoning in hand rather than against it. (v2: the world build. v1 was the
engineering-drawing system; its bones — tokens, type, accessibility discipline — carry forward.)

## The one idea

**The site is a place: an invented maker-district, seen from the owner's terrace.** The home page
opens on a procedurally generated skyline of workshops, sawtooth factories, silos, water tanks
and a portal gantry holding a crate mid-lift — generated at build time from a fixed seed, as pure
SVG, with zero client JavaScript required to *see* it. Warm windows in a cold teal night say
"someone is still building." Sections are places in that world (the invention floor, the workshop
wall, the proving ground, the workshop door), the copy walks you around it, and machines — the
project cards — wake up when approached.

## The world, technically

- **Depth = fog.** Three skyline bands (far/mid/near) plus sky and celestial layers; each band's
  colour steps toward the sky value, and gradient veils sit between bands. Every form is shaded
  by a per-shape gradient lit from the sun/moon side; a grain overlay keeps it painted, not
  vector-crisp.
- **Seeded generation.** `src/world/parts.ts` is the parts kit (workshop, rowhouse, sawtooth,
  tower, silo, water tank, mast, tree, small gantry, roof arm); `src/world/generate.ts` composes
  bands with a fixed-seed RNG — layout varies along the band but is identical on every build.
  The near band is composed, not random: terrace, owner's workshop with smoking chimney, trees,
  lamp post, and the big gantry.
- **Day/night are the two themes** — the same town at two hours. Dark (night) is default. The
  toggle is a sky animation: sun and moon rise/set on the swing spring, gradients tween, windows
  catch alight in three staggered waves. All colour lives in CSS custom properties, so the
  animation tweens tokens, never markup.
- **Ambient life:** chimney smoke, three flickering windows, one blinking mast beacon, drifting
  clouds, twinkling stars — all slow, peripheral, and killed by `prefers-reduced-motion`, which
  gets the world as a still painting.
- **Parallax:** cursor drift and scroll separation per band (transform-only, rAF, paused
  off-screen). The first visit gets a sub-2s assembly (bands far→near, windows light, title
  resolves), skippable on any input, remembered in localStorage.

## Palette (contrast verified per pair)

| Token | Night (default) | Day | Job |
|---|---|---|---|
| page / sky | `#0B1E28` (`#06141C→#16394A` gradient) | `#C5ECF0` (`#7CD6E4→#C5ECF0`) | the world's air |
| panel | `#142E3A` | `#FBF8EF` | plaques, cards, content |
| text | `#EAF2F5` | `#1E2E36` | ≥12:1 on panels |
| muted | `#9DB4BF` | `#4E6470` | ≥4.5:1 everywhere it appears |
| accent (the hero colour) | `#F0A63C` | `#B57B1E` UI / `#7A4E0B` as text | **one job: anything that asks to be pressed** — and the warm windows share its family |
| bands far/mid/near | `#1A3F51 / #143243 / #0A1A22` (+lit variants) | `#8FCDD6 / #6A9DAA / #3E5D6B` | aerial perspective |

Warm colour is rationed by design: windows, lamp pools, one beacon, and the actions.

## Motion: three springs, machines with mass

CSS `linear()` approximations, used everywhere and nowhere else:
`--spring-snap` (~200ms, small UI), `--spring-pop` (~420ms, cards/reveals),
`--spring-swing` (~700ms, camera/page/sky). Page transitions are camera moves: Astro view
transitions with shared cover/title elements — a card *becomes* its page. Filtering is FLIP:
departing machines power down, survivors travel, arrivals rise. Never more than two things
animate at once; the ambient layer is exempt and slow.

## Machines (the cards)

Physical housings: thickness via a machined bottom edge, powered-down covers (desaturated) that
wake on hover/focus — lift, tilt toward the cursor (fine pointers only), indicator LED lights,
one technical detail (the first real metric) slides out of the plaque. Status is machine state:
in-progress wears warning tape and a breathing LED; retired sits dusty at 82% opacity; featured
machines are edge-lit at rest. All of it collapses to a clean still card under reduced motion.

## The asset system

Every visual has a procedural default and an optional file override (see `SWAP.md`): hero GLB
(`public/media/models/hero.glb` summons a 3D stage on the home page), display face
(`public/fonts/display*.woff2`), grain texture (`public/media/textures/grain.png`), ambience
(`public/media/audio/ambience.mp3` — no file, no button, no sound). Project models flow through
the admin as before; the viewer auto-frames wrong-scale/off-origin exports (verified with a
100×-scaled test model) and applies a slow idle so nothing sits frozen.

## Honest cuts

- **Procedural per-project 3D machines (brief §12 B2 fallback) — attempted in design, cut at the
  quality gate.** A convincing procedural machine per project is weeks of art; a toy-looking one
  cheapens real work. Projects without models simply have no 3D section, which was already a
  designed state; real GLBs get the full treatment.
- **Pinned scroll-jacking sections — cut.** The journey uses parallax separation and staggered
  reveals; native scroll always wins. Two pins that fight a laptop trackpad cost more than they
  pay.
- **Custom glowing cursor — cut.** With tilt physics, wake states, lamp glow and a live sky, a
  replaced cursor crossed the "two things animating" budget and added a failure mode on every
  input modality. The brief's own taste guardrails outrank its feature list.
- **Letter-by-letter headline animation — cut** for the same reason; the hero resolves as part of
  the world assembly instead.

## Quality tier shipped (brief §15)

**Tier 1 — the full layered world** (generated town, fog, ambient life, day/night sky animation),
with the 3D layer scoped to real supplied models rather than procedural fakes.
