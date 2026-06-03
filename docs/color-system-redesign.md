# dotUI Color System — Redesign Plan (v2)

> Status: **accepted-in-principle**, consolidated from the full research thread:
> subsystem audit, modern color-system research, a 12-system coverage stress-test,
> a palette-algorithm head-to-head, component-token-tier research, an external-review
> triage, and a concrete palette-recipe extraction. **Headline change vs v1:** the
> default generator flipped from _contrast-target_ to _OKLCH-perceptual_ (§4). See the
> decision log (§12) for what we considered and rejected. Promote to
> `docs/adr/0001-color-system.md` if/when desired.

## 0. Goal

dotUI is a design-system **builder**. In `/create` a user configures a color system and
installs it via the shadcn CLI — so **everything must bake to plain CSS vars that work
without the dotUI React provider**. The color system is the most important feature; the
bar is **maximum flexibility**: the user chooses the _shape_ (hardcoded-semantic like
shadcn **or** palettes → semantic tokens like pro systems), the _generation algorithm_,
_contextual surfaces_, and the _semantic mapping_ — with great defaults so "choose
everything" never overwhelms.

The `@dotui/colors` package (clean, tested; today emits primitive ramps via `material`-HCT
and a Leonardo `contrast` port) is the foundation.

## 1. Locked decisions

| #   | Decision              | Choice                                                                                                                                                                                            |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Default algorithm** | **OKLCH-perceptual** ramp — generated **perceptually + background-independently** (fixed hue, perceptual L ladder, tapered chroma, gamut-mapped). Contrast-target is **demoted to an opt-in option**. _(Reversed from v1; see §4.1, §12.)_ |
| D2  | **Scale shape**       | **Fully configurable** step count + naming (no hardcoded `50-950`); 11/`50-950` is the default.                                                                                                   |
| D3  | **Palettes**          | `neutral` is the **required backbone**; `primary` + `success/danger/warning/info` are removable defaults; **arbitrary custom-named palettes** allowed.                                            |
| D4  | **Default theme**     | **Generative** from day one (no hand-authored fallback).                                                                                                                                          |
| D5  | **Color-system shapes** | Two headline shapes — **(A) flat hardcoded-semantic** (shadcn-style, no palettes, per-mode literals) and **(B) palettes → semantic**. **No component-token tier** (§3, §12).                    |
| D6  | **Accessibility model** | **Generate → pick foreground → _verify_**. Contrast is a **post-generation test on semantic pairings** (with nudge/warn), never a per-step generation target. WCAG 2 default; APCA opt-in.       |

## 2. Architecture in one idea

> **The shape of the token system is a property of the config, not a different code path.**
> Components always read `var(--color-primary)`; only its resolved value differs across
> flat / palette / hybrid shapes. The palette engine is an _optional sub-step_ the
> resolver calls only when palettes exist.

Tiers (with **one resolver** producing identical output for the runtime provider, the
preview iframe, and the publisher):

```
TIER 1  primitive ramps   --neutral-{steps}, --primary-{steps}, --on-primary-{steps}
        (OPTIONAL — absent in the flat shape) produced by @dotui/colors
            │ var()
TIER 2  semantic tokens   --color-bg, --color-primary, --color-fg-on-accent, --color-border-focus
        SemanticTarget map (replaces static theme.css); per-mode-able
            │ var()
TIER 3  surfaces          --color-card / .surface{}  (curated surface vars + opt-in contextual modes)
```

**Layering / where logic lives (§5):**

- **`@dotui/colors` = a pure color _kernel_.** Primitives + ops (`gamutMap`, `onColor`,
  `mix`, parse/format). It must **not** know the semantic-token vocabulary or CSS.
- **`@dotui/theme` (new pure package, or `www/src/registry/theme/` to start) = the semantic
  layer.** Owns the vocabulary, `DEFAULT_SEMANTICS`, `resolveColorConfig`, `emitCss`, and
  surfaces. It is the **top orchestrator**; the kernel is a sub-step it calls only when
  palettes exist (so the flat shape skips the kernel entirely).

