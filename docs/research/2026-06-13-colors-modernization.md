# @dotui/colors — modernization gap analysis & roadmap

> Status: point-in-time research, 2026-06-13. A survey of `@dotui/colors` against modern color-system SOTA (Radix, Tailwind v4, Adobe Leonardo, Material 3 HCT, Huetone, culori, Apple HIG, APCA/WCAG 3) to find what's missing for "recreate almost any design system" — beyond the `2026-06-11-colors-audit` (which hardens the kernel and adds tinted-neutrals / lightness-curve / per-palette / on-color axes). Complements that audit; does not duplicate it.

## What the kernel + the existing audit already cover

OKLCH-perceptual default + contrast/material/fixed/tailwind producers, an open registry, WCAG2 **and** APCA contrast, a tinted/pure `on-*` picker, a `verify` reporter with size-class targets and a `nudgeForTarget` suggestion, fully configurable step sets, per-mode generation in the kernel. The 2026-06-11 audit adds tinted neutrals (006), a custom lightness curve (007), per-palette knob overrides (008), and a centralized on-color policy (009), and fixes dark-mode fidelity (005). Treat all of that as covered/planned.

## Shipped in this PR: wide-gamut output (`targetGamut`)

**Decision: shipped.** `createTheme({ … , targetGamut: 'srgb' | 'p3' | 'rec2020' })` (default `srgb`). The colorjs.io seam already supported other gamuts; only `gamutMap`'s call site hardcoded `srgb`. Now `gamutMap(o, gamut)` threads through `ModeCtx.gamut`, set from `opts.targetGamut`.

- **Why:** Radix and Tailwind v4 both ship P3; on a P3 display, sRGB-clamped brand colors are visibly duller than they need to be. Emitting `oklch()` clamped to P3 renders vividly on capable displays and is gamut-mapped down by the browser elsewhere — a single value, progressive enhancement, no `@media` plumbing required in the kernel.
- **Safety:** opt-in. `targetGamut` unset ⟹ `ctx.gamut` undefined ⟹ `gamutMap` defaults to `srgb` ⟹ **byte-identical** default output (proven: kernel snapshots unchanged, `pnpm build:registry` produces zero diff). Foregrounds (`on-*`) stay sRGB-safe.
- **Follow-up (www, not in this PR):** expose a gamut control in `/create`, and decide whether the publisher emits an `@supports (color: color(display-p3 …))` / `@media (color-gamut: p3)` sRGB-fallback block for `targetGamut: 'p3'`. The kernel value alone already degrades gracefully; an explicit fallback is a polish step.

## Roadmap — modern capabilities not yet covered

Each is a **new product axis** (per `CLAUDE.md`, a deliberate decision before implementing). Ranked by end-user impact. Effort is kernel-side unless noted.

### P1 — Alpha / transparency ramps (Radix-style)
The kernel emits solid `oklch()` only. UI that blends into colored, image, or elevated backgrounds — selection, hover-on-card, overlays, borders over photos, glassy menus — needs alpha or it looks wrong on non-default surfaces. Radix ships a matching alpha variant per step (and a *separate* P3 alpha definition, since compositing differs by gamut). The math is inverse alpha-compositing: given `target = a·Cf + (1-a)·Cb`, solve `Cf`, `a` so the composite over the page background equals the solid step. **A whole class of design systems disagree on solid-vs-alpha, so by the north star this is a missing axis.** Effort M; pairs with the shipped `targetGamut` (P3 alpha needs the wide-gamut path). Also unblocks `CLAUDE.md`'s named "translucent menus/popovers" grouped switch, which today has no alpha token to toggle.

### P1 — CVD accessibility tooling (verify-side, pure analysis)
No output change, so lower risk than an axis: add to `verify/` (1) color-vision-deficiency simulation (protanopia/deuteranopia/tritanopia — Machado 2009 matrices, Brettel for tritan; `culori` ships `filterDeficiency*`), and (2) cross-palette distinguishability — pairwise ΔEOK on the normal *and* CVD-simulated colors, flagging semantic colors (primary vs danger vs success) that collapse together. Today `verify` only checks `on-*` against its own step; it never asks whether two semantic colors are tellable apart, especially under CVD. High accessibility value for a builder claiming to recreate any system. Effort M.

### P2 — Harmony + image seeding (www-side, feeds the existing pipeline)
Two onboarding wins that produce a hex seed and flow through the kernel unchanged: (a) **harmony** — derive a coherent secondary/accent/status set from one brand seed via OKLCH hue rotation (Material derives secondary/tertiary/neutral-variant this way), so one pick populates the whole palette set instead of hand-picking six seeds; (b) **image seeding** — drop a logo, quantize to dominant colors (Material `QuantizerCelebi` + `Score`, or node-vibrant), pick a seed. Both are www features, not kernel changes. Effort M each.

### P2 — Contrast-level slider (Material ContrastCurve)
A single user-facing "contrast level" (reduced/standard/medium/high) that re-derives every `on-*` and step at once — what Material's `ContrastCurve` + `contrastLevel` and OS "Increase Contrast" do. dotUI has size-class targets and a per-step contrast producer but no global lift. The grouped, runtime-switchable shape the north star calls for. Effort M.

### P3 — Richer verify pairing graph + dual-gate stance
- **Pairing graph:** let `verify` accept declared `fg-on-surface` pairings across palettes and against elevated/translucent backgrounds (Material declares each token's background), not just `on-*`-vs-own-step. Needed once alpha + elevation tokens exist. Effort M.
- **WCAG3/APCA stance:** as of mid-2026 APCA is not normative in WCAG 3 (no finalized method). Offer a "satisfy both" dual-gate (WCAG 2.2 AA as the legal floor, APCA as the readability target) and tie APCA targets to the use-case levels rather than three baked numbers. Effort S.

### Deferred / lower priority
Elevation/surface-container semantic ladder and translucent-surface tokens (both belong to the www semantic layer, and the latter waits on alpha ramps); paste-an-existing-ramp import UX (the kernel's `fixed` producer already ingests literal ramps — the gap is www step-name flexibility); Leonardo-style multi-key-color interpolation (the demoted `contrast` producer already covers the core idea).

## Note on builder exposure
Most kernel axes — including the ones the audit adds and the `targetGamut` shipped here — are **not surfaced in `/create`** yet (fixed 6-palette set, no steps editor, no dark-mode editing, Material/contrast arrays unexposed, no simple/advanced toggle). That's a separate www pass; see the audit README's "Deferred" section.
