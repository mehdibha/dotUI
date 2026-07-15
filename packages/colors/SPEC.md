# @dotui/colors — engine spec

The contract for the from-scratch rewrite of the color engine. One engine, no
algorithm menu. Every decision below states: the decision, the parameters it
exposes, and the check that enforces it in CI.

**Method:** the colors.dotui.org research is treated as a hypothesis list, not a
source of truth. Every load-bearing number in this spec is re-measured from
primary sources — `@radix-ui/colors`, `tailwindcss` palettes, the official
`apca-w3` meter, raw WCAG math — before its decision locks.

**Status legend:** ✅ locked · 🟡 proposed (needs Mehdi's sign-off) ·
🔬 open (research/measurement needed before locking)

---

## D1. Output contract — steps are jobs ✅

A scale is not a gradient; it is 12 job slots. The engine generates _to the
jobs_, and every guarantee attaches to a job, not an index.

| #   | Name | Job                           |
| --- | ---- | ----------------------------- |
| 1   | 25   | app background                |
| 2   | 50   | subtle background             |
| 3   | 100  | UI element background, rest   |
| 4   | 200  | UI element background, hover  |
| 5   | 300  | UI element background, active |
| 6   | 400  | border, subtle                |
| 7   | 500  | border, interactive           |
| 8   | 600  | border, emphasized            |
| 9   | 700  | solid                         |
| 10  | 800  | solid, hover                  |
| 11  | 900  | text, low contrast            |
| 12  | 950  | text, high contrast           |

Naming: 🟡 12 jobs, Tailwind-style names (Mehdi's call), realized as
`25…950` — adds `25` below `50` so subtle-bg stays `50` and text stays
`900/950` per Tailwind culture. (Cost accepted: solid lands on `700` where
Tailwind convention says `600`; primitives are mostly consumed through the
semantic layer anyway.)

Verified from primary data (scratchpad `verify/measure1.mjs`, 2026-07-14):

- Radix light-mode spacing is deliberately uneven: backgrounds Δ1–3 L\*,
  border/solid region Δ4–15, a 24–30 L\* cliff between text steps. Equal
  slicing is structurally wrong.
- Radix engineers to job guarantees for real: worst light step-11 on step-2 =
  Lc 66 (≥60), worst step-12 = Lc 91.7 (≥90).
- **Amber step 9 is +11 L\* lighter than step 8.** Solids are non-monotonic
  for yellows. Consequence: steps 1–8 ride a skeleton; **steps 9–12 are placed
  by their job**, not by a descending ramp.

Params exposed: none (the job table is the contract, not a knob).
CI check: every emitted scale has exactly these 12 steps; job-order
monotonicity is asserted for 1–8 only.

## D2. Guarantees & meters — dual-meter ✅

Every text-carrying job states its guarantee as _(foreground, meter, named
backgrounds)_, checked with **both** meters: WCAG 2 is the normative floor,
APCA is the perceptual target.

Verified: APCA-only leaves WCAG holes — six Radix light scales (amber, green,
jade, orange, teal, yellow) ship step-11 text at 4.25–4.49:1, under the 4.5
floor. WCAG-only picks the wrong pole on solids — on blue-9, WCAG votes black
(6.43 vs 3.26) while APCA votes white (Lc 65 vs 45); the eye agrees with APCA.

Default guarantees (🟡 exact bars):

- step 900 text on 25/50/100 backgrounds: WCAG ≥ 4.5 **and** APCA ≥ Lc 60
- step 950 text on 25/50/100 backgrounds: WCAG ≥ 7.0 **and** APCA ≥ Lc 90
- `on-700` / `on-800` (solid labels): WCAG ≥ 4.5 **and** APCA ≥ Lc 60,
  solved per hue per mode — never a global black/white rule
- borders 400/500 against 25/50: WCAG ≥ 1.3:1 🔬 (non-text 3:1 applies only to
  UI component boundaries; verify what bar Radix/Geist actually clear)

CI check: `verify()` runs in-loop at generation time; a scale that cannot meet
its guarantee moves its solid/text lightness until it does (the engine owns
the ramp). Emission of a failing scale is a build error, not a warning.

## D3. Working space ✅

OKLCH is the working space; every ramp is three independent curves L(step),
C(step), H(step). All interpolation and state math in OKLab/OKLCH. Gamut
mapping to sRGB at build time (CSS Color 4 constant-L/H chroma reduction) —
browsers must never clip.

**The L\* bridge** (verified): at fixed OKLCH L, white-text WCAG drifts 18%
across hue (3.53→2.90); at fixed CIELAB L\* it locks (3.66–3.76). Therefore
the **skeleton anchors in L\***, converted to OKLCH L per hue at generation
time. Contrast promises on skeleton steps become hue-stable by construction.

Kernel: culori behind a single seam file; APCA ported from the verified
45-line implementation (parity-tested against `apca-w3`); ΔEok + CVD
simulation (culori Machado filters) as first-class meters.

## D4. Lightness skeleton 🔬

Hybrid: jobs 1–8 ride a fixed per-mode L\* skeleton (cross-hue consistency,
documentable); jobs 9–12 are solved (D5/D2).

Research before locking: measure Radix + Tailwind + Geist light-mode L\* per
job slot; fit our default skeleton from that data (not from the EM anchors the
old engine used). Output: 8 L\* numbers for light mode (dark mode in D9).

Params: density/contrast-of-skeleton as a future axis, not v1.
CI check: skeleton steps within ±ΔL\* tolerance of spec values; WCAG of
guaranteed pairs stable across all 360 hues (property test).

## D5. Chroma 🔬

Per-hue chroma curve fit under each hue's own gamut ceiling, peaking at the
solid jobs (not mid-scale). No global envelope, no chroma floor (0.11 in the
old engine inflated gray seeds — intake classifies instead, D7).

Research before locking: measure Radix masters' C(step) per hue family;
derive the curve family + peak placement; decide P3 as a guarded second pass
(emission detail, D12).

Params: `vividness` (scales the fitted curve), per-palette override.
CI check: no emitted value out of sRGB; ΔC between adjacent steps bounded;
generated vs Radix master ΔEok under threshold per family.

## D6. Hue policy 🔬

Constant hue by default; **per-family bend table** keyed to L (not step
index), one user axis scaling the family default. Course hypothesis: yellow/
amber/orange bend 35–50° toward gold at the dark end, blue ~13° toward violet,
red/green ~0.

Research before locking: measure H(step) drift per Radix family (light+dark);
fit the bend table from data.

Params: `hueShift` (scalar on family default), per-palette override.
CI check: dark steps of yellow stay in the yellow/gold hue band (never olive);
generated hue drift within family tolerance.

## D7. Seed intake 🔬 (small)

Seed → OKLCH at the door; gamut-map and report the cost. Classify
accent-vs-neutral (whisper line ~C 0.02 — verify against Radix grays).
Slot nearest-by-L with named override. **Snap by default; `preserveSeed:
true` as an explicit switch that prints its ΔEok price.**

Params: `preserveSeed`, explicit `slot` override.
CI check: round-trip — with `preserveSeed` the seed appears verbatim at its
slot; without it, reported ΔEok(seed, nearest step) is under the snap bound.

## D8. Neutrals 🔬 (small)

Auto-tint the neutral from the accent hue at whisper chroma. Course
hypothesis: the whole move lives below C 0.02 (Radix slate peaks ~0.0165).
Verify by measuring all six Radix grays. Pure gray stays legitimate.

Params: `neutralTint` (amount), `neutralHue` (override).
CI check: neutral C ≤ whisper ceiling at every step; neutral passes the same
D2 guarantees.

## D9. Dark mode — a second generation pass 🔬

Not a transform of light. Own L\* skeleton (surfaces spread wider near black),
own per-job chroma budgets (verified direction: yellow _gains_ chroma in dark
text steps), own neutral tint budget, an elevation policy (overlay-lightening
or step-based — decide), floor not pure black by default (OLED-black as an
option).

Research before locking: measure Radix dark masters (skeleton, chroma,
yellow reversal); re-check the course's claim that Radix dark step-12
under-delivers Lc 90 (19/31 scales — re-measure); pick the elevation model.

Params: `darkBackground` (lightness/OLED-black), everything else defaulted.
CI check: same D2 guarantees re-run per mode; dark-specific floor asserts
(no two adjacent surface steps render identical sRGB).

## D10. States, alpha, status 🔬 (medium)

- State shifts are **signed per mode** (hover darkens on light, lightens on
  dark) and expressed as ramp walks where a slot exists, computed shifts
  where not.
- **Alpha twins** per scale, Radix-style: composite exactly to the solid
  ramp over the mode's app background. Verify construction digit-for-digit
  against Radix alpha scales before implementing.
- Status palettes are four mini-systems (subtle bg, border, solid, text) from
  four seeds. New default seeds must pass a **CVD gate** (min pairwise ΔEok
  across protan/deutan/tritan at severity 1 — current Tailwind-hex defaults
  fail deutan). 🔬 pick the seeds by measurement.

Params: status seeds (defaulted, overridable).
CI check: alpha twins composite to within 1/255 per channel; CVD gate on the
status set; solid labels per D2.

## D11. Chart palettes 🔬

Generated, not aliased: categorical (L-staggered, CVD-gated, ceiling ~6–8),
sequential (L strictly monotonic), diverging (two arms + neutral midpoint
pinned to the surface neutral) — all from the theme's seeds.

Research before locking: smallest — port the course's gates, validate
against viridis/Okabe-Ito as reference palettes.

CI check: categorical min pairwise ΔEok (normal + CVD); sequential L
monotonicity; diverging midpoint anchored to neutral.

## D12. API & emission 🟡

**Convenience bar: one seed in, a complete correct system out.** Everything
else optional with research-backed defaults.

```ts
createTheme({ seed: '#635bff' })
// → { light, dark } × { primary, neutral, success, danger, warning, info }
//   × 12 steps + on-* + alpha twins + chart palettes, all guarantees enforced
```

- Options are flat and few: `seeds` (per palette), `preserveSeed`,
  `vividness`, `hueShift`, `neutralTint`/`neutralHue`, `darkBackground`,
  status seed overrides, `steps` naming override.
- Emission: `oklch()` literals, no hex fallbacks; static values only (no
  runtime color-mix/contrast-color); P3 as a guarded `@media (color-gamut:
p3)` second pass, deliberately generated (never bare wide literals).
- Pure kernel: no CSS-variable names, no semantic vocabulary (stays www-side).

CI check: public-API snapshot test; emitted CSS parses; sRGB pass contains
zero out-of-gamut values.

---

## Non-goals (v1)

- No algorithm registry. One engine. (`fixed` ramps remain as an _input_
  format for hand-authored presets, not an algorithm.)
- No HCT, no Leonardo runtime dependency (both are test oracles only).
- No adaptive/runtime contrast; adaptivity lives in the generator.
- No high-contrast mode yet (name-table-ready, values later).

## Verification corpus

- `@radix-ui/colors` (devDep): per-family regression bar (ΔEok per step).
- `apca-w3` (devDep): APCA parity.
- `@adobe/leonardo-contrast-colors` (devDep): contrast-solver parity.
- `/internal/colors` playground: side-by-side old/new/Radix, real component
  compositions (the warning-banner test for yellow).
