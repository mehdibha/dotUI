# Report 01 — the current approach (#302) and why it's slow

> Subject: [PR #302 "feat: animate scoped preset changes, cycle home showcase"](https://github.com/mehdibha/dotUI/pull/302), branch `claude/scoped-preset-morph`.
> Verdict: correct idea, pathological implementation. It animates the most expensive possible set of properties across the largest possible set of nodes, every frame.

## What it does

Three pieces:

1. `www/src/modules/marketing/cards.tsx` — wraps the landing `CardsGrid` in a **scoped** `DesignSystemProvider` and steps `presetIndex` through all 8 gallery presets on a 3s `setInterval`. Each preset differs in **palette (color), radius factor, and density** (the 8 presets span all three density levels: compact / default / comfortable).
2. `www/src/lib/styles.tsx` — when the scoped provider's inputs change, it flags its subtree with `data-dotui-transition` in the same commit as the new tokens, then clears the flag ~500ms later (a time-boxed window so the tween doesn't bleed into the components' own hover/press transitions).
3. `www/src/styles.css` — the rule that does the tween:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-dotui-transition],
  [data-dotui-transition] * {
    transition-property:
      color, background-color, border-color, outline-color, text-decoration-color,
      fill, stroke, box-shadow, padding, gap, width, height, min-height,
      font-size, line-height, border-radius;
    transition-duration: var(--dotui-transition-duration, 500ms);
    transition-timing-function: var(--dotui-transition-ease, cubic-bezier(0.4, 0, 0.2, 1));
  }
}
```

## Why it's "awful" — the mechanism

Two independent things make every frame of every swap as expensive as it can be.

### 1. The transition list contains layout-inducing properties

`padding`, `gap`, `width`, `height`, `min-height`, `font-size`, `line-height` cannot be interpolated on the compositor — changing any of them forces the browser to re-run **layout (reflow)**. A CSS transition samples its properties **every animation frame**, so for the 500ms tween (~30 frames at 60Hz) the browser runs layout ~30 times.

### 2. …applied to every node of a huge subtree, whose layout is a CSS multi-column masonry

The selector is `[data-dotui-transition] *` — the universal selector. The showcase isn't small: it renders ~18 rich cards (`AiPrompt` alone is 15KB of markup, `Notifications`, `Payment`, `Booking` with a full calendar, …). The faithful facsimile used for measurement counts **1320 DOM nodes**, and the real grid is in the same range. So the layout above runs across ~1300 elements per frame.

Worse, those cards live in a **CSS multi-column** masonry (`columns-2` / `columns-3`). Multi-column is one of the most expensive layout modes because the browser must measure every item and **re-balance the columns** whenever any height changes — and density is being cycled, so heights *do* change on every swap. The result each frame: full-subtree reflow **plus** a column rebalance. Cards also visibly leap between columns as balancing shifts.

### Net

Per swap, ~30 frames, each frame = layout(1300 nodes) + column rebalance + paint(1300 nodes, incl. `box-shadow`). The main thread is saturated for the entire tween, which blocks scrolling, input, and the neighbouring skeleton-rail shimmer. This repeats every 3 seconds.

## Measured

Headless Chrome over CDP, 1320-node grid, 5 preset swaps measured per mode (warm-up dropped). The reliable metric is **Long Tasks** (main-thread work >50ms — pure CPU, accurate in headless) and **worst single frame**. Absolute fps from headless `requestAnimationFrame` is *not* reliable (the headless BeginFrame source flips between a 30Hz and 60Hz base run-to-run), so it is not reported as fps.

### Native speed (no CPU throttle)

| metric | first attempt |
|---|---|
| Long Tasks (count / total) | 5 tasks / **297–334ms** blocking |
| worst single frame | **67–75ms** |
| mean frame | 26–38ms |

Five main-thread stalls and frames up to ~75ms — visible hitching even on a fast desktop.

### 4× CPU throttle (≈ a mid-range laptop / high-end phone)

| metric | first attempt |
|---|---|
| Long Tasks (count / total) | 16–19 tasks / **3002–3135ms** blocking |
| worst single frame | **233ms** |
| mean frame | **160–174ms** (≈ 6fps) |

Across 5 swaps the page spends **~3 full seconds** with the main thread blocked, and individual frames hit a **quarter-second**. This is a slideshow, and every hitch also freezes the rest of the page.

> At 6× throttle the renderer stalled hard enough that the measurement harness couldn't complete — itself a data point about how degenerate the layout-thrash path gets on weak hardware.

## Root cause, in one line

It transitions **layout** properties across **every node** of a **multi-column masonry** while **resizing** that masonry — so it pays full reflow + column rebalance on every animation frame. The fix is to stop doing all three. See [02-new-approach.md](02-new-approach.md).
