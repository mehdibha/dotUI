# @dotui/colors — color-engine design spec (recovered)

> Status: point-in-time recovery, 2026-06-11. **Source of truth is the code** (`packages/colors/src`); this doc records the *design rationale* behind it.
>
> The engine's source comments reference section ids — `§4.2` in `producers/oklch.ts`, `§4.6` in `producers/contrast.ts` and `producers/material.ts`, `§4.3` in `shared/on-color.ts`, `§4.4` in `verify/index.ts`, `§4.5` in `shared/seed-anchor.ts`, `§4.7a` in `engine.test.ts` — but the spec they point at was never checked in: it lived in `docs/color-system-redesign.md` (the "v2 plan"), removed in commit `e419f2fa` ("docs: remove stale internal planning docs"). This file restores the engine sections (§4) so grepping a `§` from a comment lands here. Reconstructed from that removed plan (recoverable via `git show e419f2fa^:docs/color-system-redesign.md`) and the engine PRs ([#158](https://github.com/mehdibha/dotui/pull/158) the engine + v2 doc, [#186](https://github.com/mehdibha/dotui/pull/186) palette SSOT, [#187](https://github.com/mehdibha/dotui/pull/187) typed `BaseThemeOptions`, [#188](https://github.com/mehdibha/dotui/pull/188) live `--on-*`), verified against the code and tests as of this commit. Where the shipped code diverges from the original plan, an **As built** note records what won.

## Locked decisions (context)

- **D1 — Default algorithm: OKLCH-perceptual.** The ramp is generated *perceptually and background-independently* (fixed hue, perceptual lightness ladder, tapered chroma, gamut-mapped). The older *contrast-target* solver is **demoted to an opt-in option** (`contrast`). This was reversed from v1 — see §4.1 and the decision log below.
- **D6 — Three-layer split: generate ⟶ pick ⟶ verify.** See §4.1.
- The engine is **pure**: no CSS, no DOM, no semantic-token vocabulary. It emits primitive ramps (+ paired `on-*`) keyed by step; the semantic layer (`www/src/registry/theme/`) maps those onto tokens.

## §4.1 — The three-layer split (generate ⟶ pick ⟶ verify)

The 2024–2026 consensus across Tailwind v4, Radix, Material HCT, Mantine, and Evil Martians/Okhsl: **none generate ramp steps to a background contrast ratio.** They all instead:

1. **Generate** the ramp **perceptually + background-independently** (fixed hue, perceptual L ladder, tapered chroma, gamut-map).
2. **Pick** each foreground with a **simple contrast function** (the better-contrasting tinted/neutral pole).
3. **Verify** accessibility with a **post-generation contrast test** on the *semantic pairings* — nudge or warn, surface a readout.

Background-independence applies to ramp **generation**; contrast-awareness applies to the **pick** and **verify** layers. That separation is what makes the design coherent — and is why the default `oklch` producer never reads the background.

## §4.2 — Default recipe: "OKLCH Perceptual" (the `oklch` producer)

Pure, deterministic, background-independent, emits `oklch()`. (`packages/colors/src/producers/oklch.ts`.)

- **Space:** OKLCH end-to-end; gamut via `gamutMap` (CSS Color 4 chroma-reduce + clip). The gamut clamp **is** the cusp-awareness — no explicit cusp math.
- **Lightness:** a **fixed perceptual L array**, background-independent — the Evil Martians anchors (`shared/curve.ts` `L_ANCHORS`, light→dark): `0.9778, 0.9356, 0.8811, 0.8267, 0.7422, 0.6478, 0.5733, 0.4689, 0.3944, 0.3200, 0.2378`. Resampled to arbitrary N via `resample`. **Mode-agnostic** (see §4.7a).
- **Chroma:** `seedChroma × chromaMult × envelope(i)`, then gamut-clamp. Envelope = `0.45 + 0.55·sin(π·i/(N-1))` (mid-peak taper, `chromaEnvelope`). A Material-style **min-chroma floor** (`minChroma`, default `0.11`) keeps muted seeds yielding a usable accent. The neutral palette floors C ≤ `0.012`. Two chroma sub-modes: `consistent` (default, envelope-capped) and `max` (flat high C per step, let gamut clip — vivid, uneven).
- **Hue:** **constant by default** (OKLCH hue is perceptually stable; Radix deliberately skips torsion). Opt-in **hue-torsion** (`hueTorsion`, default 0): warm hues drift toward orange (~50°), cool toward violet (~290°) at the dark end — a compressed Bezold–Brücke effect, applied per sector. The `tailwind` preset turns it on (default 24°).

