# Color model decision — critique, comparison, recommendation

> Status: decision doc, 2026-07-05. Step 1 of the builder roadmap (color system → builder UX prototype → rebuild). Point-in-time; findings reference the code as of `a7d1f111`.
> Companion artifact: [`ramps-comparison.html`](ramps-comparison.html) — side-by-side ramps generated from the live engine by [`generate-comparison.ts`](generate-comparison.ts). Judge the outputs there; this doc explains what you're seeing and ends with the call.

## TL;DR

The kernel's **architecture is right and matches #377 §5** (producer registry, per-mode context, zod-validated opts). What's broken is everything around it:

1. **Dark mode is a mirror, not a mode.** `resolveColorConfig` generates light only and reverses the ramp. Every producer's dark path is dead code; two producers' core guarantees are silently void in dark.
2. **The default producer is one ladder + one sine for every hue.** Yellow turns to mud, the seed never appears in the ramp, and a post-hoc `stretchLightness` hack papers over the ladder's short span — for the neutral only.
3. **The product rejects exactly the inputs that would let users recreate real design systems**: hand-tuned ramps (`fixed`), custom palettes, custom steps, per-mode seeds.

**Recommendation: keep the kernel, fix the producers, delete the www betrayals.** Generate dark as a real mode through the kernel (`isDark`-aware oklch producer), make the chroma envelope hue-aware, make `fixed` (paste-my-palette / import Tailwind-Radix) first-class, and expose a two-seed simple mode. Do **not** adopt #377's full token graph / mode cube now. Details in [§C](#c-recommendation).

---

## A. What's actually wrong with the current engine

Each item is a concrete defect with the code that causes it. The visual evidence lives in `ramps-comparison.html` (section numbers cited as **[viz §n]**).

### A1. Dark mode is derived by reversing the light ramp — the kernel's mode machinery is bypassed

`www/src/registry/theme/primitives.ts` calls the kernel with `modes: { light: true }` only (line 102), then builds dark as `reverseRamp()` — step 50 takes 950's value (lines 33–42, 121–123). Consequences:

- **The kernel's whole modes feature is dead in the product.** `createTheme` supports per-mode configs, per-mode seeds, per-mode backgrounds (`theme.ts`); www never asks for them.
- **The `contrast` algorithm's one promise — per-step contrast against the actual background — is void in dark.** Its dark ramp is not solved against the dark background; it's the light solution mirrored. The builder offers "Contrast-locked" as an algorithm whose defining property silently doesn't hold in half the product.
- **The `material` producer's `DARK_TONES` path never runs** (`producers/material.ts:23`). "Material" in the builder is Material's light tones mirrored — which is precisely what Material 3 defines dark mode *not* to be.
- **Semantic tokens are forced mode-agnostic** (`semantics.ts` — one ref per token), so they only work if mirror symmetry holds. The `color-fg-muted` comment (semantics.ts:85–89) documents the resulting compromise in the shipped default: *one step can't hit the right muted tone in both modes*. That's not a tuning miss; it's the representation being unable to express the truth.
- **Reversal forces dark and light to share one lightness structure.** Real dark UIs compress the surface end harder than light UIs do (compare Radix `gray` vs `grayDark` spacing — they are not mirrors). Reversal makes that impossible by construction. **[viz §5]** — look at the reversed dark accent: steps 50–200 (the "muted accent surface" tokens) are the light ramp's heavy navy *text* colors, not dim tinted surfaces.
- Even inside the kernel, the flagship `oklch` producer **ignores `ctx.isDark` entirely** (`producers/oklch.ts` — `isDark` is never read). Only `material` and `contrast` are mode-aware. So "dark-mode derivation" doesn't exist anywhere in the default path: not in www, not in the producer.

### A2. Ramp quality: one lightness ladder and one chroma envelope for all hues

`shared/curve.ts`: every ramp, every hue, gets the same 11 Evil-Martians lightness anchors and the same `0.45 + 0.55·sin(π·t)` chroma envelope peaking at the middle step.

