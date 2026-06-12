# Plan 005: Make the kernel own dark-mode generation (restore contrast/material dark fidelity)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/producers/oklch.ts packages/colors/src/engine.test.ts www/src/registry/theme/primitives.ts www/src/registry/theme/primitives.spec.ts`
> Plans 001–004 are EXPECTED to have landed (they touch some of these files); what must still match are the specific excerpts below. On a mismatch in an excerpt, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED-HIGH (changes shipped dark-mode colors for two algorithms — deliberately)
- **Depends on**: docs/plans/2026-06-11-colors-audit/001-recover-color-engine-spec.md (the §4.7a decision gets recorded there), docs/plans/2026-06-11-colors-audit/002-characterize-color-generation.md (the snapshot gates this plan relies on)
- **Category**: bug / tech-debt / direction
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

dotUI's builder lets users pick a color generation algorithm: `oklch`, `tailwind`, `contrast`, or `material`. Today the www wrapper generates **light mode only** (`modes: { light: true }`) and derives dark mode by reversing each ramp's value ladder. That reversal is only correct for `oklch`/`tailwind` (whose ramps are background-independent). For `contrast` — whose entire promise is per-step contrast targets against the mode background — the dark ramp is never solved against the dark background, so the algorithm's guarantee silently doesn't hold in dark mode. For `material`, the reversed light tones differ from Material's own dark tone set (`DARK_TONES` in the kernel). The kernel already supports true per-mode generation (the `contrast` producer solves against `ctx.background`, `material` flips tone sets on `ctx.isDark`); the wrapper just bypasses it.

The root inconsistency is in the kernel: `ModeCtx.isDark` is documented as "controls ramp direction / tone set / on-* polarity" (`producer.ts:23`), but the `oklch` producer ignores it by design ("mode-agnostic, §4.7a"), which is what forced the wrapper's reversal hack in the first place. This plan makes `oklch`/`tailwind` honor `isDark` by mirroring their step parameters (producing exactly the values the wrapper's reversal produces today), then has the wrapper request both modes from the kernel and delete the reversal. Result: `oklch`/`tailwind` output is **byte-identical** to today, `contrast`/`material` dark mode becomes faithful to the algorithm, and per-mode kernel axes (e.g. `modes.dark.lightness`) stop being unreachable.

## Current state

### Kernel

- `packages/colors/src/producers/oklch.ts` — the default producer. Header (lines 1-8) declares "Background-INDEPENDENT and mode-agnostic". The produce loop (lines 53-80):

```ts
produce(opts, ctx) {
  const seed = toOklch(opts.seed)
  const n = ctx.steps.length
  const ls = applyAnchoring(
    lightnessForSteps(n),
    ctx.steps,
    seed.l,
    opts.preserveSeedAt,
  )
  // … peakC / torsionAmt / maxMode setup …
  const scale: Record<string, string> = {}
  for (let i = 0; i < n; i++) {
    const t = n <= 1 ? 0 : i / (n - 1)
    const h = torsion(seed.h, t, torsionAmt)
    const c = maxMode ? MAX_MODE_C : peakC * chromaEnvelope(i, n)
    scale[ctx.steps[i]!] = oklchCss(gamutMap({ l: ls[i]!, c, h }))
  }
  return { scale, on: computeOnColors(scale) }
}
```

