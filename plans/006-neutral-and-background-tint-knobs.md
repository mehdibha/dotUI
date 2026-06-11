# Plan 006: Add `neutralChroma` and `backgroundChroma` knobs (tinted neutrals axis)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/producers/oklch.ts packages/colors/src/producers/contrast.ts packages/colors/src/shared/constants.ts packages/colors/src/schema.ts packages/colors/src/theme.ts`
> Plans 003/005 are EXPECTED to have landed (they touch `schema.ts`/`oklch.ts`); what must still match are the specific excerpts below. On a mismatch in an excerpt, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S-M
- **Risk**: LOW (purely additive; defaults reproduce today's output exactly)
- **Depends on**: recommended after plans/003 and plans/005 (same files; avoids rebase churn). No logical dependency.
- **Category**: direction (approved axis)
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

dotUI's product goal is that every visual decision two design systems could disagree on is a user-configurable axis. Two such decisions are currently hardcoded in the color kernel:

1. **Neutral tint strength.** The neutral palette's chroma is capped at `0.012` — a magic number duplicated in two producers. Radix-style tinted neutrals (sage, olive, slate), warm paper-like greys, and Material's neutral-variant all need more tint than that cap allows; today no input can produce them.
2. **Background tint strength.** Each mode's background (derived from the neutral seed, fed to contrast-targeting producers) caps its chroma at `0.01`. Cream/warm backgrounds or strongly-tinted dark backgrounds (Linear-style) can't be expressed.

This plan adds two optional kernel knobs — `neutralChroma` and `backgroundChroma` — with semantics "use this chroma when set; keep today's capped derivation when absent", so all existing output is byte-identical by default. Exposing them in the builder UI is a separate www-side change, deliberately out of scope here.

## Current state

- `packages/colors/src/producers/oklch.ts` — the neutral cap (line 35 and its use at lines 62-68):

```ts
const NEUTRAL_MAX_C = 0.012
// …
const neutral = opts.neutral ?? false
const peakC = neutral
  ? Math.min(seed.c, NEUTRAL_MAX_C)
  : Math.max(
      seed.c * (opts.chromaMult ?? 1),
      opts.minChroma ?? DEFAULT_MIN_PEAK_C,
    )
```

Its schema `oklchOptsSchema` (lines 18-32) declares the per-palette knobs (`chromaMult`, `minChroma`, `neutral`, `hueTorsion`, `chromaMode`, `preserveSeedAt`).

- `packages/colors/src/producers/contrast.ts` — the duplicated cap (lines 79-82):

```ts
const baseChroma = opts.neutral
  ? Math.min(seed.c, 0.012)
  : seed.c * (opts.chroma ?? 1)
```

Its schema `contrastOptsSchema` (lines 30-37).

- `packages/colors/src/theme.ts` — the background cap in `deriveBackground` (lines 84-91):

```ts
function deriveBackground(
  neutralSeed: string | undefined,
  bgLightness: number,
): string {
  if (!neutralSeed) return oklchCss({ l: bgLightness, c: 0, h: 0 })
  const { c, h } = toOklch(neutralSeed)
  return oklchCss(gamutMap({ l: bgLightness, c: Math.min(c, 0.01), h }))
}
```

Called from `createTheme`'s mode loop (line ~145-149: `background: deriveBackground(neutralSeed, resolved.bgLightness)`). `buildPaletteOpts` (lines 94-113) forwards `...opts` to every producer, so a new top-level knob reaches producer schemas without orchestrator edits.

- `packages/colors/src/schema.ts` — the builtin arms. `oklchArm` (lines 35-45) lists the oklch/tailwind knobs; `contrastArm` (lines 49-57); knobs appear in BOTH the arm (top-level typing/validation) and the producer schema (per-palette validation) — that duplication is the established pattern. `BaseThemeOptions` (lines 92-109) mirrors every knob as an optional field, grouped by producer with comments.
- `packages/colors/src/shared/constants.ts` — home for shared defaults (`SCALE_STEPS`, `SEMANTIC_COLORS`, `DEFAULT_MODES`).
- `packages/colors/src/producers/material.ts` — uses HCT chroma units (`NEUTRAL_CHROMA = 6`), a different scale; deliberately NOT covered by this plan.
- Tests: `engine.test.ts:170-181` pins the current neutral behavior (`neutral palette is near-grey; … c < 0.02`); the snapshot suite (plus plan 002's additions) pins default values.
- www: `ColorKnobs` in `www/src/registry/theme/color-config.ts` is the wrapper's knob list — explicitly OUT of scope (UI exposure is a follow-up).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/shared/constants.ts`
- `packages/colors/src/producers/oklch.ts`
- `packages/colors/src/producers/contrast.ts`
- `packages/colors/src/schema.ts`
- `packages/colors/src/theme.ts`
- `packages/colors/src/engine.test.ts`
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/producers/material.ts` — HCT chroma is a different unit; mapping `neutralChroma` onto it is a separate decision.
- All `www/**` files, including `ColorKnobs` — UI exposure is a follow-up, not this plan.
- Snapshot files — they must NOT change (defaults reproduce today's output). If vitest reports a snapshot mismatch, you changed a default: STOP.

## Git workflow

- Branch: `advisor/006-neutral-background-tint-knobs`
- Commit message style: `feat(colors): neutralChroma + backgroundChroma knobs`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Share the constants

In `shared/constants.ts`, add (with a short doc comment each, matching the file's style):

```ts
/** Default neutral-palette chroma cap (near-grey backbone). Override per theme via `neutralChroma`. */
export const NEUTRAL_MAX_CHROMA = 0.012
/** Default chroma cap for the derived mode background. Override per theme via `backgroundChroma`. */
export const BACKGROUND_MAX_CHROMA = 0.01
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: `neutralChroma` in the oklch producer

In `oklch.ts`: delete the local `NEUTRAL_MAX_C`, import `NEUTRAL_MAX_CHROMA` from `../shared/constants`, add to `oklchOptsSchema`:

```ts
/** Neutral-palette peak chroma (tinted neutrals). Default: the seed's chroma capped near-grey. */
neutralChroma: z.number().min(0).optional(),
```

and change the neutral branch of `peakC`:

```ts
const peakC = neutral
  ? (opts.neutralChroma ?? Math.min(seed.c, NEUTRAL_MAX_CHROMA))
  : Math.max(/* unchanged */)
```

Semantics: when set, `neutralChroma` is the neutral ramp's peak chroma directly (the chroma envelope still tapers it per step; hue still comes from the seed); when absent, behavior is exactly today's.

**Verify**: `pnpm vitest run packages/colors` → exit 0, zero snapshot changes.

### Step 3: `neutralChroma` in the contrast producer

In `contrast.ts`: import `NEUTRAL_MAX_CHROMA`, add the same `neutralChroma` field to `contrastOptsSchema` (same doc comment), and change:

```ts
const baseChroma = opts.neutral
  ? (opts.neutralChroma ?? Math.min(seed.c, NEUTRAL_MAX_CHROMA))
  : seed.c * (opts.chroma ?? 1)
```

**Verify**: `pnpm vitest run packages/colors` → exit 0, zero snapshot changes.

### Step 4: `backgroundChroma` in the orchestrator

In `theme.ts`: import `BACKGROUND_MAX_CHROMA` from `./shared/constants`, thread the knob into `deriveBackground`:

```ts
function deriveBackground(
  neutralSeed: string | undefined,
  bgLightness: number,
  backgroundChroma?: number,
): string {
  if (!neutralSeed) return oklchCss({ l: bgLightness, c: backgroundChroma ?? 0, h: 0 })
  const { c, h } = toOklch(neutralSeed)
  return oklchCss(
    gamutMap({ l: bgLightness, c: backgroundChroma ?? Math.min(c, BACKGROUND_MAX_CHROMA), h }),
  )
}
```

and pass `opts.backgroundChroma` at the call site in the mode loop. (Note the no-seed branch uses hue 0 with the requested chroma — acceptable: without a neutral seed there is no hue to tint toward; document with a one-line comment.)

**Verify**: `pnpm vitest run packages/colors` → exit 0, zero snapshot changes.

### Step 5: Schema arms + BaseThemeOptions

In `schema.ts`:

- Add `neutralChroma: z.number().min(0).optional()` to `oklchArm` (tailwind inherits via `.extend`) and `contrastArm`.
- Add `backgroundChroma: z.number().min(0).optional()` to `oklchArm`, `contrastArm`, and `materialArm` (the background is orchestrator-level; material themes may pair with a custom contrast-producing palette later — and it costs nothing). Do NOT add either to `fixedArm` (no seeds, no derivation).
- Add both to `BaseThemeOptions` with the same grouping-comment style as the existing knobs (e.g. under a `// oklch / tailwind / contrast` comment for `neutralChroma`, and a `// orchestrator` comment for `backgroundChroma`).

**Verify**: `pnpm typecheck` → exit 0; `pnpm vitest run packages/colors` → exit 0.

### Step 6: Tests

In `engine.test.ts`, next to the existing neutral test (`neutral palette is near-grey; minChroma floors a muted seed's accent`, lines 170-181), add:

```ts
it('neutralChroma lifts the neutral tint above the near-grey cap (tinted neutrals)', () => {
  const tinted = createTheme({
    algorithm: 'oklch',
    palettes: { primary: '#84cc16', neutral: '#84cc16' },
    neutralChroma: 0.04,
  })
  const plain = createTheme({
    algorithm: 'oklch',
    palettes: { primary: '#84cc16', neutral: '#84cc16' },
  })
  expect(toOklch(val(sc(tinted, 'light', 'neutral'), '500')).c).toBeGreaterThan(0.025)
  expect(toOklch(val(sc(plain, 'light', 'neutral'), '500')).c).toBeLessThan(0.02)
})

it('backgroundChroma tints the background the contrast producer solves against', () => {
  const base = { algorithm: 'contrast', palettes: { primary: '#3b82f6', neutral: '#84cc16' } } as const
  const tinted = createTheme({ ...base, backgroundChroma: 0.05 })
  const plain = createTheme(base)
  // a different background changes the solved ramp
  expect(tinted).not.toEqual(plain)
})

it('neutralChroma applies to the contrast producer too', () => {
  const tinted = createTheme({
    algorithm: 'contrast',
    palettes: { primary: '#3b82f6', neutral: '#84cc16' },
    neutralChroma: 0.04,
  })
  expect(toOklch(val(sc(tinted, 'light', 'neutral'), '500')).c).toBeGreaterThan(0.02)
})
```

**Verify**: `pnpm vitest run packages/colors/src/engine.test.ts` → exit 0, 3 new tests pass.

### Step 7: Full gates

**Verify**: `pnpm test` → exit 0 (www untouched and unaffected — knobs are absent in all www configs). `pnpm check` → exit 0. `git status --porcelain packages/colors/src/__snapshots__ www/src/registry/theme/__snapshots__` → empty.

## Test plan

Step 6. Pattern: `engine.test.ts:170-181`. Cases: neutralChroma > cap on oklch; neutralChroma on contrast; backgroundChroma observable through the contrast producer; defaults unchanged (snapshots).

## Done criteria

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0; 3 new tests pass.
- [ ] `grep -rn 'NEUTRAL_MAX_C\b' packages/colors/src` and `grep -rn '0\.012' packages/colors/src/producers` return no matches (the magic numbers are centralized).
- [ ] All snapshot files byte-unchanged.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any snapshot changes — a default shifted; find it instead of updating the snapshot.
- The excerpts above don't match the live code in a way that changes the edit (e.g. plan 005 restructured the oklch loop differently than its plan specified).
- You're tempted to map `neutralChroma` into the material producer's HCT chroma — that conversion (OKLCH chroma → HCT chroma) is not defined here; report it as a follow-up instead.

## Maintenance notes

- The www follow-up (separate change, requires product sign-off on UI placement): add both knobs to `ColorKnobs` in `www/src/registry/theme/color-config.ts` and sliders in `www/src/modules/create/color-knobs.tsx`, following the existing `minChroma` slider pattern.
- If plan 009 (on-color option) lands later, tinted neutrals raise the odds of mid-tone on-color valleys — the AA assertions in `verify.test.ts` are the canary.
- Reviewer focus: default-path byte-identity (snapshots) and the value-when-set semantics being documented on both schema fields.
