# dotUI Color System — Redesign Plan

> Status: **proposed / accepted-in-principle**. Product owner has locked the four
> headline decisions (§1). Synthesized from four research passes: subsystem audit,
> modern color-system research, a 12-system coverage stress-test, and a
> palette-algorithm head-to-head. Supersedes the hardcoded color portion of the
> current system. Promote to `docs/adr/0001-color-system.md` if/when desired.

## 0. Goal

dotUI is a design-system **builder**. In `/create` a user configures a color system
and installs it via the shadcn CLI (so everything must bake down to plain CSS vars
that work **without** the dotUI React provider). The color system is the most
important feature, and the bar is **maximum flexibility**: users choose the
_strategy_ (hand-authored values like shadcn **or** generated palettes + semantic
tokens like pro design systems), the _generation algorithm_, _contextual surfaces_,
and the _semantic token mapping_.

A full rewrite is approved. The `@dotui/colors` package (a clean, tested engine that
today emits **primitive ramps only** via `material`-HCT and a Leonardo `contrast`
port) is the foundation.

## 1. Locked decisions (product owner)

| #   | Decision              | Choice                                                                                                                                                          |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Default algorithm** | **OKLCH contrast-targeted solver** (apcach-style L-bisection); WCAG 2 default, APCA opt-in.                                                                     |
| D2  | **Scale shape**       | **Fully configurable** step count + naming in v1 (no hardcoded `50-950`).                                                                                       |
| D3  | **Palettes**          | `neutral` is the **required backbone**; `primary` + `success/danger/warning/info` ship as removable defaults; **arbitrary custom-named palettes** can be added. |
| D4  | **Default theme**     | **Generative** (OKLCH) from day one — no hand-authored fallback; accept small hex shifts vs today.                                                              |

## 2. Architecture in one idea

> **Fixed-vs-generative is a Tier-1 _production strategy_, not a different token model.**
> `@dotui/colors` emits one shape for every algorithm, so everything above the
> primitive ramps is blind to how a ramp was produced. Components always read
> `var(--color-primary)` — only its resolved value differs.

Three tiers, **one resolver**:

```
TIER 1  ramps     --neutral-{steps}, --primary-{steps}, --on-primary-{steps}
                  produced by @dotui/colors (contrast-target | oklch-curve | material | radix | fixed)
                  emitted to :root / .dark / [data-mode=x]; the ONLY tier that changes per mode/strategy
                      │ var()
TIER 2  semantic  --color-bg, --color-primary, --color-fg-on-accent, --color-border-focus
                  SemanticTarget map (replaces static theme.css); MODE-AGNOSTIC
                      │ var()
TIER 3  surface   --color-card / .surface{} + per-component params
                  contextual surfaces via color-mix / relative-color (plain CSS, no provider)
```

- **`packages/colors`** stays the pure Tier-1 generator (producers + `on-*` + the scale type). No `www` knowledge.
- **`www/src`** gets `resolveColorConfig(config) → { tier1, tier2 }` — the orchestration that turns a `ColorConfig` into CSS, **shared by the runtime provider, the preview iframe, and the publisher** so all three emit identical output. This "one resolver" invariant is load-bearing: any divergence makes the shipped CSS not match the preview.

## 3. The generation engine (`@dotui/colors` refactor)

### 3.1 Why contrast-target as the default

The repo's existing `contrast` (Leonardo) engine is the **right paradigm, wrong implementation**. A ramp defined as a list of `name → target-contrast` pairs satisfies all of D1–D4 by construction:

- **D2 configurable shape** — arbitrary N + arbitrary names are just the length/keys of the target list (`50-950`, Radix `1-12`, Carbon `10`, Material `13` — same code path; `generate.ts` already accepts `ratios: number[] | Record<string,number>`).
- **`on-*` foregrounds** — the same solve with flipped polarity. No separate autocontrast pass. (The engine ships zero foreground generation today — this closes a real gap.)
- **D4 generative + oklch output** — emits `oklch()` literals natively.
- **D3 neutral backbone** — same solver with a near-zero chroma envelope.