- `packages/colors/src/producers/presets.ts` — `tailwind` delegates to `oklchProducer.produce`, so it inherits whatever oklch does with `ctx.isDark`.
- `packages/colors/src/producers/material.ts` (lines 22-23, 50) — already mode-aware: `opts.tones ?? (ctx.isDark ? DARK_TONES : LIGHT_TONES)`.
- `packages/colors/src/producers/contrast.ts` — already mode-aware: solves each step against `ctx.background` (the mode's background).
- `packages/colors/src/producers/fixed.ts` — identity; ignores `isDark` (stays that way — see Out of scope).
- `packages/colors/src/engine.test.ts:148-156` — the test this plan deliberately rewrites:

```ts
it('light and dark ramps are identical (mode-agnostic, §4.7a)', () => {
  const theme = createTheme({
    algorithm: 'oklch',
    palettes: { primary: '#3b82f6' },
  })
  expect(rampLs(sc(theme, 'light', 'primary'))).toEqual(
    rampLs(sc(theme, 'dark', 'primary')),
  )
})
```

### www wrapper

- `www/src/registry/theme/primitives.ts` — `resolveColorConfig`. The pieces this plan replaces:
  - Header docstring (lines 1-12) documents the reversal design ("dark mode is derived by **reversing the lightness ladder**").
  - `reverseRamp` (lines 33-42) — index-reverses a ramp's values.
  - `stretchLightness` (lines 50-66) + `NEUTRAL_L_MIN = 0.13` / `NEUTRAL_L_MAX = 0.985` (lines 69-70) — per-value smoothstep L remap applied to the neutral ramp only. **Keep this behavior, applied per mode** (see Step 3 reasoning).
  - The kernel call (lines 98-104): `createTheme({ algorithm, palettes, steps, modes: { light: true }, ...config.knobs })`.
  - Dark derivation (lines 121-123): `for (const [name, scale] of Object.entries(light)) dark[name] = reverseRamp(scale)`.
- `www/src/registry/theme/primitives.spec.ts`:
  - `describe.each(GENERATIVE_ALGORITHMS)` block: the test `derives dark as the reversed light ladder (50 ↔ 950)` (lines 134-143) asserts reversal for EVERY algorithm — this plan splits it by algorithm.
  - Plan 002 added: mode-split value snapshots per algorithm, and a characterization test `wrapper dark for 'contrast' is the reversal, NOT the kernel-native dark solve` — this plan flips it to equality.
  - The AA test (lines 152-162): every step's `onBlackWhite` foreground clears WCAG 4.5 in both modes — must still pass with the new contrast/material dark values.
- `www/src/registry/theme/palettes.ts` — `fromKernelPaletteName` (primary→accent rename) used when building each mode's ramps.
- Generated output: `www/src/registry/base/colors.css` is emitted from `DEFAULT_COLOR_CONFIG` (algorithm `oklch`) by `pnpm build:registry`. Because oklch output is byte-identical after this plan, **this file must not change** — that's the strongest gate.

### Why oklch-mirroring is byte-identical to the current reversal (the executor should understand this, not re-derive it)

Mirroring index `i → n-1-i` for all per-step parameters (lightness, chroma-envelope position, torsion `t`) produces exactly the light ramp's values assigned in reverse step order — the same thing `reverseRamp` does to the final values. For the stretched neutral: stretching is a per-value lightness remap whose `lo`/`hi` come from the ramp's value set, and mirroring doesn't change the value set, so stretch-then-reverse (today) equals mirror-then-stretch (new), value for value.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| www theme tests | `pnpm vitest run www/src/registry/theme` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Update specific snapshots | `pnpm vitest run <file> -u` | snapshots rewritten — diff-review them |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |
| Registry regen | `pnpm build:registry` | exit 0 |
| Regen gate | `git diff --exit-code www/src/registry/base/colors.css www/src/registry/__generated__` | exit 0 (NO diff) |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/producers/oklch.ts`
- `packages/colors/src/engine.test.ts` + `packages/colors/src/__snapshots__/engine.test.ts.snap`
- `www/src/registry/theme/primitives.ts`
- `www/src/registry/theme/primitives.spec.ts` + `www/src/registry/theme/__snapshots__/primitives.spec.ts.snap`
- `docs/research/2026-06-11-color-engine-spec.md` (append the §4.7a decision line)
- `docs/plans/2026-06-11-colors-audit/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/producers/{contrast,material,fixed,presets}.ts` — contrast/material are already mode-aware; `fixed` stays mode-agnostic (per-mode fixed ramps are a separate, undesigned feature); `tailwind` inherits from oklch automatically.
- `packages/colors/src/theme.ts` and `schema.ts` — the orchestrator already supports modes; nothing changes there.
- `stretchLightness` semantics, `NEUTRAL_L_MIN/MAX` values — the neutral surface span is a separate axis discussion; this plan keeps the stretch exactly as-is, applied to each mode's neutral ramp.
- `www/src/registry/theme/semantics.ts`, `emit-css.ts`, anything in `www/src/modules/` or `www/src/publisher/`.

## Git workflow

- Branch: `advisor/005-kernel-owned-dark-mode`
- Commits per logical unit, e.g. `feat(colors): oklch producer mirrors the ramp in dark modes` then `refactor(theme): resolve dark mode through the kernel`
- Run `pnpm check:fix` before each commit. After www registry-affecting changes, run `pnpm build:registry` and commit any regenerated files **together with** the change (CLAUDE.md rule) — though this plan's gate is that there are none. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Mirror the oklch ramp in dark modes (kernel)

In `oklch.ts`'s produce loop, derive a mirrored index when `ctx.isDark` and use it for every per-step parameter:

```ts
const scale: Record<string, string> = {}
for (let i = 0; i < n; i++) {
  // Dark modes mirror the ladder (step 50 takes the dark end) so per-mode output is
  // directly emittable under shared step names — same values as light, reversed.
  const k = ctx.isDark ? n - 1 - i : i
  const t = n <= 1 ? 0 : k / (n - 1)
  const h = torsion(seed.h, t, torsionAmt)
  const c = maxMode ? MAX_MODE_C : peakC * chromaEnvelope(k, n)
  scale[ctx.steps[i]!] = oklchCss(gamutMap({ l: ls[k]!, c, h }))
}
```

Update the header docstring (lines 1-8): the ramp's *values* remain background-independent and mode-agnostic; dark modes assign them mirrored (replaces the consumer-side reversal). Note `preserveSeedAt` consequence in the docstring: the pinned lightness lands at the mirrored step in dark modes (identical to the old consumer reversal's behavior).

In `engine.test.ts`, rewrite the `light and dark ramps are identical (mode-agnostic, §4.7a)` test (lines 148-156) to assert mirroring:

```ts
it('dark is the mirrored light ramp (same values, reversed ladder)', () => {
  const theme = createTheme({
    algorithm: 'oklch',
    palettes: { primary: '#3b82f6' },
  })
  expect(rampLs(sc(theme, 'dark', 'primary'))).toEqual(
    [...rampLs(sc(theme, 'light', 'primary'))].reverse(),
  )
})
```

Then update kernel snapshots: `pnpm vitest run packages/colors/src/engine.test.ts -u`.

**Verify**: `pnpm vitest run packages/colors` → exit 0. Then inspect `git diff packages/colors/src/__snapshots__/engine.test.ts.snap` and confirm this exact matrix: `oklch` snapshot — **dark half changed, light half unchanged**; `tailwind` dark snapshot changed (light unchanged); `material` and `contrast` snapshots **completely unchanged** (they were already mode-aware). Any deviation from this matrix is a STOP condition.

### Step 2: Request both modes from the kernel and delete the reversal (www)

In `primitives.ts`:

1. Change the kernel call to `modes: { light: true, dark: true }`.
2. Delete `reverseRamp` entirely.
3. Build both modes the same way — extract the current rename+stretch loop into a helper and apply it per mode:

```ts
const theme = createTheme({ algorithm, palettes, steps, modes: { light: true, dark: true }, ...config.knobs })
const lightMode = theme.light
const darkMode = theme.dark
if (!lightMode || !darkMode) throw new Error('resolveColorConfig: kernel did not produce both modes')

const resolveMode = (mode: { scales: Record<string, Ramp> }): Record<string, Ramp> => {
  const out: Record<string, Ramp> = {}
  for (const [name, scale] of Object.entries(mode.scales)) {
    const key = fromKernelPaletteName(name)
    out[key] = key === 'neutral' ? stretchLightness(scale, NEUTRAL_L_MIN, NEUTRAL_L_MAX) : scale
  }
  return out
}
const light = resolveMode(lightMode)
const dark = resolveMode(darkMode)
return { steps: Object.keys(light.neutral ?? {}), light, dark }
```

4. Rewrite the header docstring (lines 1-12): the kernel now generates each mode (`oklch`/`tailwind` mirror the ladder; `contrast` solves against each mode's background; `material` uses Material's per-mode tone sets); the wrapper renames `primary`→`accent` and stretches the neutral span per mode. Keep the existing note about `--on-*` coming from the autocontrast plugin.

**Verify**: `pnpm vitest run www/src/registry/theme/primitives.spec.ts` → expect failures ONLY in: the `describe.each` reversal test for `contrast`/`material`, the contrast/material **dark** snapshots, and plan 002's inequality characterization test. If anything else fails — especially any **light** snapshot or any `oklch`/`tailwind` snapshot — STOP.

### Step 3: Update the www spec to the new contract

In `primitives.spec.ts`:

1. Replace the per-algorithm reversal test (`derives dark as the reversed light ladder (50 ↔ 950)`, lines 134-143) with a split assertion inside the same `describe.each`:

```ts
it('dark mode comes from the kernel (mirrored for oklch/tailwind, native for contrast/material)', () => {
  if (algorithm === 'oklch' || algorithm === 'tailwind') {
    for (const palette of PALETTES) {
      expect(resolved.dark[palette]?.['50']).toBe(resolved.light[palette]?.['950'])
      expect(resolved.dark[palette]?.['950']).toBe(resolved.light[palette]?.['50'])
    }
  } else {
    // contrast/material: dark is generated against the dark mode, not reversed —
    // endpoints must NOT be the light ramp's mirrored endpoints.
    expect(resolved.dark.accent?.['50']).not.toBe(resolved.light.accent?.['950'])
  }
})
```

2. Replace plan 002's characterization test (`wrapper dark for 'contrast' is the reversal, NOT the kernel-native dark solve`) with the fixed-contract equality: wrapper dark for `contrast` equals the kernel-native dark (renamed, neutral-stretched). Concretely: build `native = createTheme({ algorithm: 'contrast', palettes: { primary: seeds.accent, neutral: seeds.neutral, success: true, warning: true, danger: true, info: true }, modes: { light: true, dark: true } }).dark`, then assert `resolved.dark.accent` deep-equals `native.scales.primary` and `resolved.dark.success` deep-equals `native.scales.success` (the neutral differs by stretch — skip it or compare post-stretch by calling nothing else; keeping to non-neutral palettes is sufficient and simpler).
3. Update the contrast/material **dark** snapshots: `pnpm vitest run www/src/registry/theme/primitives.spec.ts -u`, then inspect `git diff www/src/registry/theme/__snapshots__/primitives.spec.ts.snap`: **only** `contrast`/`material` `dark` snapshot bodies changed; all `light` snapshots and the `oklch`/`tailwind` `dark` snapshots byte-identical.

**Verify**: `pnpm vitest run www/src/registry/theme` → exit 0, including the AA foreground test (lines 152-162) over the new dark values.

### Step 4: The byte-identical gate for shipped output

Run `pnpm build:registry`, then:

**Verify**: `git diff --exit-code www/src/registry/base/colors.css www/src/registry/__generated__` → exit 0 (zero diff — the default config is `oklch`, whose output is unchanged). If there IS a diff, the mirroring is not value-equal to the old reversal: STOP.

### Step 5: Record the decision

Append to the §4.7a section of `docs/research/2026-06-11-color-engine-spec.md` (created by plan 001):

```
> Decision (2026-06-11): superseded — producers now own mode polarity. oklch/tailwind mirror the ladder when `isDark`; the www wrapper requests both modes and no longer reverses. See docs/plans/2026-06-11-colors-audit/005-kernel-owned-dark-mode.md.
```

**Verify**: `grep -n "Decision (2026-06-11): superseded" docs/research/2026-06-11-color-engine-spec.md` → one match.

### Step 6: Full gates

**Verify**: `pnpm test` → exit 0. `pnpm typecheck` → exit 0. `pnpm check` → exit 0. `grep -rn "reverseRamp" www/src packages/colors/src` → no matches.

## Test plan

Steps 1 and 3 carry the test changes; plan 002's snapshots are the safety net. Net-new assertions: kernel mirroring test; per-algorithm dark-contract split test; wrapper≡kernel-native equality for `contrast`. Pattern files: the existing `describe.each` in `primitives.spec.ts` and `review regressions` in `engine.test.ts`.

## Done criteria

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0.
- [ ] `git diff --exit-code www/src/registry/base/colors.css www/src/registry/__generated__` exits 0 after `pnpm build:registry`.
- [ ] Snapshot diff matrix holds exactly: kernel oklch+tailwind dark changed / kernel contrast+material unchanged / www contrast+material dark changed / www oklch+tailwind dark unchanged / ALL light snapshots unchanged everywhere.
- [ ] `grep -rn "reverseRamp" www/src packages/colors/src` returns nothing.
- [ ] §4.7a decision line appended to the spec doc.
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Plan 001 or 002 has not landed (no spec doc to append to, or no mode-split snapshots to gate with) — report; do not inline their work.
- The Step 1 or Step 3 snapshot diff deviates from the stated matrix in ANY cell — the mirroring equivalence argument failed somewhere; report the deviating snapshot rather than updating it.
- Step 4's registry diff is non-empty.
- The www AA test (`every step's auto-foreground clears WCAG AA in both modes`) fails for the new `contrast` or `material` dark values — whether to relax that assertion or adjust default ratios/tones is a product decision; report the failing steps and their ratios.
- `resolveColorConfig` consumers outside the in-scope files turn out to depend on `dark[step] === light[mirroredStep]` (grep `resolveColorConfig` across `www/src` and check `emit-theme.ts` / `emit-bundle-css.ts` / `styles.tsx` usage if anything fails downstream).

## Maintenance notes

- This unlocks the kernel's per-mode axes for the builder: `modes.dark.lightness` (dark background level), per-mode palette seed overrides, and future high-contrast modes can now flow through `resolveColorConfig` — exposing them is www/builder work, deliberately not part of this plan.
- The neutral `stretchLightness` still overrides per-step lightness AFTER generation, which means the `contrast` algorithm's targets don't strictly hold for the **neutral** ramp in either mode (pre-existing, unchanged). If contrast-faithful neutrals become a requirement, the stretch span should become a kernel knob instead — see plan 006's `backgroundChroma`/`neutralChroma` precedent for how to add such an axis.
- Generation now runs per mode (2× producer calls per palette). It's single-digit milliseconds per theme; if the live preview ever feels it, memoize at `resolveColorConfig`'s callers, don't regress to reversal.
- Reviewer focus: the snapshot diff matrix (it encodes the entire correctness argument) and the rewritten `primitives.ts` docstring.
