# Design & engineering decisions

A record of the judgement calls in this build — what was decided, and why — so future changes
can be made with the reasoning in hand rather than against it.

## The one idea

**The portfolio is set like an engineering drawing.** Hairline rules structure every page the
way border lines structure a drawing sheet; labels and data are set in IBM Plex Mono like
drawing annotations; dates and metrics use tabular figures; the footer is a title block
(TITLE / DRAWN / REV / SCALE); and the hero's right half is an exploded view of a robot joint
whose numbered balloons are the links to the three featured projects — the figure is
navigation, not wallpaper. Everything else is deliberately quiet so this one idea reads.

The risk taken: the drawing conceit could tip into theme-park engineering if it spread. It is
therefore confined to structure (rules, mono annotations, the title block) and a single figure,
drawn with hairline strokes in the text colour, animated once on load and never again. The known
cost: the hero figure is hand-drawn SVG, so its balloons map to *featured slots 1–3*, not to
specific projects — mark different projects as featured and the balloons follow automatically,
but the drawing itself doesn't change.

## Palette

| Token | Dark (default) | Light | Job |
|---|---|---|---|
| `--c-ink` | `#0F1216` | `#F6F7F8` | page |
| `--c-panel` | `#151A20` | `#FFFFFF` | raised surfaces |
| `--c-line` | `#262D36` | `#D8DDE3` | hairline rules (decorative) |
| `--c-line-strong` | `#626D7B` | `#808B97` | interactive borders (≥3:1) |
| `--c-text` | `#E7EBEF` | `#1A2027` | text |
| `--c-muted` | `#9BA6B2` | `#5B6673` | secondary text (≥4.5:1) |
| `--c-accent` | `#E4A339` | `#B57B1E` (`#8A5C14` as text) | **one job: marks anything that responds to you** — links, buttons, focus, active filters |

Light mode is drafting vellum with dark graphite ink — designed, not inverted; the amber darkens
where it carries text so contrast holds.

## Type

Two families, three roles. **Archivo** (variable, self-hosted, latin subset): expanded width
~112% at semibold for display — the flavour of DIN plate lettering on machine nameplates —
and normal width for body text at 17px. **IBM Plex Mono** for the utility layer: labels, dates,
dimensions, metrics, code. Scale is a perfect fourth (1.333) on the 17px body, display clamped
`2.4rem → 4rem`.

## Motion

Tuned like a servo: fast approach, clean settle, no overshoot. Two easings as tokens
(`--ease-settle`, `--ease-brisk`), three durations (140/240/420ms). One page-load sequence
(hero, 5 steps × 60ms), one scroll-reveal pattern (fade-rise 14px, 40ms stagger, fires once),
the hero figure plots its strokes once. `prefers-reduced-motion` collapses all of it to fast
opacity only.

## Where this build deliberately departs from the original brief

1. **Astro static output instead of a React SPA + prerender plugin.** Content only changes via
   commits, which already trigger rebuilds — so pages are baked at build time. Crawlers get real
   HTML by construction (the brief's biggest stated fear), public routes ship ~0 KB of framework
   JS, and deep links are real files.
2. **No `404.html` copy hack.** The brief required copying `index.html` to `404.html` to keep an
   SPA's deep links alive. Fully static output makes that unnecessary: `404.html` is the real,
   designed 404 page, served with a real 404 status.
3. **Content baked at build, not fetched at runtime.** No loading states, no fetch-failure
   states, no layout shift on the public site; a malformed content file fails the *build* (with
   a message naming the file, item and field), never the visitor. The admin still reads/writes
   live via the GitHub API, so it is never stale.
4. **No framer-motion, no lucide-react, no GoatCounter.** The motion spec needs ~30 lines of CSS
   and one IntersectionObserver, not a runtime animation library. Icons are a handful of inline
   SVGs. Analytics was cut entirely: a third-party request on every view to show single-digit
   view counts on a young portfolio is negative value; it can be added later if traffic ever
   justifies it.
5. **Reordering uses ↑/↓ buttons, not drag-and-drop.** Drag fights scrolling on the 390px touch
   viewport the brief itself prioritises, and buttons are keyboard-accessible for free.
6. **Sort control on /projects cut.** The grid follows the owner's curated order (with search,
   category and tag filters for discovery). A sort dropdown would let a visitor un-curate the
   page; the curation *is* the feature.
7. **Contents API kept (not the Git Data API), with ordering as the integrity mechanism.**
   Media uploads commit *before* the JSON that references them, so a saved item can never point
   at a missing file. The one remaining failure mode (an uploaded file nobody references) is
   harmless and visible in the media library as "not used anywhere."

## Kept from the brief, on purpose

`<model-viewer>` for 3D (it is genuinely the right tool: orbit controls, posters, lazy loading —
hand-rolled three.js would be strictly worse); Formspree-or-mailto for contact; skills as plain
tags; the collection-per-file JSON layout (single editor, simple conflict story); dark theme
default with a first-class light theme; the route list (minus nothing the client asked for).