Verification corrected the motive: the existing engine is **not** slow (~5–7ms warm / ~44ms cold for 6 palettes ×2 modes — lazy, cached binary search). The reasons to refactor are **output format** (sRGB-hex → `oklch()`/P3), **`on-*` generation**, **configurable-N**, and **less code**.

### 3.2 The solver (replaces the 3000-swatch path)

For each palette: parse seed → OKLCH, keep H, choose a chroma policy `C(step)`. For each step with target contrast `T` against the mode background: **binary-search L in [0,1] (~10–14 iters, monotone)** for the `oklch(L, C(step), H)` whose `contrast(candidate, bg) == T`, gamut-mapping each probe. Deterministic (seed + level-list → identical ramp); memoize per preset for `/r/init`.

- **Hot-path lib:** `culori` (already in lockfile via `tailwindcss-autocontrast`; ESM, tree-shakeable, OKLCH+P3 native, used by Tailwind v4 + Radix). Keep `colorjs.io` only for APCA `.contrast(c,"APCA")` / any CAM16 helpers not migrated.
- **Contrast fn is pluggable:** WCAG 2 = existing `luminance()` ratio (default); APCA = `colorjs.io .contrast(c,"APCA")` (opt-in). Never market APCA as a standard (unratified, ~2029-2030).
- **Gamut:** `toGamut('oklch','rgb')` **CSS Color 4 method, NOT bare `clampChroma`** (verification: `clampChroma` collapses saturated yellows — P3 yellow C123→25 vs css-method →103). Cap C with a maxChroma search and taper toward both ends so tints/shades aren't muddy and darks don't clip.
- **on-\*:** same solver, flipped polarity, target Lc≥60 APCA / ≥4.5:1 WCAG 2; prefer near-neutral tints of the palette hue. (Optionally emit CSS `contrast-color()` at consume time for runtime self-correction — Baseline Apr 2026 — but keep literal `on-*` since `contrast-color()` only returns black/white.)

### 3.3 Pluggable producer registry

Generalize `theme.ts`'s 2-branch `if/else` into a registry keyed by `AlgorithmId`. Adding an algorithm = registering one entry; nothing downstream branches.

```ts
// packages/colors/src/producer.ts
export interface ModeCtx {
	name: string;
	isDark: boolean;
	steps: readonly string[];
	bg: string;
}
export interface PaletteOutput {
	scale: Record<string, string>;
	on: Record<string, string>;
} // oklch() strings
export interface ColorProducer<Opts> {
	id: AlgorithmId; // "contrast" | "oklch" | "material" | "radix" | "fixed"
	schema: z.ZodType<Opts>; // restores the per-algorithm .refine() the unified path drops
	produce(opts: Opts, ctx: ModeCtx): PaletteOutput;
}
```

**Menu to ship:**

| Algorithm                                                                           | Role        | Notes                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **contrast-target** (OKLCH L-bisect, WCAG2/APCA)                                    | **default** | accessibility + arbitrary-N + `on-*` by construction; oklch+P3                                                                                    |
| **oklch-curve** (parametric L + chroma envelope, Tailwind v4 / Evil Martians style) | offer       | "pretty ramp"; same pipeline in fixed-L-curve mode; `on-*` via per-step pass                                                                      |
| **material** (HCT, `@material/material-color-utilities`)                            | offer       | already wired, zero new deps; Material-You parity; generalize hardcoded 11-tone arrays to N; sRGB-only                                            |
| **radix** (`generateRadixColors`)                                                   | offer       | best Radix-Themes drop-in (role-semantic 12 steps, oklch+P3); ship **only** as a fixed 12-step preset (hardwired roles conflict with arbitrary-N) |
| **fixed**                                                                           | always      | identity generator: returns the literal scale, computes `on-*` against it                                                                         |