## §4.3 — Foreground (`on-*`) function (`shared/on-color.ts`)

For each step, pick the readable foreground from four candidates: hue-tinted near-white, hue-tinted near-black, then pure white / pure black as the fallback in the mid-tone contrast valley. Validated against Radix `accentContrast`, Material `foregroundTone`, Mantine `autoContrast`. Refinements that shipped: Material's "prefer the light pole below mid-L (~0.62)" tie-break (`LIGHT_PIVOT`), and snapping to a pure pole when a step lands in the valley and neither tinted pole clears the floor. Floors: WCAG 2 ≥ 4.5 / APCA Lc ≥ 60. `tinted` is default-on; `tinted:false` restricts to pure black/white. Emitted per step via `computeOnColors`. `onColor` returns an honest result object (`meetsFloor` can be `false` on a mid-light bg where the floor is genuinely unreachable — surfaced, not faked).

**As built:** a second, distinct foreground path also exists — `onBlackWhite` ([#188](https://github.com/mehdibha/dotui/pull/188)) — a pure black/white pick replicating `tailwindcss-autocontrast`'s `getContrastColor` (8-bit WCAG luminance), kept parity-locked so the live `/create` preview matches what `shadcn add` ships. It is separate from `onColor`'s AA-verified tinted poles by design.

## §4.4 — Verification layer (`packages/colors/src/verify/`)

Runs **after** generation, per mode, on **semantic pairings only** (never raw scale indices): `fg↔bg`, each `*-foreground↔its solid`, text-step↔surface, border/ring↔surface (UI 3:1), muted↔muted-surface.

- **Size-aware thresholds** (the Material ContrastCurve insight): WCAG 2 — body 4.5, large/non-text 3.0; APCA — body Lc 60, large 45, non-text 30. Each pairing carries a `sizeClass`.
- **Policy:** `on-*` pairings should never fail (the picker guarantees a passing pole). For a failing surface/text pair, nudge the offending step's lightness by the minimum ΔL that clears the floor, re-gamut-map, re-test; cap the nudge and warn if it can't pass without distorting the ramp. Never mutate the ramp silently.
- **UI surface:** per-pairing fail/AA/AAA + numeric ratio + suggested foreground.

**As built:** `verify` is a **pure reporter** — it returns `PairingResult`s (with an optional `suggestedFg` from `nudgeForTarget`) and never mutates the theme. The actual nudge/warn UX is deferred to the semantic layer. `nudgeForTarget` adjusts foreground **lightness only** (holding c, h) and returns `null` if even the extreme can't clear the target.

## §4.5 — Seed anchoring (`shared/seed-anchor.ts`)

- **Default:** the seed sets **hue + chroma only**; its lightness is **discarded** (array-driven) → clean, even ramps regardless of brand-color lightness. The seed is *not* preserved exactly.
- **Opt-in `preserveSeedAt`:** pin the seed's exact lightness at a named step and rescale each half of the L array around it (keeping the perceptual spacing shape and the endpoints), so the exact brand color lands at that step while the ramp stays monotonic. Brand owners frequently demand their exact value appear somewhere.

**As built:** an unknown `preserveSeedAt` step name now throws (loud failure) rather than silently no-op'ing — see `docs/plans/2026-06-11-colors-audit/004-validate-preserve-seed-at.md`.

## §4.6 — Pluggable producer registry + the algorithm menu

`createTheme` resolves a producer by `AlgorithmId` from a registry; adding an algorithm is one `registerProducer` call, with nothing downstream branching on the algorithm. `ColorProducer` carries `{ id, schema, produce(opts, ctx) }`; `ModeCtx` carries `{ name, isDark, steps, background }`; `PaletteOutput` is `{ scale, on }` of `oklch()` strings.

The shipped menu:

| Priority | Algorithm | Notes |
|---|---|---|
| must | **OKLCH Perceptual** (`oklch`) — DEFAULT | §4.2. The reserved default slot. |
| must | **Contrast-locked** (`contrast`) | The L-bisection solver, **demoted** from default. Per-step contrast targets vs the mode background (WCAG2 or APCA). For teams who must lock per-step contrast. |
| should | **Material / HCT** (`material`) | Wraps `@material/material-color-utilities`, routed through the colorjs.io seam; emits `oklch()`. |
| should | **Tailwind-style** (`tailwind`) | An `oklch` preset with hue-torsion on — proves the registry-extensibility claim (one `registerProducer`, no core edits). |
| nice (not built) | Radix-matched · Mantine 10-shade · tints.dev · chroma.js multi-hue | Migration / brand-fidelity / editorial scales. |

**Skipped on purpose:** Leonardo's swatch-enumeration impl (the idea survives as the `contrast` option); `apcach`/`apca-w3` as a dependency (license risk — use colorjs.io's MIT APCA); Ant Design HSV.

**As built:** the registry is now genuinely open — `createTheme` accepts a registered *non-builtin* id (validated by `customThemeOptionsSchema`; knobs validated per-producer), where it previously rejected anything outside a closed five-arm union. See `docs/plans/2026-06-11-colors-audit/003-open-algorithm-registry.md`. The `fixed` (identity) producer was also added (hand-authored ramps share the generated-ramp output contract).

## §4.7 — Configurable-N, gamut, libraries, dark mode

- **Configurable-N:** `ColorScale` is `Record<string,string>`; `SCALE_STEPS` (`50…950`) is just the default; schemas accept any step set with `min(2)`; anchors resample to N.
- **Library:** built on `colorjs.io` (native `oklch()`, `toGamut({method:"css"})`, WCAG2 + APCA). A `culori` hot-path migration is deferred and isolated behind `shared/color.ts`.
- **Gamut:** `toGamut({ space: "srgb", method: "css" })` (CSS Color 4), not `clampChroma` (which collapses saturated yellows). **As built:** the gamut target is now a parameter (`targetGamut: srgb | p3 | rec2020`, default `srgb`) so the engine can emit wide-gamut ramps — see `docs/research/2026-06-13-colors-modernization.md`.

### §4.7a — Dark-mode sub-decision (open question at spec time)

With a background-independent ramp, dark mode can be handled two ways:

- **(a)** one **mode-agnostic** ramp; the *consumer* flips which steps it references per mode (simplest — shipped for v1). This is why `oklch` ignores `ctx.isDark`, and why `engine.test.ts` asserts "light and dark ramps are identical (mode-agnostic, §4.7a)".
- **(b)** a **separately-tuned dark ramp** (Radix/Material — dark UIs are not just inverted light). Deferred as an enhancement.

**v1 shipped (a).** The consequence: the www layer derives dark mode by *reversing* the light ramp, which is only correct for the background-independent producers (`oklch`/`tailwind`) — the `contrast`/`material` dark output it produces is *not* what those algorithms would generate against a dark background.

> **Open question (unresolved at spec time):** should the kernel own per-mode generation so `contrast`/`material` dark output is faithful? Tracked and planned in `docs/plans/2026-06-11-colors-audit/005-kernel-owned-dark-mode.md`. *(This doc intentionally does not pre-decide it.)*

## Decision log — considered & rejected (so we don't re-litigate)

- **Contrast-target as the default** — REVERSED to OKLCH-perceptual (D1). Contrast-target spreads same-step lightness across hues (it solves each hue to a ratio), losing cross-hue alignment; kept as an opt-in option.
- **Component-token tier ("3-tier expert shape")** — rejected for 2026 as over-engineering.
- **`light-dark()` / `@layer` wrapper / `@property`** — deferred/skipped on ergonomics or redundancy grounds.
- **`apcach` / `apca-w3` dependency** — rejected (license risk); use colorjs.io's APCA.
