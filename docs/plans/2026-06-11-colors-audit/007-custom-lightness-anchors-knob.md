# Plan 007: Add a `lightness` anchors knob to the oklch/tailwind producers

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/producers/oklch.ts packages/colors/src/schema.ts packages/colors/src/shared/curve.ts packages/colors/src/engine.test.ts`
> Plans 003/005/006 are EXPECTED to have landed (they touch `oklch.ts`/`schema.ts`); what must still match are the specific excerpts below. On a mismatch in an excerpt, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (additive; default path byte-identical)
- **Depends on**: recommended after docs/plans/2026-06-11-colors-audit/005 and docs/plans/2026-06-11-colors-audit/006 (same `oklch.ts` lines). No logical dependency.
- **Category**: direction (approved axis)
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

The oklch producer's per-step lightness comes from one fixed array — the Evil Martians perceptual anchors (`L_ANCHORS`, light end compressed, mid→dark wider). That curve shape is a design opinion two design systems disagree on: a Geist-like system wants a flatter ramp, others want different end compression. Today the only escape is `preserveSeedAt` (pins a single step) or switching algorithms entirely. This plan adds an optional `lightness` knob — an array of decreasing anchor values resampled to the scale's step count — so the curve itself becomes a user-configurable axis, with the EM anchors remaining the default.

## Current state

- `packages/colors/src/shared/curve.ts` — the anchors and resampler:

```ts
// curve.ts:10-13
export const L_ANCHORS = [
  0.9778, 0.9356, 0.8811, 0.8267, 0.7422, 0.6478, 0.5733, 0.4689, 0.3944, 0.32,
  0.2378,
] as const
// curve.ts:16 — resample(anchors, n): linear resample to n points (handles any n ≥ 1)
// curve.ts:32-34 — lightnessForSteps(n) = resample(L_ANCHORS, n)
```

- `packages/colors/src/producers/oklch.ts` — where the curve is consumed (lines 53-61 at plan time; plan 005 may have introduced a mirrored index `k` in the loop below this — that does not affect this edit):

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
```

`oklchOptsSchema` (lines 18-32) is the producer's per-palette schema; the `tailwind` preset (`producers/presets.ts`) reuses it (`schema: oklchProducer.schema`), so it inherits the knob automatically.

- `packages/colors/src/schema.ts` — `oklchArm` declares the oklch/tailwind knobs at the top level (`tailwindArm = oklchArm.extend(...)`), and `BaseThemeOptions` mirrors them. The established pattern: a knob lives in BOTH the arm and the producer schema.
- `packages/colors/src/shared/seed-anchor.ts` — `applyAnchoring` rescales each half of whatever array it's given around the pinned step; it works on any strictly-decreasing array, so `preserveSeedAt` composes with custom anchors for free (after plan 004 it throws on unknown step names).
- Tests: `engine.test.ts` — `configurable scale shape: arbitrary step count + naming` (lines 183-204) is the structural pattern for knob tests; the snapshot suite pins defaults.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/producers/oklch.ts`
- `packages/colors/src/schema.ts`
- `packages/colors/src/engine.test.ts`
- `docs/plans/2026-06-11-colors-audit/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/shared/curve.ts` — `L_ANCHORS` stays the default; `resample` is already general.
- The `contrast` producer (its lightness comes from solving, not a curve) and the `material` producer (tones are its curve — it already has the `tones` knob).
- All `www/**` files (UI exposure is a follow-up).
- Snapshot files — must not change.

## Git workflow

- Branch: `advisor/007-lightness-anchors-knob`
- Commit message style: `feat(colors): custom lightness anchors knob for oklch/tailwind`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add the knob to the producer schema and use it

In `oklch.ts`, add to `oklchOptsSchema` (matching the existing fields' doc-comment style):

```ts
/** Custom lightness anchors (strictly decreasing, light → dark), resampled to the step count. Default: the perceptual EM anchors. */
lightness: z
  .array(z.number().min(0).max(1))
  .min(2)
  .refine((a) => a.every((v, i) => i === 0 || v < a[i - 1]!), {
    message: 'lightness anchors must be strictly decreasing (light → dark)',
  })
  .optional(),
