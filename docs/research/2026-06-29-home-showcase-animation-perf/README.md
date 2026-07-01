# Home showcase preset-morph animation — performance

> Status: assessment + fix, 2026-06-29. Subject: the landing `CardsGrid` showcase that auto-cycles design-system presets and tweens each swap.
> Decision (current): **report 04** — drop the auto-cycle entirely; a **preset selector** over the cards drives the morph on click, and the CSS rule tweens the real density **spacing** (padding/gap grow/shrink), not a crossfade. Reports 02–03 (paint-only at constant density; density via View Transitions on an auto-cycle) are superseded — kept for the reasoning trail. The through-line across all of them: the original auto-cycling layout thrash of [#302](https://github.com/mehdibha/dotUI/pull/302) is gone.
> Key finding (report 04): animating spacing across the ~1k-node grid is **layout-bound (~60ms/frame)** — no technique makes full-grid layout animation 60fps; the levers are fixed columns (no jumping + lets `content-visibility` skip off-screen cards), trimming the property cascade, firing on click not a loop, and a short morph.

Point-in-time snapshot. Numbers are from headless Chrome over the DevTools Protocol; treat the **main-thread / CPU** figures (layout, style-recalc, Long Tasks) as accurate and the **paint** figures as an upper bound (headless has no GPU, so it software-rasterises — real hardware composites paint and is faster).

## Reports

- [01-current-approach.md](01-current-approach.md) — the first attempt (#302): what it does, why it's "awful," measured.
- [02-new-approach.md](02-new-approach.md) — paint-only + constant density. (Superseded.)
- [03-density-via-view-transitions.md](03-density-via-view-transitions.md) — density morph on an auto-cycle via the View Transitions API. (Superseded.)
- [04-click-driven-spacing-morph.md](04-click-driven-spacing-morph.md) — **shipped**: preset selector + real spacing tween on click, the fixed-columns switch, and the layout-bound cost finding.

## TL;DR

The first attempt tweened **16 properties — including layout-inducing ones (`padding`, `gap`, `width`, `height`, `font-size`, `line-height`)** — across `[data-dotui-transition] *`, i.e. every one of the showcase's ~1000+ nodes, while also **cycling density** (which resizes every card and re-balances the CSS multi-column masonry). So every animation frame ran a full-subtree **layout + column rebalance**. That is the single most expensive thing a CSS transition can do, repeated ~30×/swap, forever.

The fix:
1. **View Transitions where supported** (report 03) — wrap each swap in `document.startViewTransition(() => flushSync(setState))`, and give each card a `view-transition-name`. The browser morphs every card's position + size between the two density layouts on the compositor — a real layout animation (palette + radius + density), one reflow + GPU transforms, never the per-frame layout storm. A `getBoundingClientRect` gate only swaps while the showcase bottom is below the fold, so the density-driven page growth stays off-screen.
2. **Paint-only + constant density as the fallback** (report 02) — no-VT browsers transition only paint properties (`color`, `border-radius`) and hold density constant so the masonry never reflows. Palettes alone keep all 8 presets distinct.

Measured (5–4 preset swaps, 1320-node grid, headless Chrome):

| | first attempt | shipped fix |
|---|---|---|
| native (1×) — Long Tasks | 5 tasks / ~300ms blocking, worst frame 67–75ms | **0 tasks**, worst frame ~34–50ms |
| 4× CPU throttle — mean frame | ~160–174ms (≈6fps), worst 233ms | ~70–102ms, worst 133–199ms |

On the **real** grid the property-list choice stops mattering once density is constant (`paint` ≈ `paint+layout`, both ~2.9s/12s) — confirming **constant density is the dominant lever**. A separate per-swap floor (~167ms recalc spike, ~320ms/swap) is the cost of re-skinning the subtree and is present with the animation entirely disabled.

## Reproduce

Everything is in [`harness/`](harness):
- `harness.html` — a faithful ~1320-node masonry facsimile with the competing transition rules, toggled by `data-mode`.
- `measure.mjs` — CDP driver: launches Chrome, CPU-throttles, runs every mode, prints `results.json`.
- `verify.mjs` — loads the **real** running dev server and attributes the cost (transition off vs paint vs paint+layout) on real components.
- `results.json`, `real-morph.jpg` — captured output.

`node harness/measure.mjs` (synthetic) · `node harness/verify.mjs http://localhost:PORT/` (real app).