## 3. Color-system shapes (D5) — and why no component tier

- **Shape A — flat hardcoded-semantic** (shadcn): no palettes; every semantic token is a
  per-mode literal the user authors. `resolveColorConfig` skips the kernel.
- **Shape B — palettes → semantic**: palettes generate ramps; semantic tokens are mostly
  `{ref}` into ramp steps, so re-pointing one palette re-themes everything.
- **Shape C — hybrid**: palettes + a few literal/`mix` overrides. Same model.

**No component-token tier.** Researched (Material/Spectrum/Salesforce keep it only because
of multi-platform delivery; SLDS 2, Chakra v3, Park UI, Atlassian all _trimmed_ it; Spectrum's
210k-token JSON is the cautionary tale). For a single-framework / single-brand / CSS-export
builder it would be ~90% pointless 1:1 aliases + payload/maintenance tax. Instead: keep the
**curated component-surface vars that already exist** (`--color-card/popover/tooltip/sidebar/
border-sidebar/fg-on-tooltip`) as part of the semantic vocabulary, plus the existing **scalar
`color` param + `createStyles` `vars` rebind** as the per-component escape hatch (e.g. tooltip
`translucid`). Framed as "semantic-first with surgical overrides," not "3-tier."

## 4. The generation engine (`@dotui/colors`)

### 4.1 The three-layer split (D6) — generate ⟶ pick ⟶ verify

The 2024–2026 consensus (Tailwind v4, Radix, Material HCT, Mantine, Evil Martians/Okhsl,
shadcn/tweakcn): **none generate ramp steps to a background contrast ratio.** They all:

1. **Generate** the ramp **perceptually + background-independently** (fixed hue, perceptual
   L ladder, tapered chroma, gamut-map).
2. **Pick** each foreground with a **simple contrast function** (better-contrasting
   black/white-or-neutral-extreme, tinted optional).
3. **Verify** accessibility with a **post-generation contrast test** on the _semantic
   pairings_ — nudge or warn, surface a readout.

Background-independence applies to ramp **generation**; contrast-awareness applies to the
**verify** and **foreground** layers. That line is what makes the design coherent.

### 4.2 Default recipe — "OKLCH Perceptual" (the reserved `oklch` producer)

Pure, deterministic, background-independent, emits `oklch()`. Reuses everything in
`shared/color.ts`.

- **Space:** OKLCH end-to-end; gamut via existing `gamutMap` (CSS Color 4 chroma-reduce+clip).
  The gamut clamp **is** the cusp-awareness (no explicit cusp math).
- **Lightness:** a **fixed perceptual L array**, background-independent (Evil Martians anchors,
  fractions 0..1): `50:0.9778, 100:0.9356, 200:0.8811, 300:0.8267, 400:0.7422, 500:0.6478,
  600:0.5733, 700:0.4689, 800:0.3944, 900:0.3200, 950:0.2378`. Resample for arbitrary-N
  (`solver.ts` `resample`). **Mode-agnostic** (see §4.7 dark-mode sub-decision).
- **Chroma:** `seedChroma × chromaMult × envelope(i)`, then gamut-clamp. **Envelope = the
  existing `solver.ts` formula** `0.45 + 0.55·sin(π·i/(N-1))` (mid-peak taper). Add a Material-
  style **min-chroma floor** so muted seeds still yield a usable accent. Neutral palette floors
  C ≤ ~0.012 (existing `neutral` flag). Two sub-modes: `consistent` (default, envelope-capped)
  and `max` (request high C, let gamut clip per step — vivid, uneven).
- **Hue:** **constant by default** (OKLCH hue is perceptually stable; Radix deliberately skips
  torsion). Opt-in **hue-torsion** knob (default 0): warm hues drift toward orange, cool toward
  violet at the dark end (compressed Bezold–Brücke, sign-by-sector) — used by the Tailwind-style
  preset.