- **Chroma peaking at step 500 (L≈0.65) is wrong for most hues.** A hue's maximum usable chroma lives at its gamut cusp: yellow's cusp is near L 0.9, blue's near L 0.45. Hand-tuned palettes track this — Tailwind yellow peaks chroma at 400 (L 0.85, C 0.199); dotUI regenerates yellow with its vivid zone forced to L 0.83/C 0.156 and a solid-500 of **`#b38800` (L 0.65, C 0.133) — mustard mud** where Tailwind has a vivid L 0.80. **[viz §2]** This isn't hypothetical: the shipped default's `--warning-500` is `oklch(0.6497 0.1338 82.26)` = `#b78600` (`base/colors.css:48`) — every warning button in the product today renders the defect. *(User-ratified 2026-07-05: "the dotUI yellow btn is awful.")*
- **The ladder bottoms out at L 0.238** (`L_ANCHORS`), too shallow for surfaces. Rather than fix the anchors, `primitives.ts` bolts on `stretchLightness` — a smoothstep rescale to L 0.13–0.985 — **applied to the neutral only** (line 115–118). So: colored ramps and the neutral live on different lightness systems; the "perceptual anchors" the producer is named for are overwritten for the ramp that matters most; and because the stretch runs *after any algorithm*, picking "Material" gives you a neutral whose tones are **not Material's tones** — HCT output silently re-spaced by a smoothstep.
- **Every generated hue has identical structure**, so a multi-hue palette reads as uniform stripes with no per-hue character. **[viz §3]** — the 17-hue sweep against Tailwind's shipped ramps is the clearest single image of the quality gap.
- `hueTorsion` (the "Tailwind-style" differentiator) only acts inside two hue windows — 20–110° drifts to 50°, 200–290° to 290° (`producers/oklch.ts:40–48`). **Red, green, magenta, pink get zero torsion**: for half the wheel, the "tailwind" preset is literally the `oklch` producer with a different label.
- `chromaMode: 'max'` ("Vivid") sets a flat C 0.4 on every step and lets sRGB gamut-clipping sort it out — not "the gamut cusp per step" as its own comment claims; the result depends entirely on the clipping behavior and produces erratic per-step chroma.

### A3. Seed fidelity: the brand color you pick is not in the palette you get

- `applyAnchoring` (`shared/seed-anchor.ts`) **discards the seed's lightness by default** — the ramp takes only hue + chroma. Pick `#635bff` and no step of the resulting ramp is `#635bff` or close (nearest step ΔEok ≈ 0.09 — visibly off-brand). **[viz §6]**. The fix (`preserveSeedAt: '500'`) exists but is an advanced knob defaulting to off — backwards for a *brand-color* input. For comparison: Radix's custom-palette tool and Material HCT both make the input color recoverable.
- `DEFAULT_MIN_PEAK_C = 0.11` silently **boosts muted seeds**: a deliberately dusty brand accent (C 0.05) comes out more than twice as saturated as chosen. A floor for "usable accent" is defensible as a default; being invisible and un-annotated in the UI is not.
- The neutral clamps chroma to **0.012** (`NEUTRAL_MAX_C`) — fine for Radix-slate-level tinting, but warm cream / Solarized-style tinted neutrals are unreachable on any knob.

### A4. `resolveColorConfig` rejects exactly the escape hatches real systems need

`www/src/registry/theme/primitives.ts:78–82` throws on any non-generative algorithm, and `color-config.ts` deliberately excludes `fixed`. The kernel *has* a `fixed` producer (hand-authored ramps, normalized to oklch, on-colors computed — `producers/fixed.ts`), but no product path reaches it. So:

