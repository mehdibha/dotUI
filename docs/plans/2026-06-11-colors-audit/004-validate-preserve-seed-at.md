# Plan 004: Make an unknown `preserveSeedAt` step a loud error, not a silent no-op

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/shared/seed-anchor.ts packages/colors/src/shared/shared.test.ts packages/colors/src/engine.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

`preserveSeedAt` is the knob that pins a brand color's exact lightness at a named scale step (e.g. `'500'`). If the supplied step name doesn't exist in the scale — a typo, or a value that's valid for the default `50…950` scale combined with custom `steps` that don't contain it — the anchoring silently does nothing and the user gets a ramp that ignores their brand color with no signal anywhere. The kernel's stated style is loud failures (cf. `produceValidated` throwing on empty scales, `createTheme` throwing on undeclared palette overrides); this is the one knob that fails silent.

## Current state

- `packages/colors/src/shared/seed-anchor.ts` — `applyAnchoring(ls, steps, seedL, preserveSeedAt?)`. The silent path (lines 20-22):

```ts
if (!preserveSeedAt) return ls // default: array-driven, discard seed L
const idx = steps.indexOf(preserveSeedAt)
if (idx < 0 || ls.length < 2) return ls
```

- The only caller is the oklch producer: `packages/colors/src/producers/oklch.ts:56-61` calls `applyAnchoring(lightnessForSteps(n), ctx.steps, seed.l, opts.preserveSeedAt)` (the `tailwind` preset delegates to oklch, so it inherits the behavior).
- Error-message style to match (from `theme.ts:139-141`): includes the offending value and the valid options, e.g. `` `mode "${modeName}": palette override "${key}" is not a declared palette (have: ${[...baseInputs.keys()].join(', ')}).` ``
- Existing tests: `packages/colors/src/shared/shared.test.ts:58-71` (`shared/seed-anchor` describe — default no-op and happy-path pinning) and `packages/colors/src/engine.test.ts:303+` (`review regressions` describe — the home for createTheme-level regression tests).
- www exposure: the builder UI sets `preserveSeedAt` from a select of the fixed default step names and never exposes custom `steps`, so no live config can hit the new throw (verified at plan time: `www/src/registry/theme/color-config.ts` documents the knob; the customizer offers only valid step names).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/shared/seed-anchor.ts`
- `packages/colors/src/shared/shared.test.ts`
- `packages/colors/src/engine.test.ts`
- `docs/plans/2026-06-11-colors-audit/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/producers/oklch.ts` — the validation lives in `applyAnchoring` (single source), not duplicated in the producer.
- `packages/colors/src/schema.ts` — zod can't cross-validate `preserveSeedAt` against `steps` cheaply; don't try.
- Any `www/**` file.

## Git workflow

- Branch: `advisor/004-validate-preserve-seed-at`
- Commit message style: `fix(colors): throw on unknown preserveSeedAt step`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Throw on the unknown step

In `seed-anchor.ts`, split the combined guard so only the length check stays silent:

```ts
if (!preserveSeedAt) return ls // default: array-driven, discard seed L
const idx = steps.indexOf(preserveSeedAt)
if (idx < 0) {
  throw new Error(
    `preserveSeedAt "${preserveSeedAt}" is not one of the scale steps (have: ${steps.join(', ')}).`,
  )
}
if (ls.length < 2) return ls
```

Also update the function's doc comment line (`Return a lightness array adjusted so seedL lands at preserveSeedAt (or unchanged by default).`) to mention it throws on an unknown step.

**Verify**: `pnpm vitest run packages/colors` → the two existing seed-anchor tests still pass (they use valid/absent step names); no other failures.

### Step 2: Unit test the throw

In `shared.test.ts`, inside `describe('shared/seed-anchor', …)`, add:

```ts
it('throws on a step name that is not in the scale (no silent no-op)', () => {
  expect(() => applyAnchoring(lightnessForSteps(11), S11, 0.62, '5000')).toThrow(
    /preserveSeedAt "5000" is not one of the scale steps/,
  )
})
```

**Verify**: `pnpm vitest run packages/colors/src/shared/shared.test.ts` → exit 0, 9 tests pass (8 existing + 1 new).

### Step 3: End-to-end regression test through createTheme

In `engine.test.ts`, inside `describe('review regressions', …)`, add (mirrors the structure of the existing `per-mode override of an undeclared palette throws` test at lines 388-396):

```ts
it('preserveSeedAt naming a step outside the scale throws (typo / custom-steps mismatch)', () => {
  expect(() =>
    createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
      steps: ['1', '2', '3', '4', '5'],
      preserveSeedAt: '500', // valid for the default scale, absent from these steps
    }),
  ).toThrow(/preserveSeedAt "500" is not one of the scale steps/)
})
```

**Verify**: `pnpm vitest run packages/colors/src/engine.test.ts` → exit 0, all pass.

### Step 4: Full gates

**Verify**: `pnpm test` → exit 0 (www unaffected). `pnpm typecheck` → exit 0. `pnpm check` → exit 0. Kernel snapshots unchanged (`git status --porcelain packages/colors/src/__snapshots__` empty — the default path didn't change).

## Test plan

Steps 2–3. Pattern files: `shared.test.ts:58-71` for the unit level, `engine.test.ts:388-396` for the createTheme-level throw assertion.

Cases: unknown step at the util level; default-scale step name + custom steps at the API level; (already covered by existing tests) absent `preserveSeedAt` stays a no-op, valid step pins correctly.

## Done criteria

- [ ] `pnpm test` exits 0; both new tests pass.
- [ ] `grep -n 'idx < 0 || ls.length < 2' packages/colors/src/shared/seed-anchor.ts` returns no matches (the combined silent guard is gone).
- [ ] Kernel snapshot files byte-unchanged.
- [ ] `pnpm typecheck` and `pnpm check` exit 0.
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any www test fails — that would mean a live www config hits the new throw, contradicting the "Current state" analysis; report which config.
- You find a second caller of `applyAnchoring` besides the oklch producer (`grep -rn applyAnchoring packages/colors/src www/src`) — assess whether it can pass user input before proceeding.

## Maintenance notes

- Plan 007 (custom lightness anchors) touches the same `oklch.ts` lines that call `applyAnchoring`; land this first (it's smaller) or expect a trivial rebase.
- If the builder UI ever exposes custom `steps` (a known www-side gap), this throw is the backstop that turns a stale `preserveSeedAt` into a visible error — the UI should then validate before calling, and this error message is what its validation should mirror.
