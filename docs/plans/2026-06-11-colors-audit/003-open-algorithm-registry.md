# Plan 003: Let registered custom algorithms through createTheme

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/schema.ts packages/colors/src/theme.ts packages/colors/src/producer.ts packages/colors/src/registry.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (land before plans 008/009, which build on the schema shape this plan establishes)
- **Category**: tech-debt / direction
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

The kernel's producer registry is explicitly designed to be open: `registerProducer` is exported, `AlgorithmId` is an open string union, and `src/producer.ts:5-7` claims "Adding an algorithm is one `registerProducer` call — nothing downstream branches on the algorithm." That claim is false today: `createTheme` validates its input against a **closed** zod discriminated union of exactly five algorithm literals, so a producer registered under any other id can never be used through the public API — the parse throws before the registry is ever consulted. The proof is in-repo: adding the `tailwind` preset required adding an arm to the core schema. The TypeScript signature (`BaseThemeOptions` with open `AlgorithmId`) accepts what the runtime rejects. dotUI's product direction needs a "selectable generation algorithm" axis that can grow (presets, community algorithms, starter themes); this plan makes the entry point honor the registry, while keeping strict validation for the built-in algorithms.

The design insight that makes this safe: knob validation is **already duplicated** per producer — `produceValidated` (`producer.ts:69-82`) parses every palette's options against the producer's own zod schema before producing. The top-level union is a second, redundant validator for knobs; it only needs to stay authoritative for the shared base fields (`palettes`, `modes`, `steps`).

## Current state

- `packages/colors/src/schema.ts` — the options schema. The closed union (lines 75-81):

```ts
export const createThemeOptionsSchema = z.discriminatedUnion('algorithm', [
  oklchArm,
  tailwindArm,
  contrastArm,
  materialArm,
  fixedArm,
])
```

Shared sub-schemas defined above it: `generativePalettes` (lines 12-14: `z.object({ primary: z.string() }).catchall(z.union([z.string(), z.boolean()]))`), `modeSchema`/`modesSchema` (lines 22-32), `stepsSchema` (line 33). `BaseThemeOptions` (lines 92-109) is the documented "flat superset" interface for dynamic callers, with `algorithm: AlgorithmId` (open).

- `packages/colors/src/theme.ts` — `createTheme` (lines 119-127):

```ts
export function createTheme(
  options: CreateThemeOptions | BaseThemeOptions,
): Theme {
  registerBuiltins()
  const opts: BaseThemeOptions = createThemeOptionsSchema.parse(options)
  const { algorithm } = opts
```