- **Paste-my-palette is impossible.** A user with an existing hand-tuned palette (every team migrating from Tailwind/Radix/their own DS — the builder's north-star case) cannot enter it.
- **Per-step editing is impossible** — there's no "tweak step 600" without a fixed representation to land the edit in.
- `PaletteSeeds` is a **closed set** (neutral, accent, 4 statuses). The kernel accepts arbitrary custom palettes via catchall (`schema.ts:12–14`); www never surfaces them — no second brand ramp, no chart ramp.
- `ColorConfig.steps` exists in the type; nothing sets it. 11 steps named 50–950 is effectively hardcoded product-wide.

### A5. Two on-color systems; the shipped one has no floor, the good one is dead weight

The kernel carries a careful `onColor` (`shared/on-color.ts`): tinted poles, AA floor check, honest `meetsFloor`, APCA option. **The product discards it.** What ships is `onBlackWhite` — pure black/white by WCAG luminance, chosen to stay in lockstep with the `tailwindcss-autocontrast` plugin, kept aligned by a parity test. Defensible (preview must equal export) — but:

- `onBlackWhite` has **no contrast floor**: it picks the *better* of black/white, which on mid-tone solids can still fail AA, silently. **[viz §7]**
- Every producer computes the rich on-colors on every call (`computeOnColors`) and every product path throws them away — pure waste plus a second contrast vocabulary to maintain.
- The `verify/` layer (per-pairing WCAG2/APCA reporter with `nudgeForTarget` autofix) is used in exactly one place: a builder readout of **six pairings, light mode only, step 500 only** (`modules/create/colors/contrast.tsx`). Nothing verifies dark (nothing meaningfully could — it's a mirror), nothing runs at export, `nudgeForTarget` has zero callers.

### A6. Verdict on the critique

The slop isn't the kernel's shape — registry, pure producers, validated opts, verify layer are all the right bones, and the code is clean. The slop is that **the system's claims don't survive contact with its own product layer**: mode-aware producers that never see a second mode, perceptual anchors that get smoothstepped away, a fixed producer nothing can reach, an AA-verified on-color nobody ships, a verify layer nobody enforces. The engine is a well-organized collection of promises the www layer breaks.

---

## B. How the reference systems build palettes

| | Lightness structure | Chroma structure | Dark mode | Input fidelity |
|---|---|---|---|---|
| **Tailwind v4** | Hand-tuned per hue (11 steps) | Hand-tuned per hue; peak follows the hue's cusp (yellow peaks at 400, blue at 500–600) | Same palette; consumers pick darker steps. No dark ramps | N/A — it *is* the palette |
| **Radix Colors** | 12 steps designed by **use case** (1–2 app bg, 3–5 component bg, 6–8 borders, 9–10 solid, 11–12 text); hand-tuned per hue | Hand-tuned; per-hue special cases (amber/yellow/lime/mint/sky pair solids with *dark* text) | **Separately hand-designed dark scales** — not mirrors; dark surface end compressed differently than light | N/A / custom tool anchors your color at step 9 |
| **Material HCT** | Tone = CIE L*, the ramp is fixed tones; contrast is *guaranteed by tone distance* (ΔTone ≥ 40 → 3:1, ≥ 50 → 4.5:1) | Hue+chroma from seed, chroma clipped to gamut per tone | **Different tone assignments per scheme** from the same tonal palette — never reversal | Seed's hue+chroma preserved; tone 40/80 roles ≈ recoverable |
| **#377 §5 (producers × cells)** | Producer-owned; `oklch` producer is `isDark`-aware (real dark anchors per cell) | Producer-owned per cell | **A cell, not a transform**: producer re-runs per cell with per-cell config (optional second dark seed); "ramp reversal does not exist anywhere in the perfect dotUI" | `fixed` producer first-class per cell = paste-my-palette; editing a generated step converts the ramp to fixed |

Two structural lessons the current engine misses:

1. **Nobody derives dark by transform.** Radix hand-designs it, Material re-picks tones, #377 re-runs the producer. Dark is a *generation context*, not a post-processing step.
2. **Quality lives in per-hue / per-use-case variation.** Tailwind and Radix are good *because* each hue is treated individually; Material gets away with a formula because HCT's tone/chroma model encodes the per-hue gamut behavior the sine envelope ignores. A generative engine competes only if its formula is hue-aware.

The current kernel is #377 §5's producer registry **minus the cells** — same `Producer` interface shape, same five producers, same open registry. #377's color chapter is less a redesign than a description of what this kernel would be if the product actually used it.

---

## C. Recommendation

**Adopt the #377 §5 color model, scoped to two hardcoded cells (light, dark), implemented as a repair of the existing kernel + `resolveColorConfig` — not a rewrite, and not the token graph.**

### C1. Do now (the color-model decision)

1. **Dark is generated, never reversed.** Delete `reverseRamp` + `stretchLightness`. `resolveColorConfig` calls `createTheme` with `modes: { light: true, dark: true }`; the `oklch` producer becomes `isDark`-aware: a dark anchor ladder (surface end compressed, spanning ~L 0.145–0.985 so the stretch hack has nothing left to do), slightly damped peak chroma, envelope shifted toward the light half. The prototype rows in **[viz §5]** are a first sketch of exactly this — judge them against the reversed rows and Radix dark. `ColorConfig` gains optional per-mode seed overrides (`darkSeeds?: Partial<PaletteSeeds>`) — auto-dark by default, refinable, per #377's "opt-in refinement, never a requirement."
   1a. **The mode set is user config, not a constant.** `ColorConfig.modes: ('light' | 'dark')[]`, default both; `['light']` and `['dark']` are legal — a light-only marketing DS or a dark-only Linear-style tool shouldn't ship a mode it never uses. Emission adapts: single-mode systems emit `:root` only (no `.dark` block, no dead CSS), and a dark-only system emits its dark ramps *as* `:root`. The kernel already accepts arbitrary named modes (`theme.ts`); this is pure www surface. It also only becomes possible once reversal dies — today "dark" is definitionally a transform of light, so light-only is free but dark-only is nonsense.
   1b. **Each mode gets a `surface` lightness knob** (`modes: { dark: { surface: 0.145 } }`-style config; default 0.985 light / 0.145 dark). The mode's anchor ladder derives from its surface anchor, so `neutral-50` *is* the background by construction — and a user who finds near-black too heavy sets dark's surface to ~0.22 and gets a coherent "dim" mode, every surface-following token shifting with it (this is exactly #377 §11's `dim` worked example, scoped to our two modes). The kernel's `resolveMode` already carries `bgLightness`; today it's unreachable dead config from www.
2. **Fix the light producer's chroma model.** Replace the fixed sine with a cusp-aware envelope: compute the seed hue's approximate cusp lightness (colorjs.io can give the gamut boundary; a small per-hue-sector LUT is also fine) and peak the envelope there instead of at t = 0.5. Extend torsion to the full wheel or drop the "tailwind" preset's pretense. Keep the EM anchors for lightness (they're good), full-span so neutral and accents share one system.
3. **Make `fixed` a first-class product path.** "Paste palette" (textarea → step map) and "start from Tailwind `<hue>` / Radix `<scale>`" importers, both per mode. Editing any step of a generated ramp converts that ramp to `fixed` (per #377 — no half-generated ramps). This single feature is what makes "recreate Material/Geist/Linear" honest.
4. **Semantics gain per-mode refs where reality demands it** — an optional `overrides?: Record<ModeName, ref>` on a semantic token (not a hardcoded `dark` field — the slot must not assume which modes exist), used sparingly: `color-fg-muted` → `neutral-400` in dark, per #377's worked example. Not the mode cube; one optional override map.
5. **Wire verification in.** The builder readout covers all shipped pairings (both modes, muted surfaces, not just 500); export runs `verifyTheme` and *reports* (no blocking yet — propose-don't-impose comes with the builder rebuild). Keep `onBlackWhite` as the shipped on-color (preview=export parity is the right call); surface its failures instead of hiding them.
6. **Expose custom palettes** (the kernel already accepts them): "add palette" with a name + seed, emitted as `--<name>-*`. Cheap, unblocks second-brand/chart ramps.

### C2. Explicitly not now

- **No token graph, no mode cube, no `RampSpec` cell-keyed config objects** — pre-beta, a user-chosen subset of `{light, dark}` is the right scope; the #377 infra chapters stay parked.
- **No high-contrast mode yet — but nothing may preclude it.** HC is a real future axis (it composes with *every* scheme, which is exactly why #377 models modes as dimensions), and the shapes chosen here keep the door open: modes are named generation contexts (a `contrast` producer with boosted targets, or an `hc` entry with its own config, slots in without rework), and the semantic override slot is a per-mode map, not a `dark` boolean. When HC comes it's a propose-and-approve axis on top of this model, not a rebuild of it. Same story for brand sub-themes / a `dim` third scheme.
- **No HCT as the default.** Material stays an algorithm choice; dotUI's default look shouldn't inherit Material's opinions. Fix `material` so its dark tones actually run (free once dark is a real mode) and stop stretching its neutral.
- **Contrast producer stays demoted** but becomes honest: once dark is generated, its guarantee holds in both modes.
- **Drop `chromaMode: 'max'`** unless someone implements a real cusp computation — a flat 0.4 + clipping isn't a feature, it's a bug with a Select option.

### C3. Simple mode vs advanced mode

The builder's default color surface is **three decisions**:

| Simple mode exposes | Behavior |
|---|---|
| **Accent** (color well) | Seed. `preserveSeedAt: '500'` **on by default** — the color you picked is in your palette. Auto-dark. |
| **Neutral tint** (none / warm / cool / from-accent, + subtle strength) | Maps to neutral seed hue + chroma ≤ 0.012. Auto-dark. |
| **Modes** (Light / Dark / Both, default Both) | Which modes the DS ships. Not an advanced recipe — a fundamental product fact about the system being built. |

Everything else defaults: `oklch` algorithm, status seeds from `SEMANTIC_COLORS` (which, with `preserveSeedAt` on, land *exactly* — warning-500 becomes `#eab308`, immediately curing the shipped mustard warning button), generated dark at surface 0.145, contrast readout visible (read-only). That's it — no algorithm select, no knobs, no per-status wells in simple mode.

**Advanced mode adds**: algorithm select; per-status + custom palettes; per-mode seed overrides; per-mode **surface lightness** (the "my dark bg is too black → dim it to L 0.22" control); the knobs (chromaMult / minChroma with its floor made visible, torsion, preserveSeedAt); paste/import palette (`fixed`); per-step editing (converts to fixed); steps config stays out until a real use case shows up. Whether dark-surface deserves a simple-mode preset (Black / Dim) is a taste call for the step-2 builder prototype to test.

The dividing rule: **simple mode is seeds; advanced mode is recipes; fixed is escape.** Every simple-mode output must be reproducible in advanced mode (it's the same `ColorConfig`), so upgrading never resets a palette.

### C4. What this unblocks

Roadmap step 2 (builder UX prototype) gets a color panel whose top surface is two controls, with a credible "it just looks good in dark too" story — which is the actual pitch. Step 3's rebuild lands on the #377 execute-now substrate with a color engine whose claims are finally true.

---

## D. How to judge the artifact

Open [`ramps-comparison.html`](ramps-comparison.html):

- **§1 blue / §2 yellow** — same seed through every engine vs the hand-tuned ground truth. Yellow is the damning one.
- **§3 hue sweep** — squint test: Tailwind's grid has per-hue character; dotUI's is stripes.
- **§5 dark** — the decision's core. Compare "reversed" vs "prototype generated" vs Radix dark, for neutral and accent. If the prototype rows read clearly better than the reversed rows, C1.1 is ratified; the exact anchor values are step-2 tuning work.
- **§6 brand fidelity** — default vs `preserveSeedAt` — the case for C3's simple-mode default.
- **§7 text-on-solid** — why verification must be surfaced, not trusted.

Regenerate anytime: `node_modules/.bin/tsx docs/research/2026-07-05-color-model/generate-comparison.ts`.
