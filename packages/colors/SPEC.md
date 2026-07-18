# @dotui/colors — engine spec

The contract for the from-scratch rewrite of the color engine. One engine, no
algorithm menu. Every decision below states: the decision, the parameters it
exposes, and the check that enforces it in CI.

**Method:** the colors.dotui.org research is treated as a hypothesis list, not a
source of truth. Every load-bearing number in this spec is re-measured from
primary sources — `@radix-ui/colors` v3, `tailwindcss` v4 palettes, the official
`apca-w3` meter, raw WCAG math — before its decision locks. The measurement
scripts and fixtures live in `research/` (deterministic, re-runnable; they are
the verification corpus).

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

Verified from primary data (`research/`):

- Radix light-mode spacing is deliberately uneven: backgrounds Δ1–3 L\*,
  border/solid region Δ4–15, a 24–30 L\* cliff between text steps. Equal
  slicing is structurally wrong.
- Radix engineers to job guarantees for real: worst light step-11 on step-2 =
  Lc 66.15 (≥60), worst step-12 = Lc 91.73 (≥90).
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

Verified: APCA-only leaves WCAG holes — six Radix light scales ship step-11
text at 4.247–4.487:1 (orange 4.247, teal 4.341, yellow 4.417, amber 4.433,
jade 4.434, green 4.487), under the 4.5 floor. WCAG-only picks the wrong pole
on solids — on blue-9, WCAG votes black (6.43 vs 3.26) while APCA votes white
(Lc 65 vs 45); the eye agrees with APCA. In dark mode WCAG floors are
non-binding (measured mins 8.38 / 13.01) — APCA drives the dark solver.

Locked guarantees (all solved in-loop, per hue per mode):

- step 900 text on 25/50/100 backgrounds: WCAG ≥ 4.5 **and** APCA ≥ Lc 60
  against the worst of the three. (Stricter than Radix, which fails 4.5-on-100
  in 10/31 light scales; we solve, they inherit.)
- step 950 text on 25/50 backgrounds: WCAG ≥ 7.0 **and** APCA ≥ Lc 90; on
  100: WCAG ≥ 7.0. (Radix dark misses Lc 90 in 19/31 scales, min 84.23; the
  fix costs ~+3 L\* on the worst reds — we enforce it.)
- `on-700` / `on-800` (solid labels): APCA ≥ Lc 60 **and** WCAG ≥ 3.0, solved
  per hue per mode — never a global black/white rule. 🟡 The WCAG bar is the
  3.0 UI floor, not 4.5 AA, by explicit tradeoff: white-on-solid at 4.5 forces
  every solid to L\* ≲ 50 (Radix ships white-on-blue-9 at 3.26; Material gets
  4.5 only by pinning primary at tone 40) — a builder that darkens every
  brand color to pass a meter the industry deliberately overrides fails its
  own product bar. A `strictOnSolid` option solves the solid darker to reach
  the full 4.5 for compliance-bound users. Pole rule: white text
  unless |Lc(white on step 700)| < 40, then dark text
  `oklch(0.25, max(0.08·C₇₀₀, 0.04), H₇₀₀)` (sRGB-clamped). Verified perfect
  precision/recall on all 62 Radix scale-modes, with an empty Lc dead zone of
  29.5–60.8 around the threshold; the dark pole delivers Lc 74.5–87.5, WCAG
  10.1–12.6 on the five bright families. Solids landing inside the dead zone
  still run the full solve rather than trusting the pole.
