# Plan 009: Centralize on-color computation behind a theme-level `onColor` option

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/producer.ts packages/colors/src/theme.ts packages/colors/src/schema.ts packages/colors/src/shared/on-color.ts packages/colors/src/producers`
> Plans 003/005/006/007/008 are EXPECTED to have landed; what must still match are the specific excerpts below. On a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED (changes the producer contract; defaults must stay byte-identical)
- **Depends on**: plans/002-characterize-color-generation.md (snapshot gates). Land LAST among the kernel plans — it touches the same files as 003/005/008.
- **Category**: direction (approved axis) / tech-debt
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

Every producer independently calls `computeOnColors` to attach `on-*` foregrounds, with no way for a caller to configure the policy: `createTheme` accepts no on-color options, so the formula (except via the contrast arm's `formula`) and the tinted-vs-pure choice (`OnColorOptions.tinted` exists but is unreachable) are fixed. Meanwhile dotUI ships pure black/white foregrounds via the `tailwindcss-autocontrast` plugin (`onBlackWhite`), so the kernel's hue-tinted AA-verified on-colors — a headline feature (§4.3) — are computed on every generation and used only by the verify layer. Design systems genuinely disagree here (Material's tinted on-containers vs Geist/Linear's pure poles), so on-color policy is an axis.

This plan (a) makes `PaletteOutput.on` optional so producers stop hand-rolling the policy, (b) centralizes the computation in `createTheme` behind a new `onColor?: { formula?, tinted? }` option, and (c) keeps default output byte-identical. Exposing the axis in the builder (and reconciling it with the autocontrast plugin's pure-B/W shipping path) is a separate www/product decision, out of scope.

## Current state

- `packages/colors/src/producer.ts` — the contract (lines 30-42):

```ts
/** A produced palette: the ramp plus its paired on-* foregrounds, both keyed by step. */
export interface PaletteOutput {
  scale: ColorScale
  on: ColorScale
}
```

`produceValidated` (lines 69-82) parses opts and checks for an empty `scale` — it does not inspect `on`.

- Producers each end with the same call (this plan deletes these):
  - `producers/oklch.ts:79` — `return { scale, on: computeOnColors(scale) }`
  - `producers/contrast.ts:93` — `return { scale, on: computeOnColors(scale, formula) }` (note: couples on-* to the contrast formula)
  - `producers/material.ts:58` — `return { scale, on: computeOnColors(scale) }`
  - `producers/fixed.ts:27` — `return { scale, on: computeOnColors(scale) }`
- `packages/colors/src/shared/on-color.ts` — `onColor(background, formula = 'wcag2', opts: OnColorOptions = {})` already supports `{ tinted?: boolean }` (lines 41-52); `computeOnColors(scale, formula = 'wcag2')` (lines 87-96) does NOT forward options — this plan adds the parameter.
- `packages/colors/src/theme.ts` — the mode loop (lines 151-164) collects `scales[name] = out.scale; on[name] = out.on`. `ThemeMode.on` (in `shared/types.ts`) stays required — `createTheme` will always fill it.
- `packages/colors/src/schema.ts` — arms + `BaseThemeOptions`; plan 003 added `customThemeOptionsSchema` (custom-algorithm base validation) which must also carry the new field.
- Tests that touch producer `on` output directly (will need updating):
  - `engine.test.ts:220-231` — `material producer (registered) emits oklch + on-*` calls `getProducer('material').produce(...)` raw and asserts `on` keys.
  - `registry.test.ts` fake producers return `on` — still legal (provided `on` wins); plan 003's `mono-test` producer also returns `on`.
- Why defaults stay byte-identical: the centralized rule `formula = opts.onColor?.formula ?? opts.formula ?? 'wcag2'` reproduces today's behavior exactly — `formula` is only set on the contrast arm (matching contrast's coupling), every other producer used the `'wcag2'` default; `tinted` defaults to `true` inside `onColor` already.
- www is unaffected at runtime: `resolveColorConfig` reads only `theme.<mode>.scales` (the `--on-*` it emits come from `onBlackWhite`); the verify layer (`pairingsFromTheme`) reads `mode.on`, which `createTheme` still always populates.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/producer.ts`
- `packages/colors/src/theme.ts`
- `packages/colors/src/schema.ts`
- `packages/colors/src/shared/on-color.ts`
- `packages/colors/src/producers/{oklch,contrast,material,fixed}.ts` (delete the `computeOnColors` returns only)
- `packages/colors/src/engine.test.ts`, `packages/colors/src/registry.test.ts`
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/verify/**` — consumes `Theme.on`, which stays populated.
- `onBlackWhite` and anything in `www/**` — the shipped pure-B/W path and its parity test are a separate contract.
- `packages/colors/src/shared/types.ts` — `ThemeMode.on` stays required.
- Snapshot files — must not change (the entire point of the default rule).

## Git workflow

- Branch: `advisor/009-on-color-policy-option`
- Commit message style: `refactor(colors): centralize on-* behind a theme-level onColor option`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Make `on` optional in the contract

In `producer.ts`, change `PaletteOutput`:

```ts
/** A produced palette: the ramp, plus optional bespoke on-* foregrounds. When `on` is omitted, `createTheme` computes it from the theme-level on-color policy — producers only emit `on` to override that policy (e.g. a tone-paired Material variant). */
export interface PaletteOutput {
  scale: ColorScale
  on?: ColorScale
}
```

**Verify**: `pnpm typecheck` → still exits 0 (consumers handle `on` as possibly-absent only in `theme.ts`, updated in Step 3).

### Step 2: Forward options through `computeOnColors`

In `shared/on-color.ts`:

```ts
export function computeOnColors(
  scale: ColorScale,
  formula: ContrastFormula = 'wcag2',
  opts: OnColorOptions = {},
): ColorScale {
  const on: ColorScale = {}
  for (const [step, value] of Object.entries(scale)) {
    on[step] = onColor(value, formula, opts).value
  }
  return on
}
```

**Verify**: `pnpm vitest run packages/colors` → exit 0 (default parameter; no behavior change).

### Step 3: Centralize in `createTheme` and add the option

In `schema.ts`: define and export the option schema, add `onColor` to **all five arms**, to `customThemeOptionsSchema` (from plan 003), and to `BaseThemeOptions`:

```ts
/** Theme-level on-* policy: contrast formula and tinted-vs-pure poles. Defaults reproduce the historical per-producer behavior. */
const onColorSchema = z
  .object({
    formula: z.enum(['wcag2', 'apca']).optional(),
    tinted: z.boolean().optional(),
  })
  .optional()