**Skip:** Leonardo's 3000-swatch impl (keep the idea), `apcach` as a dependency (reimplement the ~40-line method over culori — `apca-w3` license is a risk for a commercial publisher), `chroma.js` bezier, Ant Design HSV. Borrow ideas only: Accessible-Palette's cross-palette consistency; Huetone's live contrast-readout UX for the editor.

### 3.4 The configurable-N refactor (the glue, not the algorithm)

The algorithm already supports arbitrary-N; the glue doesn't. Required edits:

1. `shared/types.ts` — `ColorScale` from fixed `{ "50": ... }` keys → `Record<string,string>`.
2. `shared/constants.ts` — `SCALE_STEPS` from a const 11-tuple → a **default** any N can override; single source of truth (delete the duplicate in `contrast/types.ts`).
3. `contrast/schema.ts` — `ratiosSchema = z.array().length(11)` → `z.array(z.number()).min(2)`, and accept `Record<string,number>` for named steps.
4. `contrast/theme.ts` `mapToColorScale` — stop truncating to `SCALE_STEPS`; emit one entry per ratio/name.
5. `material/schema.ts` `tonesSchema.length(11)` → arbitrary; `material/index.ts` maps over provided steps.
6. Add a **"level template"** helper: given N, produce a sensible default contrast curve (interpolate a base WCAG ratio array to N points) so the generative default works without the user authoring ratios.

## 4. Data model — `ColorConfig` in the preset

Add one typed, validated field to `DesignSystem` (`preset/types.ts`). Do **not** reuse the untyped `tokens` bag for color.

```ts
export type AlgorithmId = "contrast" | "oklch" | "material" | "radix" | "fixed";

export type PaletteConfig =
	| {
			strategy: "generative";
			algorithm: Exclude<AlgorithmId, "fixed">;
			seed: string;
			// algorithm-specific (validated by the producer schema):
			ratios?: number[] | Record<string, number>; // contrast: per-step target (also encodes naming/N)
			formula?: "wcag2" | "apca"; // contrast: default wcag2
			lCurve?: number[];
			chromaEnvelope?: number[];
			hueShift?: number; // oklch-curve
			variant?: MaterialVariant;
			tones?: number[]; // material
			stepOverrides?: Record<string, string>; // HYBRID: pin individual steps on a generated ramp
	  }
	| { strategy: "fixed"; scale: Record<string, string> }; // identity generator

export type ModeConfig = {
	isDark: boolean;
	appearance?: "light" | "dark"; // which prefers-color-scheme this answers to
	palettes?: Record<
		string,
		{
			seed?: string;
			ratios?: number[] | Record<string, number>;
			tones?: number[];
			lightness?: number;
			scale?: Record<string, string>;
		}
	>;
};

export type SemanticTarget =
	| { ref: string } // "neutral.950" -> var(--neutral-950)
	| { onOf: string } // "accent.500"  -> var(--on-accent-500)
	| { value: string } // literal; skips Tier 1
	| { mix: { space: "oklab" | "oklch" | "srgb"; stops: [SemanticTarget, number, SemanticTarget] } };

export type ContextualSurfaceConfig = {
	mode: "fixed" | "alpha" | "relative";
	step?: number; // relative-mode L step
	tint?: Record<string, { color: string; alpha: string }>; // alpha-mode, per mode
	surfaces?: Record<
		"card" | "popover" | "sidebar" | "tooltip",
		{ base: SemanticTarget; elevation?: number; overrides?: Record<string, SemanticTarget> }
	>;
};

export type ColorConfig = {
	steps: string[]; // D2: the scale shape (names define N + naming)
	palettes: Record<string, PaletteConfig>; // D3: neutral required; others removable; custom allowed
	modes: Record<string, ModeConfig>; // "light","dark", + arbitrary
	activeMode?: string;
	semantics?: Record<string, SemanticTarget>; // OVERRIDES ONLY; defaults in code
	surfaces?: ContextualSurfaceConfig; // omitted => fixed surfaces
};

export type DesignSystem = {
	componentParams: Record<string, Record<string, string>>;
	tokens: Record<string, string>;
	density: Density;
	color?: ColorConfig; // NEW; undefined => DEFAULT_COLOR_CONFIG
};
```