- borders, both modes, against backgrounds 25 and 50 — **WCAG-only** (apca-w3
  clamps real dark border pairs to Lc 0, so APCA can't meter borders):
  step 400 ≥ 1.30:1, step 500 ≥ 1.45:1, step 600 ≥ 1.80:1. These are the
  measured Radix light floors (1.331 / 1.488 / 1.815); Radix dark clears them
  with margin. Never promise 3:1 non-text for borders — only Radix dark
  step-600 reaches it. (Geist's default border sits at 1.15–1.20:1, below
  this bar: a Geist-fidelity preset needs a per-palette floor override, not a
  lower default.)

CI check: `verify()` runs in-loop at generation time; a scale that cannot meet
its guarantee moves its solid/text lightness until it does (the engine owns
the ramp). Emission of a failing scale is a build error, not a warning.

## D3. Working space ✅

OKLCH is the working space; every ramp is three independent curves L(step),
C(step), H(step). All interpolation and state math in OKLab/OKLCH. Gamut
mapping to sRGB at build time (CSS Color 4 constant-L/H chroma reduction) —
browsers must never clip.

**The L\* bridge** (verified): at fixed OKLCH L (0.5690), white-text WCAG
drifts 15.9% across 36 hues (4.215–4.885); at fixed CIELAB-D65 L\* = 50 it
locks to 1.01% (4.464–4.509). Therefore the **skeleton anchors in L\***
(D65: culori `lab65`, matching WCAG luminance), converted to OKLCH L per hue
at generation time. Contrast promises on skeleton steps become hue-stable by
construction.

Kernel: culori behind a single seam file; APCA ported from the verified
implementation (parity-tested against `apca-w3` on 8-bit sRGB); ΔEok + CVD
simulation (culori Machado filters) as first-class meters.

## D4. Lightness skeleton ✅

Hybrid: jobs 1–8 ride a fixed per-mode L\* skeleton (cross-hue consistency,
documentable); jobs 9–12 are solved (D2/D5).

Light mode, jobs 1–8, CIELAB-D65 L\* — the Radix 25-scale chromatic median
rounded to 0.5 (max rounding residual 0.25 L\*; per-scale RMS 0.96, worst
yellow 2.55):

```
chromatic: 99.0  98.0  95.5  92.0  88.5  84.0  77.5  69.0
neutral:   99.0  98.0  95.0  92.0  89.5  86.5  83.0  76.0
```

The neutral row exists because Radix grays measure +3.0/+5.3/+6.7 L\* lighter
than the chromatic median at border jobs 6–8 (86.77/82.79/75.90) with
cross-gray spread ≤ 0.23 L\* — neutral borders are deliberately quieter than
chromatic ones, and a shared skeleton would ship too-dark neutral borders.

Params: density/contrast-of-skeleton as a future axis, not v1.
CI check: skeleton steps within ±0.5 L\* of spec values; WCAG of guaranteed
pairs stable across all 360 hues (property test, drift ≤ 2%).

## D5. Chroma ✅

Per-hue chroma curve under each hue's own gamut ceiling, peaking at the solid
jobs (measured: Radix peak chroma sits at steps 9–11 in 21/22 vivid families,
never mid-scale — the old engine's mid-peak sine envelope was structurally
wrong). No chroma floor (intake classifies instead, D7).

```
C(step) = min( vividness · Cpeak · g(step),  Cmax_sRGB(L(step), H(step)) )
g(1..12) = [0.0204, 0.0619, 0.1684, 0.2736, 0.3664, 0.4414,
            0.5202, 0.6644, 0.9844, 0.9824, 0.8897, 0.4697]
Cpeak    = 0.75 · C_cusp(H)        // measured Radix mean 0.7496
vividness default 1.0              // ~1.33 ≈ Tailwind (rides the sRGB ceiling)
```

Fit quality: reproduces Radix vivid masters at RMSE 0.0175 / max 0.073 ΔEok
(the peak-scaled model beats cusp-relative and absolute-table models).
Parametric summary: skew-Gaussian, amp 0.979, μ 10.6, σ_L 3.8, σ_R 1.15.
Known residual: yellow/amber carry up to +0.073 extra mid-scale chroma in
Radix — a warm-band multiplier may be added with D6's band table after
playground review. Muted families (bronze/gold/brown at 0.23–0.53 of
ceiling) are the evidence for the per-palette `vividness` override, not
outliers. Tailwind v4's oklch literals are largely outside sRGB (P3-target);
its solid values must not be copied into an sRGB-emitting pass.

Params: `vividness` (scales the curve), per-palette override.
CI check: no emitted value out of sRGB; ΔC between adjacent steps bounded;
generated vs Radix master ΔEok under threshold per family.

## D6. Hue policy ✅

Constant hue by default outside the bend bands; **per-band bend table keyed
to OKLCH L** (never step index — verified: drift is monotone in L across both
modes and both sides of the seed), one user axis (`hueShift`) scaling the
family default. Applied as `ΔH(L) = slope · (L_seed − L)`, clamped at the
measured endpoint; light-side (paler than seed) arm uses ~2× the dark-side
slope for warm bands (+140°/L above seed for amber) and −59°/L for blue
(pale blues go cyan).

Dark-side defaults (band boundaries on seed hue, degrees; negative = toward
gold/orange, positive = toward violet):

| Band          | Hue range  | slope (°/L) | endpoint     |
| ------------- | ---------- | ----------- | ------------ |
| orange-brown  | [40, 75)   | −13         | −4°          |
| gold-amber    | [75, 95)   | −63         | −30° @ L .35 |
| yellow-lime   | [95, 135)  | −41         | −12°         |
| blue          | [225, 262) | +20         | +7°          |
| all others    | —          | 0           | \|ΔH\| < 8°  |

Radix bends warm ramps 14–30° seed→text; Tailwind bends the same ramps
−37…−50° full-ramp — Tailwind-strength is `hueShift ≈ 1.6`, one scalar away.
Bright seeds (L₉ > 0.8, sky-like) can bend against their band (sky drifts
+25…+33° toward blue); the bend conditions on seed L, not hue alone, for
those.

Params: `hueShift` (scalar on band default), per-palette override.
CI check: yellow-band dark steps satisfy −50° ≤ ΔH ≤ +5° (measured Radix
envelope −30…+0.2; olive-ward drift never exceeds +8.5°); generated hue
drift within family tolerance.

## D7. Seed intake ✅

Seed → OKLCH at the door; gamut-map and report the cost. Classify
accent-vs-neutral at the whisper line **C 0.02** (validated by D8: every
Radix tinted gray peaks ≤ 0.0193; note Tailwind slate/gray at C 0.034–0.046
are "cool grays" beyond whisper — classification uses the seed, and a
slate-strength neutral is expressed via `neutralTint` above default, not by
reclassification). Slot nearest-by-L\* with named override. **Snap by
default; `preserveSeed: true` as an explicit switch that prints its ΔEok
price.**

Params: `preserveSeed`, explicit `slot` override.
CI check: round-trip — with `preserveSeed` the seed appears verbatim at its
slot; without it, reported ΔEok(seed, nearest step) is under the snap bound.

## D8. Neutrals ✅

Auto-tint the neutral from the accent hue at whisper chroma.

- `neutralHue` = the accent's solid-step hue, **identity rule, constant
  across all 12 steps** (Radix nearest-accent offsets ≤ 7.7°, Tailwind
  ≤ 7.1° — within hue noise at whisper chroma).
- Tint amount: `C(step) = tintPeak · shape[mode][step]`, peaking at the solid
  job (measured — tint is NOT mid-scale):

```
shape.light = [0.13, 0.19, 0.26, 0.32, 0.43, 0.46, 0.57, 0.74, 0.97, 0.93, 0.81, 0.79]
shape.dark  = [0.23, 0.22, 0.26, 0.37, 0.43, 0.51, 0.60, 0.80, 1.00, 0.93, 0.71, 0.18]
```

  Dark step-12 detints to 18% (near-white text ships almost pure); dark
  backgrounds carry ~1.8× the relative tint of light backgrounds.
- `tintPeak` default 0.016 (median of the 10 Radix family-mode maxima);
  **hard whisper ceiling C ≤ 0.020 at every step** (measured Radix max
  0.0193, mauve light step 9). `neutralTint: 0` = pure gray (legitimate:
  Radix gray and Tailwind neutral are exactly C 0).

Params: `neutralTint` (scales tintPeak; > 1 unlocks Tailwind-slate-strength
cool grays and raises the ceiling proportionally), `neutralHue` (override).
CI check: neutral C ≤ ceiling at every step; neutral passes the same D2
guarantees.

## D9. Dark mode — a second generation pass ✅

Not a transform of light. Measured from all 31 Radix dark scales:

- Dark 8-slot L\* skeleton: `6.0  8.6  13.7  18.0  22.5  27.8  35.0  45.0`
  (Radix medians, quartile-tight ≤ ~5 L\*). Dark surfaces sit 4–7× farther
  from their pole than light surfaces (steps 1–2 at L\* 5.9/8.6 vs light
  0.8/2.1 from white) — the "reversed light ramp" model is off by that much.
- Background floor is **not pure black**: default step-25 at L\* 6.0
  (≈ #111113; measured range 5.04–6.56). `darkBackground: 'oled'` opts into
  L\* 0. Assert Δ(25→50) ≥ 2.5 L\* (measured median 2.69).
- Chroma budgets, jobs 1–8, multipliers on the D5 light curve:
  `[4.2, 2.2, 2.0, 1.7, 1.4, 1.15, 1.0, 0.9]` (backgrounds carry 2–4× the
  tiny absolute chroma — light step-1 C ≈ 0.005, so 4.2× ≈ C 0.02); solids
  9–10 × 1.0.
- Text steps 11–12 get **no global multiplier** — the dark/light chroma ratio
  flips sign by hue band (yellow→cyan gains ×1.1–1.9, red→blue loses
  ×0.65–0.92); dark text chroma is re-solved per hue with the D6 band table.
- State shifts are signed per mode (verified: solid hover lightens in dark
  L\* 54.3→58.8, darkens in light 58.4→54.5); solid lightness itself is
  roughly mode-invariant (~54–58).
- Elevation policy 🟡: v1 is **step-based** — surfaces stack through the job
  ladder (app-bg → subtle-bg → ui-rest), no overlay-lightening pass. Radix
  has no elevation ramp to measure; overlay elevation can be a later axis.

Params: `darkBackground` (lightness / `'oled'`), everything else defaulted.
CI check: same D2 guarantees re-run per mode (dark step-950 solved to
Lc ≥ 90 — Radix itself misses this in 19/31 scales, min 84.23; the fix costs
~+3 L\* on the worst reds); dark-specific floor asserts (no two adjacent
surface steps render identical sRGB).

## D10. States, alpha, status ✅

- State shifts are **signed per mode** (hover darkens on light, lightens on
  dark) and expressed as ramp walks where a slot exists, computed shifts
  where not.
- **Alpha twins** per scale, Radix-style, via the exact-solve algorithm
  (verified digit-for-digit: 144/144 published Radix alpha steps reproduced
  hex-exact): overlay toward white if any target channel is lighter than the
  background channel, else toward black; `A = ceil(max_c (t−b)/(desired−b) ·
  255)/255`; channels solved as `ceil(clamp(−(b(1−A)−t)/A))` with ±1
  correction against the browser compositing model
  `round(bg·(1−a)) + round(fg·a)` at 0–255; pure-gray shortcut. Light twins
  solve over the mode's app background; dark twins over our step-25 (Radix's
  is #111111 = grayDark-1, solved empirically 72/72). CI: compositing a twin
  over its mode background reproduces the solid within ≤ 1/255 per channel,
  except channels on the wrong side of the background in the overlay
  direction, where the clamp error is inherent (Radix's own ceiling: 14/255)
  and the bar is ≤ the equivalent Radix construction's error.
- Status palettes are four mini-systems from four seeds. Locked defaults
  (identity-preserving CVD search winners): success `#6ac48c`, warning
  `#eab308` (unchanged), danger `#ef4444` (unchanged), info `#4862ff`.
  Measured: the old set bottoms out at ΔEok 0.0151 (tritan, info vs blue
  accent); the locked set reaches 0.0977 (6.5×). (The original "fails
  deutan" hypothesis was refuted in the specific — tritan info-vs-accent and
  protan success-vs-warning are the real binding pairs.)
- **CVD gate**: min pairwise ΔEok ≥ 0.09 over {4 status solids + theme
  accent solid} across normal + protan + deutan + tritan at Machado severity
  1.0, evaluated on the emitted step-700 solids (not raw seeds). The gate
  re-runs against the actual theme accent at generation time; a violation is
  a reported warning surfaced to the builder (the user's brand may
  legitimately collide with a status hue), never a silent pass.

Params: status seeds (defaulted, overridable).
CI check: alpha parity + composite bars as above; CVD gate on the default
set; solid labels per D2.

## D11. Chart palettes ✅

Generated, not aliased (measured: the current status-500 aliasing fails 4 of
5 gates — normal ΔEok 0.059, deutan 0.009, tritan 0.012, L\* range 5.6).

- **Categorical** (size 5–8): min pairwise ΔEok ≥ 0.09 normal AND ≥ 0.045
  under each of protan/deutan/tritan at severity 1.0; palette L\* range ≥ 25.
  Generation rule (not CI): order series so adjacent-in-order |ΔL\*| ≥ 8.
  (Calibration: Okabe-Ito passes everything; tab10 fails exactly its known
  protan collapse at 0.0146.)
- **Sequential**: L\* strictly monotonic; every adjacent ΔL\* ≥ 0.5 × (range
  / (n−1)) (viridis achieves 0.937–0.949 of ideal); adjacent ΔEok ≥ 0.02.
- **Diverging**: two arms each passing the sequential gate; midpoint pinned
  to the surface neutral.

All from the theme's seeds. ΔEok convention: raw OKLab Euclidean distance
(0–1 scale, JND ≈ 0.02), not ×100.

CI check: the three gates above on the default theme's generated palettes;
reference-palette calibration test (Okabe-Ito passes, tab10 fails protan).

## D12. API & emission 🟡

**Convenience bar: one seed in, a complete correct system out.** Everything
else optional with research-backed defaults.

```ts
createTheme({ seed: '#635bff' })
// → { light, dark } × { accent, neutral, success, danger, warning, info }
//   × 12 steps + on-* + alpha twins + chart palettes, all guarantees enforced
```

- Options are flat and few: `seeds` (per palette), `preserveSeed`,
  `vividness`, `hueShift`, `neutralTint`/`neutralHue`, `darkBackground`,
  status seed overrides. The brand palette is named `accent` (dotUI's term;
  no `primary` rename seam).
- Emission: `oklch()` literals, no hex fallbacks; static values only (no
  runtime color-mix/contrast-color); P3 as a guarded `@media (color-gamut:
p3)` second pass, deliberately generated (never bare wide literals).
- Pure kernel: no CSS-variable names, no semantic vocabulary (stays www-side;
  see `www/src/registry/theme/SPEC.md`).

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

- `research/` scripts + `research/data/` fixtures: the measurements that
  locked D2/D4/D5/D6/D8/D9/D10/D11 (deterministic, re-runnable).
- `@radix-ui/colors` (devDep): per-family regression bar (ΔEok per step).
- `apca-w3` (devDep): APCA parity.
- `@adobe/leonardo-contrast-colors` (devDep): contrast-solver parity.
- `/internal/colors` playground: side-by-side old/new/Radix, real component
  compositions (the warning-banner test for yellow).