```

(`BaseThemeOptions`: `onColor?: { formula?: 'wcag2' | 'apca'; tinted?: boolean }`.)

In `theme.ts`: import `computeOnColors` from `./shared/on-color`, and in the mode loop replace `on[name] = out.on` with:

```ts
const out = produceValidated(algorithm, paletteOpts, ctx)
scales[name] = out.scale
// Producer-provided on-* wins (bespoke pairing); otherwise apply the theme policy.
// The formula default mirrors the historical coupling: contrast's `formula` drove its on-*.
on[name] =
  out.on ??
  computeOnColors(out.scale, opts.onColor?.formula ?? opts.formula ?? 'wcag2', {
    tinted: opts.onColor?.tinted,
  })
```

In the four builtin producers, change the returns to `return { scale }` and remove the now-unused `computeOnColors` imports (and contrast's now-unused import only if `formula` is still used for solving — it is; remove just the on-call).

**Verify**: `pnpm vitest run packages/colors` → expect ONE failure only: `engine.test.ts:220-231` (the raw material-producer test asserting `on` keys). Anything else failing — especially snapshots — is a STOP condition.

### Step 4: Update the contract tests

In `engine.test.ts`, rewrite the material test to assert through the public API and pin the new contract:

```ts
describe('material producer (registered) emits oklch + on-*', () => {
  it('raw produce returns the scale; on-* is the orchestrator policy', () => {
    const steps = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const { scale, on } = getProducer('material').produce(
      { seed: '#6366f1' },
      lightCtx(steps),
    )
    expect(Object.keys(scale)).toEqual(steps)
    expect(on).toBeUndefined()
    for (const v of Object.values(scale)) expect(v).toMatch(/^oklch\(/)
  })
})
```

Add policy tests (new describe `onColor policy`, near `review regressions`):

```ts
describe('onColor policy', () => {
  it('tinted:false yields pure-pole foregrounds everywhere', () => {
    const theme = createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
      onColor: { tinted: false },
    })
    for (const mode of Object.values(theme)) {
      for (const on of Object.values(mode.on)) {
        for (const v of Object.values(on)) expect(v).toMatch(/^oklch\((0|1) 0 0\)$/)
      }
    }
  })

  it('onColor.formula switches the on-* picker (apca differs from default)', () => {
    const apca = createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
      onColor: { formula: 'apca' },
    })
    const def = createTheme({ algorithm: 'oklch', palettes: { primary: '#3b82f6' } })
    expect(apca.light!.on).not.toEqual(def.light!.on)
    expect(apca.light!.scales).toEqual(def.light!.scales) // ramps untouched
  })

  it('a producer-provided on-* wins over the policy', () => {
    // covered structurally by registry.test.ts fake producers returning `on`; assert here via the public API
    const theme = createTheme({ algorithm: 'oklch', palettes: { primary: '#3b82f6' } })
    expect(Object.keys(theme.light!.on.primary!)).toEqual(Object.keys(theme.light!.scales.primary!))
  })
})
```

(If the `apca differs` assertion is flaky because both formulas pick identical poles for this seed, switch the seed to `'#eab308'` — a mid-lightness yellow forces pole divergence; if it STILL doesn't differ, STOP and report rather than deleting the assertion.)

**Verify**: `pnpm vitest run packages/colors` → exit 0, **zero snapshot changes**.

### Step 5: Full gates

**Verify**: `pnpm test` → exit 0 (www: parity spec, primitives spec, publisher specs all green — they never read producer-level `on`). `pnpm typecheck` → exit 0. `pnpm check` → exit 0. `grep -rn "computeOnColors" packages/colors/src/producers` → no matches.

## Test plan

Step 4. Pattern: `review regressions` in `engine.test.ts`. Cases: pure-pole mode; formula switch (ramps invariant); producer-override precedence; raw-produce contract (`on` undefined); defaults byte-identical (snapshots + the existing sweep's `worstOnContrast ≥ 4.5`).

## Done criteria

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0.
- [ ] All snapshot files byte-unchanged.
- [ ] `grep -rn "computeOnColors" packages/colors/src/producers` returns nothing; `grep -n "computeOnColors" packages/colors/src/theme.ts` returns one import + one call.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any snapshot changes after Step 3 — the default rule failed to reproduce a producer's historical formula/tint choice; identify which producer/mode before touching snapshots.
- The verify suite (`verify.test.ts`) fails — `Theme.on` population broke; that contract is required.
- `worstOnContrast` in the sweep drops below 4.5 anywhere — the centralized default is not equivalent.
- Plan 003 has not landed and there is no `customThemeOptionsSchema` — proceed with the five arms + `BaseThemeOptions` only, and note in the PR that 003 must add `onColor` to its base schema when it lands.

## Maintenance notes

- The product follow-up this enables (separate decision): a builder axis "on-color style: pure black/white (current shipped behavior, via tailwindcss-autocontrast) vs hue-tinted (kernel)". Shipping tinted on-* requires reconciling with the autocontrast plugin's compile-time `--on-*` baking — see `www/src/registry/theme/on-color-parity.spec.ts` and the `onBlackWhite` doc comment in `shared/on-color.ts:98-105` before designing that.
- A future Material-faithful variant can now ship bespoke tone-paired on-* by returning `on` from the producer — that's the reason `on` stays in `PaletteOutput` instead of being deleted.
- Reviewer focus: the default-formula rule (`onColor?.formula ?? opts.formula ?? 'wcag2'`) and the byte-identical snapshot gate.