**Codec:** author the _recipe_ (seeds + algorithm + sparse overrides), never the expanded ramps — the URL stays tiny because generation is deterministic. Add codec key `c` with diff/merge vs `DEFAULT_COLOR_CONFIG`; only diffs serialize. Round-trip tests must include the bulky `strategy:"fixed"` full-ramp case, and the all-defaults case must still encode to `undefined` (no `?preset=`). DTCG is an **export/interop target only**, never the source format.

## 5. Semantic layer, surfaces, runtime, publisher

- **Semantic (Tier 2):** `DEFAULT_SEMANTICS` (code) mirrors `theme.css` exactly and **becomes the single source** — generate `theme.css` + `tokens.ts` from it (kills the current `theme.css`↔`tokens.ts` drift, a prerequisite cleanup). `resolveColorConfig` merges defaults with `config.semantics` and emits each as one `@theme inline` declaration. Components never branch.
- **`on-*` dual path:** live preview uses in-engine APCA `on-*` (no CSS re-parse); shipped CLI CSS keeps `@plugin tailwindcss-autocontrast` so the consumer's build derives `on-*` and the payload stays tiny. (Document the small APCA-vs-WCAG2 divergence on borderline picks; revisit pre-resolving when arbitrary modes ship.)
- **Contextual surfaces** (D-default `fixed`):
  - `alpha` (recommended contextual default): `.surface { background: color-mix(in oklab, var(--surface-tint) var(--surface-alpha), transparent) }` — auto-relative to whatever is behind it, zero parent knowledge.
  - `relative` (opt-in, `@supports`-gated): `oklch(from var(--surface-parent) calc(l + var(--surface-dir)*.03) c h)`.
  - All plain CSS → round-trips through the shadcn `css`/`cssVars` fields with no provider. Pin foreground to `--color-fg` (bounded stepping); add `--color-ring-offset` (focus ring wrongly hardcodes `--color-bg` on elevated surfaces) and define the orphan `--color-shine`.
- **Runtime:** `resolveColorConfig` runs in the parent on each edit; the provider injects **one `<style>` with all mode blocks at once** (`:root` / `.dark` / `[data-mode=x]`) so mode switching is a pure attribute flip — no flash. SSR inlines the multi-mode `<style>` in the document head; the existing `starter-themes` pre-hydration IIFE flips the attribute before paint. Keep `.dark` as the canonical dark selector; extra modes → `[data-mode]`.
- **Publisher:** thread `ColorConfig` through `PublishPreset` + `emit-theme.ts`; split `renderBaseRegistryCss` so the **palette** moves out of static `colors.css` and becomes a generation target (else static ramps shadow generated ones); resolve + emit Tier-1/Tier-2 per mode; lazy-import the engine in the route; rely on existing `s-maxage=3600 + SWR`; prerender the default preset.

## 6. Customizer UX (`colors-config.tsx`)

Rewire the dead mock to `useDesignSystem` setters. **Simple (default):** one algorithm Select (contrast-target default / oklch-curve / material / radix / fixed) + a brand-color picker (primary seed) + optional neutral + on/off toggles for status colors + a live swatch strip showing the ramp + `on-*` per step. **Advanced (disclosed):** per-palette strategy switch (generative ↔ fixed paste-your-ramp ↔ hybrid pin-steps), algorithm knobs, scale-shape editor (step count + naming), semantic remap, surfaces panel, modes panel (add high-contrast / colorblind). Everything diffs to nothing so the URL stays tiny.

## 7. Coverage reconciliation (12-system stress-test)