### 4.3 Foreground (`on-*`) function — keep `shared/on-color.ts`

Already correct (validated against Radix `accentContrast`, Material `foregroundTone`, Mantine
`autoContrast`): for each step, score four candidates and pick the readable one — hue-tinted
near-white, hue-tinted near-black, then pure white / pure black fallback in the contrast valley.
**Refinements:** add Material's "prefer the light pole below mid-L (~0.62)" tie-break, and snap
straight to a pure pole when a step lands in the valley (`L≈0.50–0.62`) and neither tinted pole
clears the floor. Floors: WCAG 2 ≥ 4.5 / APCA Lc ≥ 60. Tinted is the default-on aesthetic; expose
"pure black/white only" + "luminance threshold" as options. Emitted per step via `computeOnColors`.

### 4.4 Verification layer (net-new: `packages/colors/src/verify/`)

Runs **after** generation, per mode, on **semantic pairings only** (never raw scale indices):
`fg↔bg`, each `*-foreground↔its solid`, text-step↔surface, `border/ring↔surface` (UI 3:1),
muted↔muted-surface.

- **Size-aware thresholds:** WCAG 2 — body 4.5, large/bold + non-text UI 3.0. APCA — body Lc 60,
  large 45, non-text 30. Each pairing tagged with its size class (Material's ContrastCurve insight).
- **Cheap pre-check:** ΔL shortcut (`|ΔL*|≈0.40 ⇒ ≥3:1`, `0.50 ⇒ ≥4.5:1`) to skip obviously-fine
  pairs; confirm borderline with the real ratio.
- **Policy:** `on-*` pairings should never fail (the picker guarantees a passing pole). For a
  failing surface/text pair, **nudge the offending text step's lightness** by the minimum ΔL that
  clears the floor (+ small gamut safety margin), re-gamut-map, re-test; **cap** the nudge and
  **warn** if it can't pass without distorting the ramp. Border/ring failures = **warn-only** by
  default. Never mutate the ramp silently.
- **UI surface:** per-pairing fail/AA/AAA (red/yellow/green) + numeric ratio + list of auto-nudged
  pairs (before→after). Reuses `wcag2()`/`apca()` from `shared/color.ts`.

### 4.5 Seed anchoring (ship both)

- **Default:** seed sets **hue + chroma only**; its L is **discarded** (array-driven) → clean,
  even ramps regardless of brand-color lightness. The seed is **not** preserved exactly.
- **Opt-in "Preserve seed at step N"** (default N=500): pin the exact seed at a step and interpolate
  around it (tints.dev: interpolate Lmax→seedL→Lmin), or **snap to the nearest step by lightness**
  (Mantine/Radix) and overwrite it. First-class toggle — brand owners frequently demand their exact
  hex appear somewhere.

### 4.6 Pluggable producer registry + the algorithm options menu

`theme.ts`'s dispatch is a registry keyed by `AlgorithmId` (one `registerProducer` call to add one).

```ts
// packages/colors/src/producer.ts
export interface ModeCtx { name: string; isDark: boolean; steps: readonly string[]; background: string }
export interface PaletteOutput { scale: Record<string, string>; on: Record<string, string> } // oklch() strings
export interface ColorProducer<Opts> { id: AlgorithmId; schema: z.ZodType<Opts>; produce(opts: Opts, ctx: ModeCtx): PaletteOutput }
```

| Priority | Algorithm                                 | Notes                                                                                                                  |
| -------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **must** | **OKLCH Perceptual** (`oklch`) — DEFAULT  | §4.2. Fixed hue + EM L-array + tapered chroma + gamut-map. The reserved slot; implement it.                            |
| **must** | **Contrast-locked** (`contrast`)          | The **existing** L-bisection solver, **demoted** from default. For teams who must lock per-step contrast vs a bg.      |
| should   | **Material / HCT** (`material`)           | Existing producer; canonical Material look; structural tone-delta guarantee.                                          |
| should   | **Tailwind-style**                        | `oklch` preset with hue-torsion ON + eased L anchors — the recognizable Tailwind aesthetic.                           |
| nice     | **Radix-matched**                         | Vendor the ~30 Radix reference scales (oklch+P3) as a lookup; match seed via ΔEOK; transpose L/C. 12 fixed roles.     |
| nice     | **Mantine 10-shade** · **tints.dev** · **chroma.js multi-hue** | Migration / brand-fidelity / editorial multi-hue scales.                                          |

**Skip:** Leonardo's 3000-swatch impl (idea kept as the contrast option); `apcach` as a dependency
(`apca-w3` license risk — use colorjs.io's APCA, MIT); Ant Design HSV. The contrast solver +
`wcag2()`/`apca()` are reused by the **verify** layer.

### 4.7 Configurable-N, gamut, libraries, dark mode

- **Configurable-N:** done in Phase 0 — `ColorScale` is `Record<string,string>`; `SCALE_STEPS` is a
  single-source default; schemas relaxed `.length(11)→.min(2)`; the orchestrator derives step count
  from the ratios/steps length.
- **Library:** built on **`colorjs.io`** (already a typed dep; native `oklch()`,
  `toGamut({method:"css"})`, WCAG2 + APCA). **`culori`** ships no types and is **not** a direct dep —
  its hot-path migration is **deferred** to when the engine runs live (Phase 1+), isolated behind
  `shared/color.ts`.
- **Gamut:** `toGamut({space:"srgb", method:"css"})` (CSS Color 4), **not** `clampChroma`
  (collapses saturated yellows). Evaluate **Okhsl** / cusp-aware projection as a refinement for
  vivid ends (polish; isolated in the kernel).
- **Dark-mode sub-decision (open):** with a background-independent ramp, either **(a)** one
  mode-agnostic ramp + the semantic layer flips which steps it references per mode (simplest, v1),
  or **(b)** a separately-tuned dark ramp (Radix/Material — dark UIs aren't just inverted). **Ship
  (a) for v1**, offer (b) as an enhancement.

## 5. The semantic layer (`@dotui/theme`)

- **Vocabulary + `DEFAULT_SEMANTICS`** (code) mirror `theme.css` and become the **single source** —
  generate `theme.css` + `tokens.ts` from it (kills today's `theme.css`↔`tokens.ts` drift, a
  prerequisite). Includes the curated component-surface vars (§3).
- **`SemanticTarget`** = `{ref}` (ramp step → `var(--palette-step)`) | `{value}` (literal) | `{onOf}`
  (paired `on-*`) | `{mix}` (`color-mix`). **Must be per-mode-able** (`SemanticTarget |
  Record<modeName, SemanticTarget>`) — the flat shape needs per-token-per-mode literals (Primer/
  Atlassian model).
- **`resolveColorConfig(config)` = the one resolver** (provider + iframe + publisher). Generates
  primitives via the kernel _iff_ palettes exist; resolves each semantic token; assembles per-mode CSS.
- **`emitCss`** produces `:root` / `.dark` / `[data-mode=x]` for primitives + literals, and one
  `@theme inline` for the semantic→primitive references (Tailwind v4 auto-layers these; keep base
  _rules_ in `@layer base` — no extra `@layer` wrapper needed, see §9).
- **Surfaces (opt-in technique menu, default `fixed`):** `fixed` (today's `card=neutral-100`) ·
  `elevation` (discrete surface scale off neutral, inverting in dark — Material/Spectrum; the
  recommended contextual default over alpha) · `alpha` (`color-mix` tint — for unknown/colored bg) ·
  `relative` (`oklch(from …)`, `@supports`-gated). All plain CSS, no provider. Add `--color-ring-offset`
  (focus ring wrongly hardcodes `--color-bg`) and define the orphan `--color-shine`.
- **Runtime:** inject **one `<style>` with all mode blocks** so mode switching is a pure attribute
  flip (no flash); SSR inlines it in the head; the `starter-themes` pre-hydration IIFE flips the
  attribute before paint. Keep `.dark` canonical; extra modes → `[data-mode]`.
- **Publisher:** thread `ColorConfig` through `PublishPreset` + `emit-theme.ts`; move the palette out
  of static `colors.css` into a generation target; emit Tier-1/Tier-2 per mode; lazy-import the engine
  in `/r/init`; rely on `s-maxage` + prerender the default. **Phase-2 watch:** `vars` overrides are
  currently dropped at publish (`types.ts:37`) — must ship for components whose default look depends on
  a `vars` rebind (e.g. tooltip `translucid`).

## 6. Data model — `ColorConfig` in the preset

One typed field on `DesignSystem` (not the untyped `tokens` bag).

```ts
export type AlgorithmId = "oklch" | "contrast" | "material" | "fixed"; // + presets (tailwind, radix, …)

export type PaletteConfig =
  | { strategy: "generative"; algorithm: Exclude<AlgorithmId, "fixed">; seed: string;
      // algorithm-specific (validated by the producer schema):
      preserveSeedAt?: string;                 // seed anchoring opt-in (default: off → array-driven)
      chromaMult?: number; minChroma?: boolean; hueTorsion?: number; chromaMode?: "consistent" | "max"; // oklch
      ratios?: number[] | Record<string, number>; formula?: "wcag2" | "apca"; // contrast-locked
      variant?: MaterialVariant; tones?: number[];                            // material
      stepOverrides?: Record<string, string>;  // hybrid: pin individual steps
    }
  | { strategy: "fixed"; scale: Record<string, string> }; // identity producer

export type ModeConfig = {
  isDark: boolean;
  appearance?: "light" | "dark";              // which prefers-color-scheme this answers to
  palettes?: Record<string, { seed?: string; ratios?: number[] | Record<string, number>;
                              tones?: number[]; scale?: Record<string, string> }>;
};

export type SemanticTarget =
  | { ref: string } | { onOf: string } | { value: string }
  | { mix: { space: "oklab" | "oklch" | "srgb"; stops: [SemanticTarget, number, SemanticTarget] } };

export type SurfaceConfig = { mode: "fixed" | "elevation" | "alpha" | "relative"; step?: number;
                              tint?: Record<string, { color: string; alpha: string }> };

export type ColorConfig = {
  steps: string[];                             // D2: scale shape (names define N + naming)
  palettes: Record<string, PaletteConfig>;     // D3: neutral required (palette shapes); custom allowed
  modes: Record<string, ModeConfig>;           // "light","dark", + arbitrary
  activeMode?: string;
  // semantics: per-token, per-mode-able overrides (defaults in DEFAULT_SEMANTICS):
  semantics?: Record<string, SemanticTarget | Record<string, SemanticTarget>>;
  surfaces?: SurfaceConfig;                     // omitted => fixed
  forcedColors?: boolean;                       // opt-in @media (forced-colors) remap
};

export type DesignSystem = {
  componentParams: Record<string, Record<string, string>>;
  tokens: Record<string, string>;
  density: Density;
  color?: ColorConfig;                          // NEW; undefined => DEFAULT_COLOR_CONFIG
};
```

**Codec:** store the **recipe** (seeds + algorithm + sparse overrides), never expanded ramps — the URL
stays tiny because generation is deterministic. Codec key `c`, diff/merge vs `DEFAULT_COLOR_CONFIG`;
all-defaults must still encode to `undefined` (no `?preset=`). DTCG is **export-only** (2025.10 object
form; Resolver Module still draft → export per-mode files).

## 7. Customizer UX (`colors-config.tsx`)

Rewire the dead mock to `useDesignSystem`. **Simple (default):** pick a shape (flat / generative);
for generative, an algorithm Select (OKLCH-Perceptual default / Tailwind-style / Material / Contrast-
locked) + a brand-color picker + optional neutral + status toggles + a live swatch strip showing the
ramp + `on-*` + a **per-pairing contrast readout**. **Advanced:** per-palette strategy (generative ↔
fixed paste-ramp ↔ hybrid pin-steps), seed-anchoring toggle, scale-shape editor, hue-torsion/chroma
knobs, semantic remap, surfaces technique, modes (add high-contrast / colorblind), contrast formula.
Everything diffs to nothing so the URL stays tiny.

## 8. Coverage reconciliation (12-system stress-test)

| Must                                                          | Status                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------- |
| `strategy=fixed` passthrough                                  | ✅ identity producer                                                |
| Editable semantic role-set                                    | ✅ `SemanticTarget` map replaces static `theme.css`                 |
| Configurable scale shape                                      | ✅ D2 — `steps[]`                                                   |
| Contextual surfaces                                           | ✅ surface technique menu (§5)                                      |
| **Alpha scales** (Radix A1–A12)                               | ⏳ roadmap — per-step alpha companion + overlay/scrim               |

"Shoulds" (Phase 3+): colorblind hue-remap modes, a dark-derivation strategy hook, import paths,
build-time `on-*` freeze for arbitrary modes. Skip v1: Apple Materials/Vibrancy (emit a parametric
recipe, never a resolved value), Chakra DOM-depth swap.

## 9. Platform-CSS & accessibility triage (external-review filter)

| Item                | Verdict                                                                                                  | When                   |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------- |
| `forced-colors`     | **Adopt, opt-in** (`@media (forced-colors: active)` remap to system keywords — `var()`-piped surfaces/shadows/rings leak otherwise) | with surfaces (Phase 4) |
| Surface technique menu | **Adopt, opt-in**, default `fixed`; `elevation` (discrete) preferred over `alpha` for contextual      | Phase 4                |
| Bridge-PCA          | **Consider** for the perceptual contrast mode (WCAG-2-backwards-compatible + W3C license) — **verify maintenance/license** first | Phase 1+ formula choice |
| Per-pairing contrast readout | **Adopt** — part of the verify layer's UI surface                                               | Phase 1/3              |
| Okhsl / cusp-aware gamut | **Evaluate** as a vivid-ends refinement (isolated in the kernel)                                    | polish                 |
| Recipe-friendly AI + import paths | **Keep as the moat** — LLM emits a _recipe_, the deterministic engine renders (cleaner than competitors hallucinating raw palettes); "paste brand hex / from image / reverse-fit a globals.css" | Phase 2–3 |
| `light-dark()`      | **Defer** — emission ergonomics only (halves output on the light/dark axis of the **flat** shape + themes native controls); a localized `emitCss` change | emitter polish |
| `@layer` wrapper    | **Skip the extra wrapper** — Tailwind auto-layers `@theme`; keep base _rules_ in `@layer base` (already done) | n/a            |
| `@property` typing  | **Skip** — Tailwind doesn't type `@theme` colors; only needed to _animate token values_ (niche) + consumer re-registration footgun | n/a (revisit if animated morphing wanted) |

## 10. Phased plan

- **Phase 0 — engine foundation (DONE; `packages/colors` only, PR #158).** `ColorProducer` registry;
  the OKLCH contrast-target solver (now the _contrast-locked option_); in-engine `on-*`; configurable-N;
  `fixed` producer; deleted the 3000-swatch Leonardo machinery. 43 tests green. Built on `colorjs.io`.
- **Phase 0.5 — engine increment (NEXT; `packages/colors` only, still invisible).** Implement the
  **`oklch` perceptual producer** (§4.2) and **make it the default**; keep `contrast` as the option;
  add the **`verify/` layer** (§4.4) + the `on-color` valley tie-break (§4.3); add seed-anchoring
  default + the preserve-toggle scaffolding. Tests: perceptual ramp shape/evenness, verify nudge/warn,
  arbitrary-N, determinism.
- **Phase 1 — `@dotui/theme` semantic layer + `ColorConfig` + live preview.** Reconcile
  `theme.css`↔`tokens.ts` → `DEFAULT_SEMANTICS`; `resolveColorConfig` + `emitCss`; the model + codec key
  `c`; single injected multi-mode `<style>`; rewire the simple-path customizer + swatch strip + contrast
  readout; `activeMode` + wire the inert MoonIcon + forward mode to iframe.
- **Phase 2 — publisher parity.** Thread `ColorConfig`; move palette out of static `colors.css`; emit
  Tier-1/Tier-2; ship `vars` overrides; lazy-import; prerender default. `shadcn add ?preset=` reproduces
  the preview. (Recipe-AI + import paths land around here.)
- **Phase 3 — advanced UX.** Per-palette fixed/hybrid, scale-shape editor, semantic remap, modes panel +
  arbitrary `[data-mode]`, colorblind/dark-derivation. Re-route component→primitive leaks (`button`
  `--color-disabled`, `tag-group bg-(--neutral-300)`, `calendar --accent-500`) onto semantic tokens.
- **Phase 4 — contextual surfaces + alpha scales + interop.** Surface technique menu + `.surface` CSS;
  `--color-ring-offset`; `--color-shine`; alpha scales + overlay/scrim; `forced-colors` block; DTCG
  import/export; optional P3 output toggle.

## 11. Risks & open decisions

- **"One resolver" invariant** — `resolveColorConfig` must produce identical output in provider, iframe,
  and publisher (single shared module, no env branching).
- **`DEFAULT_SEMANTICS` must reproduce `theme.css` exactly**; the `theme.css`↔`tokens.ts` drift (~20
  tokens) means there's no single trustworthy current source — reconciling it is a prerequisite.
- **Codec diff/merge** bug silently bloats URLs or drops overrides — round-trip tests required.
- **Dark-mode ramp** (§4.7) — one mode-agnostic ramp (v1) vs per-mode-tuned (enhancement).
- **Contextual surfaces** have no precomputed `on-*` companion — bounded stepping is a doc/UX constraint.
- **Browser floor:** `oklch()` + `color-mix()` + relative-color gate to Safari 16.4+/recent Chrome/FF
  (same as Tailwind v4); `relative` surface mode needs an `@supports` fallback.
- **Verify auto-nudge** must surface every mutation; never silently distort a generated ramp.

## 12. Decision log — considered & rejected (so we don't re-litigate)

- **Contrast-target as the _default_ generator** — REJECTED (v1 had it). Per-step contrast-targeting
  makes step lightness vary across hues (loses cross-hue consistency), risks muddiness at the dark end,
  and couples primitives to the background. Its "unique" advantages (`on-*`, arbitrary-N) are equally
  achievable with a perceptual ramp. Kept as the **opt-in contrast-locked option**.
- **Component-token tier ("3-tier expert shape")** — REJECTED for 2026 (§3). Over-engineering for a
  single-brand CSS-export builder; kept curated surface vars + the `vars` escape hatch instead.
- **`light-dark()` / `@layer` wrapper / `@property`** — DEFERRED / SKIPPED (§9): ergonomics or redundant
  given Tailwind v4 auto-layering and `@layer base` already in use.
- **`culori` as the hot-path lib now** — DEFERRED: no types; `colorjs.io` (typed, already a dep) covers
  Phase 0–1; revisit for perf when the engine runs live.
- **"contrast-guaranteed, not contrast-generated" framing** — DROPPED as a slogan; the accurate
  description is simply "contrast is **verified** post-generation, not used as the per-step generation
  target" (D6).
- **APCA marketed as a standard** — REJECTED: APCA is unratified (WCAG 3 ~2030); WCAG 2.2 AA is the
  legal target. APCA/Bridge-PCA are perceptual _options_, never the conformance claim.