- `packages/colors/src/producer.ts` — registry: `registerProducer`, `getProducer` (lines 52-61, throws `Unknown color algorithm "<id>". Registered producers: <list>.`), `hasProducer`, `produceValidated` (lines 69-82, parses per-palette opts with `producer.schema`). `BuiltinAlgorithmId = 'oklch' | 'contrast' | 'material' | 'fixed'` (line 14 — note: `tailwind` is a preset, deliberately not in this type).
- `packages/colors/src/registry.test.ts` — the isolated registry suite (vitest gives each file its own module instance, so producers registered here don't leak; see its lines 8-9). It currently tests overriding the **existing** `oklch` id; nothing tests a **new** id end-to-end through `createTheme` (it would fail today).
- `packages/colors/src/producers/presets.ts` — the `tailwind` preset producer (delegates to oklch with `hueTorsion` default 24).
- Producer zod schemas are plain `z.object(...)` (strip-unknown-keys by default), e.g. `oklchOptsSchema` in `src/producers/oklch.ts:18-32` — this is what makes forwarding a knob-superset safe (each producer keeps only its own knobs; proven by the existing test `engine.test.ts:95-109`).
- Repo conventions: zod v4 (`.catchall()` is the idiom used for open objects — see `generativePalettes`); the kernel avoids `as` casts where possible (PR #187 removed them) — this plan introduces exactly one, documented, at the custom-arm boundary; file-header doc comments explain design intent.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Kernel tests | `pnpm vitest run packages/colors` | exit 0 |
| All tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` (fix: `pnpm check:fix`) | exit 0 |

## Scope

**In scope** (the only files you may modify):

- `packages/colors/src/schema.ts`
- `packages/colors/src/theme.ts`
- `packages/colors/src/producer.ts` (doc comment only)
- `packages/colors/src/registry.test.ts` (new tests)
- `docs/plans/2026-06-11-colors-audit/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/producers/*` — no producer changes; the `tailwind` arm STAYS in the union (it's a shipped builtin with typed knobs).
- `www/**` — the www app only uses builtin algorithms; nothing changes for it.
- `packages/colors/src/index.ts` exports — do not add new public exports beyond what Step 2 specifies.
- Snapshot files — if a snapshot changes, you broke behavior (STOP condition).

## Git workflow

- Branch: `advisor/003-open-algorithm-registry`
- Commit message style: `feat(colors): accept registered custom algorithms in createTheme`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add the custom-algorithm base schema in `schema.ts`

Below the five arm definitions and the union, add a base schema for non-builtin (registered) algorithms and the builtin-id list. The base schema validates the shared fields strictly and passes unknown knobs through (`.catchall(z.unknown())`) — per-producer schemas validate the knobs downstream in `produceValidated`:

```ts
/** Ids the discriminated union validates with full knob typing. Anything else must be a registered producer. */
export const BUILTIN_SCHEMA_IDS = ['oklch', 'tailwind', 'contrast', 'material', 'fixed'] as const

/**
 * Base validation for a REGISTERED non-builtin algorithm: shared fields are strict,
 * knobs pass through untyped — each producer's own zod schema validates them per palette
 * (see `produceValidated`). Custom algorithms are seed-generative: `palettes` follows the
 * generative shape (`primary` seed required).
 */
const customThemeOptionsSchema = z
  .object({
    algorithm: z.string(),
    palettes: generativePalettes,
    modes: modesSchema,
    steps: stepsSchema,
  })
  .catchall(z.unknown())
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Dispatch on builtin-vs-registered in `createTheme`

In `theme.ts`, replace the single parse line (`const opts: BaseThemeOptions = createThemeOptionsSchema.parse(options)`) with:

```ts
registerBuiltins()
let opts: BaseThemeOptions
if ((BUILTIN_SCHEMA_IDS as readonly string[]).includes(options.algorithm)) {
  opts = createThemeOptionsSchema.parse(options)
} else {
  // Throws the canonical "Unknown color algorithm" error (with the registered list) for
  // unregistered ids, BEFORE base validation — registration is the gate, not the union.
  getProducer(options.algorithm)
  // The catchall types extra knobs as `unknown`; producers re-validate them per palette
  // (produceValidated), so this widening cast is the one place the kernel trusts the registry.
  opts = customThemeOptionsSchema.parse(options) as BaseThemeOptions
}
```

Import `BUILTIN_SCHEMA_IDS` and `customThemeOptionsSchema` from `./schema` (export `customThemeOptionsSchema` from schema.ts — needed by the import; keep it un-exported from `src/index.ts`), and `getProducer` from `./producer` (already imported? check — `theme.ts` currently imports `{ type ModeCtx, produceValidated }`; add `getProducer`).

Note `registerBuiltins()` must run **before** the dispatch (it already is the first line) so builtins-as-custom can't happen and consumer pre-registered overrides still win.

**Verify**: `pnpm vitest run packages/colors` → exit 0 (all existing tests pass: builtin behavior is unchanged because every currently-valid input has a builtin id and takes the same parse path).

### Step 3: Fix the now-true doc comments

- `producer.ts:5-7` header: the claim "Adding an algorithm is one `registerProducer` call — nothing downstream branches on the algorithm" is now accurate — extend it with one sentence: registered non-builtin ids are accepted by `createTheme` (base fields validated, knobs validated by the producer's own schema).
- `schema.ts:1-4` header: note the union covers builtins only and point at `customThemeOptionsSchema` for registered ids.

**Verify**: `pnpm check` → exit 0.

### Step 4: Tests in `registry.test.ts`

Add to the existing `describe('registry', …)` (this file is the right home — it's the isolated-registry suite, see its header comment):

```ts
it('a registered NEW algorithm id works end-to-end through createTheme, knobs included', () => {
  const mono: ColorProducer<{ seed: string; lift?: number }> = {
    id: 'mono-test',
    schema: z.object({ seed: z.string(), lift: z.number().optional() }),
    produce: (opts) => ({
      scale: { '500': `oklch(${0.5 + (opts.lift ?? 0)} 0 0)` },
      on: { '500': 'oklch(1 0 0)' },
    }),
  }
  registerProducer(mono)
  const theme = createTheme({
    algorithm: 'mono-test',
    palettes: { primary: '#3b82f6' },
    lift: 0.2, // custom knob: must pass through the base schema's catchall to the producer
  })
  expect(theme.light!.scales.primary!['500']).toBe('oklch(0.7 0 0)')
})

it('an UNREGISTERED id still fails loudly with the registered list', () => {
  expect(() =>
    createTheme({ algorithm: 'not-a-thing', palettes: { primary: '#3b82f6' } }),
  ).toThrow(/Unknown color algorithm "not-a-thing"/)
})

it('builtin ids keep strict knob validation (not loosened by the custom path)', () => {
  expect(() =>
    createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
      chromaMult: -1, // violates oklchArm's z.number().min(0)
    }),
  ).toThrow()
})
```

`createTheme` is typed `CreateThemeOptions | BaseThemeOptions`; the custom-id calls type-check against `BaseThemeOptions`… except `lift` is not a declared field. Pass the custom-knob object as `BaseThemeOptions` via a typed widening at the test boundary if needed — prefer `createTheme({ algorithm: 'mono-test', palettes: { primary: '#3b82f6' }, lift: 0.2 } as BaseThemeOptions & { lift: number })`. If that cast offends `pnpm check`, a plain intermediate `const options = {...} satisfies Record<string, unknown> as BaseThemeOptions` is acceptable in test code.

**Verify**: `pnpm vitest run packages/colors/src/registry.test.ts` → exit 0, 5 tests pass (2 existing + 3 new).

### Step 5: Full gates

**Verify**: `pnpm test` → exit 0 (no www regressions — www only uses builtin ids). `pnpm typecheck` → exit 0. `git diff --stat` → only in-scope files. Snapshot files untouched.

## Test plan

Covered in Step 4. Pattern file: `packages/colors/src/registry.test.ts` (its existing override test shows the register-then-createTheme structure to imitate).

Cases: new-id happy path with a custom knob reaching the producer; unregistered id error message; builtin strictness preserved.

## Done criteria

- [ ] `pnpm test` exits 0; the 3 new registry tests pass.
- [ ] `pnpm typecheck` and `pnpm check` exit 0.
- [ ] `git diff --name-only` shows only the 4 in-scope source/test files (+ docs/plans/2026-06-11-colors-audit/README.md).
- [ ] Both kernel snapshot files byte-unchanged (`git status --porcelain packages/colors/src/__snapshots__` is empty).
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any **existing** kernel or www test fails after Step 2 — the dispatch changed builtin behavior; that must not happen.
- A snapshot file changes.
- You find that supporting custom algorithms requires changing `resolvePalettes` or `buildPaletteOpts` in `theme.ts` — it must not (custom producers take the generative path; `buildPaletteOpts` already forwards `...opts` and producer schemas strip). If reality disagrees, report instead of refactoring.
- You're tempted to also support **fixed-style** custom producers (scale-record palettes under a custom id) — that is explicitly deferred; the base schema is generative-only by design.

## Maintenance notes

- Plans 008 (per-palette knob overrides) and 009 (on-color option) extend `schema.ts`; they assume this plan's shape (union for builtins + `customThemeOptionsSchema` for registered ids) and must add new shared fields to **both**.
- Future preset producers (à la `tailwind`) now have a choice: register-only (no schema arm — knobs typed `unknown` at the top level, still validated per-producer) or full arm (typed knobs). Reserve arms for shipped builtins.
- Reviewer should scrutinize: the single `as BaseThemeOptions` cast and its comment; that `getProducer` is called before `customThemeOptionsSchema.parse` (error-message ordering is part of the contract tested in Step 4).