```

In `produce`, import `resample` from `../shared/curve` (alongside the existing `chromaEnvelope, lightnessForSteps` import) and swap the base array:

```ts
const ls = applyAnchoring(
  opts.lightness ? resample(opts.lightness, n) : lightnessForSteps(n),
  ctx.steps,
  seed.l,
  opts.preserveSeedAt,
)
```

**Verify**: `pnpm vitest run packages/colors` → exit 0, zero snapshot changes.

### Step 2: Mirror it at the top level

In `schema.ts`, add the same `lightness` field (same validators, same doc comment) to `oklchArm` (tailwind inherits via `.extend`), and add `lightness?: number[]` to `BaseThemeOptions` under the `// oklch / tailwind` comment group.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Tests

In `engine.test.ts`, add to the `oklch producer (default) specifics` describe:

```ts
it('custom lightness anchors reshape the ramp (resampled to the step count)', () => {
  const flat = createTheme({
    algorithm: 'oklch',
    palettes: { primary: '#3b82f6' },
    lightness: [0.9, 0.5, 0.2],
  })
  const ramp = sc(flat, 'light', 'primary')
  const ls = Object.values(ramp).map((v) => toOklch(v).l)
  expect(ls[0]!).toBeCloseTo(0.9, 1)
  expect(ls.at(-1)!).toBeCloseTo(0.2, 1)
  expect(isMonotonic(ls)).toBe(true)
  // and it actually differs from the default curve
  const def = createTheme({ algorithm: 'oklch', palettes: { primary: '#3b82f6' } })
  expect(ramp).not.toEqual(sc(def, 'light', 'primary'))
})

it('non-decreasing lightness anchors are rejected', () => {
  expect(() =>
    createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
      lightness: [0.2, 0.5, 0.9],
    }),
  ).toThrow(/strictly decreasing/)
})
```

Note: gamut-mapping can nudge L slightly for high-chroma steps — `toBeCloseTo(…, 1)` absorbs that; do not tighten the precision.

**Verify**: `pnpm vitest run packages/colors/src/engine.test.ts` → exit 0, 2 new tests pass.

### Step 4: Full gates

**Verify**: `pnpm test` → exit 0. `pnpm check` → exit 0. `git status --porcelain packages/colors/src/__snapshots__ www/src/registry/theme/__snapshots__` → empty.

## Test plan

Step 3. Pattern: `engine.test.ts:183-204`. Cases: custom anchors reshape + resample; rejection of non-decreasing input; defaults unchanged (snapshots); composition with `preserveSeedAt` is covered transitively by `applyAnchoring`'s existing tests.

## Done criteria

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0; 2 new tests pass.
- [ ] All snapshot files byte-unchanged.
- [ ] `grep -n "lightness" packages/colors/src/schema.ts` shows the field on `oklchArm` and in `BaseThemeOptions`.
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any snapshot changes (default path drifted).
- The `oklch.ts` produce body no longer matches the excerpt shape (e.g. plan 005's mirroring restructured `ls` handling beyond adding an index) — reconcile the excerpt first, and if the `applyAnchoring(...)` call site is gone, STOP.
- The zod `.refine` message doesn't surface through `createTheme` for the top-level arm (discriminated-union error wrapping) — if the Step 3 rejection test can't match `/strictly decreasing/`, loosen the assertion to `.toThrow()` and note it, don't restructure the schema.

## Maintenance notes

- www follow-up (separate, product-gated): expose as an "advanced" curve editor in `www/src/modules/create/color-knobs.tsx`; the codec must round-trip the array (see how `ratios`/`tones` are declared in `ColorKnobs`).
- If a future plan adds named curve presets ("EM", "flat", "high-key"), they belong as data (arrays) over this knob — not as new producers.
