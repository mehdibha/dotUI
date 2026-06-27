# 001 — Chart colors builder axis (`--chart-1..N`)

> Planned at `a4c39a38`. Part of [2026-06-13-charts](README.md). **Phase 0 decisions are signed off (2026-06-13):** derived-from-accent + manual override, default `N = 5`, `N` configurable (clamp 3–8), separate dark set, recipe-home (Option B) preferred. This plan is independent of [002](002-chart-primitives.md)/[003](003-chart-families.md) — it can ship and preview before any chart component exists.

## Goal

A "Chart colors" axis in the `/create` customizer that emits `--chart-1`…`--chart-N` (+ paired `--on-chart-N` foregrounds) as runtime CSS variables, so every chart family colors its series via `var(--chart-N)` and re-themes live as the user edits. Default `N = 5` for shadcn parity.

## What shadcn does (parity target)

shadcn hardcodes 5 variables in the consumer's `globals.css`:

```css
:root { --chart-1: oklch(.646 .222 41.116); --chart-2: ...; ... --chart-5: ...; }
.dark { --chart-1: oklch(.488 .243 264.376); ... }
```

`ChartStyle` then injects per-instance overrides scoped to `[data-chart=<id>]` from each chart's `ChartConfig`. dotUI's job: make those 5 (or `N`) values *derive from the user's theme* instead of being a fixed palette, and emit them through the existing token pipeline.

## Verified codebase facts