Four **structural musts** to honestly claim "supports all modern solutions" (more _algorithms_ don't help):

| Must                                                          | Status                                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `strategy=fixed` passthrough                                  | ✅ identity producer                                                                         |
| Editable semantic role-set                                    | ✅ `SemanticTarget` map replaces static `theme.css`                                          |
| Configurable scale shape (Radix 12 / Carbon 10 / Material 13) | ✅ D2 — `steps[]` + contrast-target list                                                     |
| Contextual surfaces                                           | ✅ `fixed`/`alpha`/`relative`                                                                |
| **Alpha scales** (Radix A1–A12, ADS, Apple)                   | ⏳ **roadmap (Phase 4)** — per-step alpha companion + overlay/scrim tokens; types leave room |

Worth-it "shoulds" (Phase 3+): colorblind hue-remap modes (Primer), a dark-derivation strategy hook (antd mix-onto-bg / Primer inverted / Spectrum bg-lightness-only), import paths (paste hex / Tailwind config / CSS vars / Radix-Material presets), build-time `on-*` freeze for arbitrary modes. Skip for v1: Apple Materials/Vibrancy (emit a parametric recipe, never a resolved value), Chakra DOM-depth swap.

## 8. Phased plan

- **Phase 0 — engine (packages/colors only; invisible, zero www risk).** Producer registry; the OKLCH contrast-target solver (culori, L-bisection, `toGamut` CSS-method, `oklch()` output); `fixed` producer; in-engine `on-*`; configurable-N glue (single-source `SCALE_STEPS`, `Record`-keyed scale, drop `.length(11)`, level-template helper); wrap `material`/`contrast` as producers; wire dead material `variant`/`contrast`; delete duplicate `createContrastTheme` + `searchColors`. Snapshot-guard existing output; assert `on-*` clears an APCA/WCAG floor; no `hsl()` in output. **This is the first PR.**
- **Phase 1 — `ColorConfig` + resolver + live preview.** Add the model + codec key `c`; `DEFAULT_SEMANTICS` (reconcile `theme.css`↔`tokens.ts` first) generating `theme.css`/`tokens.ts`; `resolveColorConfig`; single injected multi-mode `<style>`; rewire simple-path customizer + swatch strip; `activeMode` + wire the inert MoonIcon + forward mode to iframe.
- **Phase 2 — publisher parity.** Thread `ColorConfig`; split `renderBaseRegistryCss`; emit Tier-1/Tier-2; lazy-import; prerender default. `shadcn add ?preset=` reproduces the live preview.
- **Phase 3 — advanced UX.** Per-palette fixed/hybrid, scale-shape editor, semantic remap, modes panel + arbitrary `[data-mode]`, colorblind/dark-derivation, import paths. Re-route component→primitive leaks (`button` `--color-disabled`, `tag-group bg-(--neutral-300)`, `calendar --accent-500`) onto semantic tokens.
- **Phase 4 — contextual surfaces + alpha scales + interop.** `.surface` CSS; `--color-ring-offset`; `--color-shine`; alpha scales + overlay/scrim; DTCG import/export; optional P3 output toggle.

## 9. Risks

- "One resolver" invariant — `resolveColorConfig` must produce identical output in provider, iframe, and publisher (single shared module, no env branching).
- `DEFAULT_SEMANTICS` must reproduce `theme.css` exactly; existing `theme.css`↔`tokens.ts` drift (~20 tokens, fg-\* 700-vs-800, muted 50-vs-100) means there is no single trustworthy current source — reconciling it is a prerequisite.
- Codec diff/merge bug silently bloats URLs or drops overrides — round-trip tests required.
- APCA(preview) vs WCAG2(plugin) divergence on borderline `on-*`; validate emitted values.
- Contextual surfaces have no precomputed `on-*` companion — bounded stepping is a doc/UX constraint, not type-enforced in v1.
- Browser floor: `oklch()` + `color-mix()` + relative-color gate to Safari 16.4+/recent Chrome/Firefox (same as Tailwind v4 — no new cost, but `relative` mode needs `@supports` fallback).
- Keep the engine **lazy-imported** in `/r/init` (no static import) to protect cold-start.
