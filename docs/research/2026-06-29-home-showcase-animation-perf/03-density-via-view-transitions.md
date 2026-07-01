# Report 03 — animating density too, via View Transitions

> Follow-up to [02-new-approach.md](02-new-approach.md), which deliberately *held density constant* because animating it per-frame reflows the masonry. This report brings the density morph back without that cost.
> Files: `www/src/modules/marketing/cards.tsx`, `www/src/lib/styles.tsx` (new `transitionOnChange` prop). `www/src/styles.css` paint-only rule unchanged (it's now the fallback).

## The problem restated

Density is the one preset axis that changes box geometry (padding / gap / font-size / control heights). Animating it means animating layout, and layout can't run on the compositor — so the CSS-transition approach of report 02 can only *snap* it (and even snapping re-balances the multi-column masonry, leaping cards). To morph density smoothly we need a technique that animates a layout change **without per-frame layout**.

## The tool: View Transitions API

`document.startViewTransition(() => flushSync(setState))` is exactly that. The browser:
1. snapshots the current (old) state,
2. runs our DOM update synchronously (`flushSync` — new palette + radius + **density**),
3. snapshots the new state,
4. animates old→new **on the compositor**.

So a swap costs **one reflow** (step 2, for the density change) plus GPU-driven animation — never the ~30 per-frame reflows that made the first attempt jank. The codebase already uses this exact pattern for the docs demo expand/collapse (`modules/docs/demo.tsx`), so it's a proven idiom here.

### A *layout* animation, not a crossfade

A bare root transition just cross-dissolves the changed region. To make the cards actually **move and resize** between density layouts (the "magic move" effect), every card gets a stable `view-transition-name` (`dsc-<key>`, applied in `cards-grid.tsx`, gated to the landing variant). The browser then creates a `::view-transition-group` per card and animates each card's **position and size** from its old rect to its new rect via compositor transforms, while the card's content crossfades inside. So when a denser preset re-spaces the masonry, the cards *slide and grow into place* instead of dissolving — and the column re-balancing that used to make cards leap now reads as them gliding to their new slots. 17 cards are named (5 rail + 1 banner + 11 masonry cells); the timing is set on `::view-transition-group(*)` (380ms), scoped to a `dotui-showcase-morphing` class the showcase toggles so it doesn't touch other view transitions (e.g. the docs demo).

This replaces the CSS paint-tween for VT-capable browsers, so the provider must *not* also fire its tween (it would double up). Hence the new `DesignSystemProvider` prop `transitionOnChange` — the showcase passes `transitionOnChange={!useViewTransition}`.

### Two paths

| | View Transitions (Chrome/Edge/Safari/recent FF) | Fallback (no VT) |
|---|---|---|
| morph | per-card position+size animation (layout morph) | CSS paint-tween (color + radius) |
| density | **varies** (`preset.density`) — cards slide/resize | held constant (would reflow) |
| cost/swap | one reflow + GPU transforms | one reflow + paint-only tween |

SSR and first paint render identically in both paths (index 0 = the `compact` baseline), so there's no hydration shift; `useViewTransition` only flips on after mount and only matters once cycling starts.

## The catch we found, and the fix: the page shift

A density change grows the grid's content, and the grid is **top-anchored** in flow — so it grows **downward**, pushing everything below it down. The next section ("Built on modern tools," pulled up over the masked tail with `-mt-[380px]`) moves by up to **280px** (measured, at the 4-col/wide layout; ~0 at the 3-col band). This is a layout fact, independent of *how* you animate — **the first attempt (#302) had this jump too.**

We can't pin the showcase to a fixed height to absorb it: the layout is intentionally content-height-driven and **bottom-anchored** (mask and `-mt` both measured from the bottom), and the 3-col grid height varies continuously with width — a fixed px height would clip visible content at narrow widths.

The fix exploits the top-anchoring: **only swap while the showcase's bottom (plus the `-mt` overlap) sits below the fold**, so the downward growth happens off-screen, while the *visible* top cards still re-space on-screen (the wanted morph). It's a cheap per-tick `getBoundingClientRect` check:

```js
const rect = node.getBoundingClientRect()
const visible = rect.top < vh && rect.bottom > 0
const growthBelowFold = rect.bottom > vh + 420 // ≈ largest -mt (380) + buffer
if (!visible || !growthBelowFold) return // off-screen, or the shift would show
```

When the user scrolls down far enough that the next section approaches the viewport, `growthBelowFold` goes false and cycling pauses — so the section never visibly jumps. Swaps are also skipped within 250ms of a scroll (a same-document view transition briefly snapshots, and so freezes, the viewport — that would hitch an active scroll). Reduced-motion visitors don't cycle at all.

## Verified (real dev server, headless Chrome via CDP)

Two passes (`harness/verify2.mjs`, `harness/verify3.mjs`), showcase scrolled into view:

- **17 cards carry a `view-transition-name`** (`dsc-booking`, `dsc-aiprompt`, … = 5 rail + 1 banner + 11 masonry cells) — so the browser builds a `::view-transition-group` per card and morphs each one's position + size.
- `morphClassSeen: true` — the `dotui-showcase-morphing` class toggles each swap, so the scoped 380ms timing applies.
- `distinctPalettes: 8` (across a longer window) — all presets cycle, density included; `vtSupported: true`; `flagFired: false` — the CSS tween correctly stays off on the VT path (no double animation).
- `pageErrors: []`; the VTBox wrappers don't disturb the rail/banner layout (`harness/vt-layout-morph.jpg`).
- The ~280px section shift lands below the fold, exactly as gated.

(The per-card *motion* itself can't be captured in a static headless frame, and headless has no GPU — see caveats. The mechanism — named groups + morph fired — is confirmed.)

## Honest caveats

- **Headless can't prove the GPU win.** Headless Chrome has no GPU, so it software-composites; its per-swap main-thread number (~180ms, ≈ the re-skin floor) *includes* work a real GPU offloads. The architectural guarantee is what matters and holds: **one reflow per swap, then compositor transforms — zero per-frame layout** during the morph (vs ~30 reflows in #302).
- **The card content still crossfades.** The group *box* morphs position/size (real layout animation), but the old/new card *contents* crossfade inside it (that's how VT fills a resizing group). For a density change the box motion dominates and reads as a move/resize; on a card that changes aspect ratio you may notice a brief content crossfade. Different from the fallback's pure color interpolation.
- **Mask-flash, handled by the gate.** A named card's snapshot is lifted to the top layer *without* the ancestor bottom-mask, so a faded card would briefly show at full opacity during the morph. The below-the-fold gate keeps the masked tail off-screen during swaps, so this isn't visible; if cards near the fade edge ever flash, raise `SHIFT_SAFE_MARGIN`.
- **The shift is hidden, not eliminated.** The ~280px growth still happens; the gate keeps it off-screen. Robust elimination would be a layout redesign (fixed-height frame), deliberately not taken on.
- **Column re-balancing reads as motion.** When density shifts a card to a different masonry column, its group slides there — usually a nice glide, occasionally a longer diagonal move if a card jumps columns. Tunable via the 380ms duration in `styles.css`.