- **Semantic vocabulary** is `DEFAULT_SEMANTICS` in `www/src/registry/theme/semantics.ts`; `SemanticToken.category` is only `background | foreground | border` (`theme/types.ts`), and `emit-css.spec.ts` enforces byte-parity with `base/theme.css`. → Putting `--chart-N` in the **semantic** vocabulary drags in the customizer picker filter + the parity spec. **Avoid**: keep chart vars out of `DEFAULT_SEMANTICS`.
- **`DesignSystemProvider`** (`www/src/modules/core/styles.tsx`) already writes every `DesignSystem.tokens` entry inline onto `:root` (Layer 1 of its injected `<style>`), and `THEME_SELECTORS` confirm dark mode is a plain `.dark` class on `<html>` (aligns with shadcn's `.dark [data-chart=…]`).
- **Scoped theming** (`buildScopedThemeCss`) harvests vars via CSSOM; runtime-injected vars are **not** picked up unless explicitly added.
- **OKLCH engine** lives in `packages/colors` (consumed by `www/src/registry/theme/primitives.ts`, `resolveColorConfig`). Dark ramps come from `reverseRamp` — **must not** be reused for categorical hues.
- **`ColorConfig`** + `DEFAULT_COLOR_CONFIG` in `theme/color-config.ts`; absent optional fields encode to `undefined` so untouched presets stay diff-clean.

## Decision: where do `--chart-N` live?

**Resolved:** prefer **Option B (recipe-home)** — the maintainer chose derivation that tracks the accent, which Option B does automatically (Option A would need the UI to recompute on every accent change and wouldn't travel with exported recipes). Option A remains a valid fallback if Option B's plumbing proves too costly mid-implementation; keep both documented.

### Option A — `DesignSystem.tokens` (recommended for v1)

Store `--chart-1..N` as raw entries in `DesignSystem.tokens`. Rides the existing `setToken` + codec path with **zero** codec/kernel/`ColorConfig` change; `DesignSystemProvider` already emits them inline. Derivation-from-accent is a helper at the customizer-UI layer (recompute on accent change). Manual override is trivial.
- Pro: smallest, safest, no `packages/colors` change, no `test` run needed.
- Con: not auto-re-derived on accent change unless the UI recomputes; not part of the shareable color recipe.

### Option B — `ColorConfig.chart` (most on-brand, defer unless wanted now)

Add `ColorConfig.chart?: { count: number; mode: 'derived' | 'manual'; seeds?: string[] }`, kept **absent** from `DEFAULT_COLOR_CONFIG`. Add `deriveChartColors()` next to `resolveColorConfig()` in `primitives.ts` (hue-rotate the accent seed in OKLCH at fixed mid L/C; return `{ light: string[], dark: string[], onLight, onDark }`) and `emitChartVars()` writing `--chart-N`/`--on-chart-N` into `:root`/`.dark`. Wire into `DesignSystemProvider`'s `<style>` (global) + `buildScopedThemeCss` (scoped), and into `publisher/emit-theme.ts` `mergePresetCssFields` so installed projects receive the vars.
- Pro: auto-derives from accent; shareable in the recipe; installed projects get themed charts for free.
- Con: touches `color-config.ts`, `primitives.ts`, `styles.tsx`, `emit-theme.ts` + needs `packages/colors` spec coverage (`pnpm test`).

Recommendation: **B**, per the resolved decision above (auto-derives from accent, travels with the recipe). Fall back to A only if B's plumbing blocks delivery.

## Derivation model (resolved)

- **Hybrid**: `N` categorical colors, **derived by default** from the resolved accent hue (evenly hue-rotated in OKLCH at fixed lightness/chroma), with an optional **manual** override (`N` color pickers). Default `N = 5`; `N` is user-configurable, clamped 3–8 to bound the vocabulary.
- **Dark mode**: emit a *separate* set with the same hues, L/C nudged for contrast on dark surfaces. **Never** `reverseRamp`.
- **Foregrounds**: emit `--on-chart-N` via the engine's `onBlackWhite`/contrast helper for legend/label text legibility in both modes.

## Steps

1. **(Option B only)** Add `ColorConfig.chart?` to `theme/color-config.ts`; keep it out of `DEFAULT_COLOR_CONFIG`. Add `deriveChartColors()` + `emitChartVars()` to `primitives.ts`. Add `emit-css`/`primitives` spec coverage in `packages/colors`.
2. Wire emission:
   - Option A: add a `setChartColors` helper in `www/src/modules/create/preset/use-design-system.ts` that writes `--chart-N`/`--on-chart-N` into `DesignSystem.tokens` (reuse `setToken`). No provider change needed (Layer 1 already emits tokens).
   - Option B: include chart vars in `DesignSystemProvider`'s injected `<style>` **and** `buildScopedThemeCss` in `modules/core/styles.tsx`, guarded by the same global-vs-scoped divergence check; emit resolved `--chart-N` in `publisher/emit-theme.ts` `mergePresetCssFields` (mirror the `rampsToVars` block).
3. **Customizer UI** — add a menu entry to the `menu` array in `www/src/modules/create/customizer-panel.tsx`: `{ id: 'charts', title: 'Chart colors', preview: <ChartColorsSummary/>, config: <ChartColorsConfig/> }`. Author `www/src/modules/create/chart-colors-config.tsx` (template: the existing `colors-config.tsx`): count stepper, derived/manual toggle, `N` `ColorPicker`s, live swatches.
4. **Preview block** — author `www/src/modules/create/preview/group-examples/charts.tsx` colored by `var(--chart-N)`. To decouple this plan from [002](002-chart-primitives.md)/[003](003-chart-families.md), ship a lightweight hand-built SVG (or pure-div bars) preview **first**, then swap it for a real Recharts preview once the families land (full builder integration was approved in Phase 0.3, so recharts+d3 in the customizer iframe is accepted).
5. Regenerate + commit per [005](005-build-publish-and-verification.md) (a new `group-examples` file regenerates `GroupExamplesIndex`).

## Done criteria

- Editing the accent (Option B) or the chart-colors picker (Option A) re-themes the SVG preview block live, in both light and dark.
- `--chart-1..N` and `--on-chart-N` present on `:root` and `.dark` at runtime; dark hues match light hues (not reversed); label text legible in both modes.
- (Option B) `pnpm test` green incl. new `packages/colors` coverage; (either) `pnpm check` + `pnpm typecheck` green.
- An installed/exported project receives the vars (Option B via `emit-theme.ts`; Option A: document that exported charts inherit whatever `--chart-N` the recipe ships, or thread tokens through the publisher).

## STOP conditions

- If you find emitting `--chart-N` requires touching `DEFAULT_SEMANTICS`/`base/theme.css`/`SemanticCategory`, **stop and report** — that's a larger plumbing change than this plan scopes (keep chart vars out of the semantic vocabulary).
- If Option B's engine/publisher plumbing balloons beyond this plan's surface, **stop and reassess** falling back to Option A (tokens-home) rather than expanding scope silently.
