# Report 02 — the new approach: paint-only morph at constant density

> Branch: `claude/distracted-lumiere-308622`. Files: `www/src/styles.css`, `www/src/lib/styles.tsx`, `www/src/modules/marketing/cards.tsx`.
> Goal (user): "make home animation performant but should stay smooth."
> Update: the user then asked for the density morph back too. That's [report 03](03-density-via-view-transitions.md) — a View Transition handles density on the compositor where supported. The paint-only + constant-density design below is now the **fallback** for browsers without the View Transitions API.

## The idea

Keep the feature — the showcase auto-cycles presets and each swap glides — but change *what* glides so the browser never leaves the cheap part of the rendering pipeline. Two changes, both small:

1. **Tween paint-only properties.** The transition list is now exclusively `color` / `background-color` / `border-color` / `outline-color` / `text-decoration-color` / `fill` / `stroke` / `border-radius`. Every layout-inducing property (`padding`, `gap`, `width`, `height`, `font-size`, `line-height`, …) is gone, so **layout never runs during the tween**. `box-shadow` is also dropped — it's the priciest paint for the least payoff (a subtle dark-on-dark shadow snapping is imperceptible), and dropping it buys measurable headroom on weak hardware.
2. **Hold density constant.** The cycle no longer changes density (`density={DEFAULTS.density}`). Density is the *only* preset axis that changes box geometry, and changing it resizes every card, which re-balances the CSS multi-column masonry (cards leap between columns) — a reflow that can't be made smooth at this DOM scale. With it pinned, the **only** things that vary across presets are palette and radius — both pure paint. The masonry geometry is frozen; nothing reflows. The 8 presets stay visually distinct on palette alone.

The provider's flag machinery (signature detection → `data-dotui-transition` for one time-boxed beat → clear) is kept verbatim from #302 — it was never the problem.

### Why not the obvious alternatives

- **View Transitions API** (`document.startViewTransition`) would crossfade the whole subtree as two composited snapshots — O(viewport pixels), independent of node count, and it would animate density too. Rejected: a same-document view transition snapshots and **freezes the entire viewport** for the duration, and the showcase sits directly between two **animated skeleton-rail shimmers**. Every 3s those would hitch. (Scoped/element-level view transitions, which would avoid this, aren't stable yet.)
- **Double-buffer crossfade** (render old + new themed grids, fade opacity): smooth and composited, but it needs the grid absolutely-positioned at a known height — the showcase is an auto-height masonry, so this fights the layout. View Transitions is the same idea done by the compositor; since that's out, this is too.
- **Animating CSS custom properties on the scope root** (one transition instead of 1300) needs every semantic `--color-*` var registered via `@property <color>` to interpolate, and the dotUI palette emits `oklch()` / `color-mix()` values whose registration is fragile. High effort, touches the sensitive theme-emission path, uncertain payoff. Left as a possible future optimization.

## The change

`www/src/styles.css` — paint-only, layout-free:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-dotui-transition],
  [data-dotui-transition] * {
    transition-property:
      color, background-color, border-color, outline-color,
      text-decoration-color, fill, stroke, border-radius;
    transition-duration: var(--dotui-transition-duration, 450ms);
    transition-timing-function: var(--dotui-transition-ease, cubic-bezier(0.4, 0, 0.2, 1));
  }
}
```

`www/src/modules/marketing/cards.tsx` — `density={DEFAULTS.density}` (constant) instead of `preset.density`; everything else (palette, radius tokens, params) still flows from the preset. Reduced-motion visitors don't cycle.

## Measured: before → after

Same harness as report 01 (headless Chrome, CDP, 1320-node grid, CPU = main-thread figures are accurate; paint is an upper bound because headless has no GPU).

### Synthetic harness — native speed (1×)

| | first attempt | **shipped fix** |
|---|---|---|
| Long Tasks (count) | 5 | **0** |
| blocking total | ~300ms | **0ms** |
| worst frame | 67–75ms | **34–50ms** |

At native speed the fix drops **every** frame under the 50ms long-task threshold: zero main-thread stalls vs five.

### Synthetic harness — 4× throttle (mid/low device)

| | first attempt | **shipped fix** |
|---|---|---|
| mean frame | 160–174ms | **70–102ms** |
| worst frame | 233ms | **133–199ms** |

Still heavy under 4× (any technique that repaints a 1300-node surface is, on a 4×-slower CPU with no GPU), but the worst hitch is ~40% shorter and the per-frame layout storm is gone. The variant sweep isolates the remaining levers (4× worst frame): full paint **199ms** → drop shadow **167ms** → color-only **133ms**. The shipped rule keeps color + radius and drops shadow — the balance point between "richest meaningful morph" and low-end cost.

### Real grid — attribution (the part the synthetic harness can't show)

Loading the **actual** dev server home page and toggling the transition behaviour for 12s windows each (~4 swaps), the cost decomposes:

| real-grid mode | blocking / 12s | tasks | worst task |
|---|---|---|---|
| transition **off** (re-skin only) | **1277ms** | 12 | 167ms |
| **paint** (shipped) | 2880ms | 31 | 168ms |
| paint **+ layout props** (≈ #302's list) | 2972ms | 32 | 166ms |

Two things to read here:

1. **`paint` ≈ `paint + layout`.** Once density is constant, re-adding the layout properties to the transition list changes almost nothing — because no layout-affecting value changes between presets anymore. **Constant density is doing the heavy lifting**; the property-list trim is the belt to its braces. This is the strongest evidence the fix targets the right thing.
2. **There's a floor.** Even with the transition *off*, each swap costs ~320ms with a ~167ms spike. That's the scoped provider **rebuilding its `<style>` closure and React re-rendering the grid**, forcing one style recalc of the subtree. It's the cost of *re-skinning* 1000+ nodes, not of *animating* — it's present in the static, no-animation case, and in any preset-cycling design.

End-to-end the real morph was verified working: scoped provider present, 5 distinct palettes cycled over the window, the `data-dotui-transition` flag fired each swap, **no runtime errors**, and the captured frame renders correctly mid-cycle (`harness/real-morph.jpg`).

## Honest caveats

- **Headless inflates paint.** The real-grid `paint` total (2880ms/12s) is an upper bound: headless software-rasterises with no GPU. On real hardware the paint frames of a color/radius crossfade are composited and much cheaper; the CPU-accurate parts (the eliminated layout, the recalc floor) are the trustworthy numbers.
- **The re-skin floor remains.** ~167ms once per swap. It is *not* what the user reported (that was the per-frame animation jank, now gone), and it exists with the animation disabled — but it's the next thing to attack if the swap instant needs to be glassy.

## Follow-ups (not applied here — each is its own decision)

- **Shrink the recalc/paint surface with `content-visibility: auto` (+ `contain-intrinsic-size`) on off-screen cards.** The grid is tall and mostly below the fold; skipping off-screen cards would cut both the re-skin floor and the tween cost. Needs care: `content-visibility` interacts awkwardly with CSS multi-column balancing, so it must be verified visually, not blind-added.
- **Cheaper preset swaps.** Precompute the 8 presets' scoped CSS once and toggle the active sheet instead of rebuilding the harvested closure on every swap — trims the JS half of the 167ms spike.
- **Low-end gate.** Optionally pause cycling on weak devices (`navigator.hardwareConcurrency`, `matchMedia('(update: slow)')`) in addition to the existing `prefers-reduced-motion` opt-out.
- **`color`-only escape hatch.** If real-hardware testing still shows tween jank on low-end, dropping `border-radius` (it already snaps shadows) is the cheapest crossfade — at the cost of the corner-morph.
