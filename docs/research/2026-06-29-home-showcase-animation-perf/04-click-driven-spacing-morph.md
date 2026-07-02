# Report 04 — click-driven spacing morph (the shipped approach)

> Supersedes the auto-cycling approaches (reports 02–03). Files: `www/src/modules/marketing/cards.tsx`, `www/src/modules/marketing/preset-switcher.tsx`, `www/src/components/showcase/cards-grid.tsx`, `www/src/styles.css`, `www/src/lib/styles.tsx`.
> User ask: drop the auto-cycle; put a preset selector over the cards; on pick, the whole design system updates and the **density updates smoothly** — the spacing actually grows/shrinks — *not* a crossfade.

## What shipped

- **A preset selector** (`PresetSwitcher`) floats over the showcase: a pill bar, one chip per preset with a palette dot + the name, plus a one-line caption. It sits outside the scoped provider, so it always wears the stable site theme.
- **On pick**, the scoped grid re-skins and the provider flags its subtree (`data-dotui-transition`); the CSS rule tweens **both** paint (color/radius/shadow) **and the density spacing** (`padding`, `gap`). So a denser preset visibly tightens the cards, a looser one opens them up — a real layout tween.

The auto-cycle, the View Transitions, and the below-the-fold gating are all gone. Two things make the layout tween affordable here that weren't true before:

1. **It fires only on an explicit click**, not a 3s loop. A one-off ~400ms layout animation is fine; doing it forever was the original sin.
2. **The masonry is now fixed flex columns**, not CSS `columns` — see below.

## Why the layout had to change: CSS `columns` is the enemy of a smooth density tween

Measured per-frame cost while morphing (headless Chrome, CDP, real grid):

| | max frame | mean frame | main-thread blocking / morph |
|---|---|---|---|
| 20-prop transition incl. width/height | 682ms | 253ms | 1391ms |
| trimmed to spacing sources (padding, gap) | 308ms | 98ms | 945ms |

The first cut was a **property cascade**: with `width`/`height` in the transition, a parent's animated padding changes a child's computed size, which then animates *its* width, recursively. Trimming to the spacing *sources* (padding, gap — derived sizes follow instantly) roughly halved it.

What did **not** help: `content-visibility:auto` on the cells, and even switching the masonry to fixed columns, both left the headless numbers flat (~95ms/frame). The decisive measurement — **pure layout time per frame, excluding paint** — explains why:

```
forced layout / frame ≈ 62ms median, ~180ms p90
```

Animating padding across the ~1k-node grid is **layout-bound at ~60ms/frame**. That's CPU work no GPU offloads. CSS `columns` makes it worse two ways — it re-runs the multi-column **balancer** every frame (and the cards visibly **jump** between columns as heights change), and it forces every card to be measured so `content-visibility` can't skip the off-screen ones.

So the grid's landing layout moved to **fixed flex columns** (`FixedColumns` in `cards-grid.tsx`): cards grow in place (no jumping), and — being plain block flow — `content-visibility:auto` can finally skip the off-screen cards. The /create preview keeps CSS `columns` (it never animates).

## Honest status on smoothness

The end state is correct and verified (the spacing opens up, colors/radius change, no broken layout — `harness/cap-before.jpg` → `cap-after.jpg`). The *transition* is the caveat:

- **It's layout-bound (~60ms/frame for the full grid).** No amount of GPU helps layout. On real hardware two things this harness can't show should bring that down: `content-visibility` skips the off-screen cards (it doesn't engage in headless, which is why the numbers stayed flat), and GPU paint removes the software-raster cost that dominates the headless rAF interval. Realistic real-hardware expectation: a brisk, mostly-smooth morph, not a guaranteed 60fps.
- **Mitigations in place:** fixed columns (no jumping), `content-visibility` (skip off-screen on real HW), trimmed property set (no cascade), a short **400ms ease-out** (fewer perceptible frames reads smoother for a layout-bound animation than a long slow one). Reduced-motion snaps instantly.
- **If it still isn't smooth enough on the target hardware, the only real lever left is animating fewer elements** — e.g. cap the spacing tween to the cards above the fold and let the rest snap, or trim the showcase card count. True 60fps layout animation of a grid this large isn't achievable; the cost is the node count, not the technique.

## Dials

`--dotui-transition-duration` / `--dotui-transition-ease` (styles.css) tune the morph; keep `PRESET_TRANSITION_MS` (lib/styles.tsx) ≥ the duration.
