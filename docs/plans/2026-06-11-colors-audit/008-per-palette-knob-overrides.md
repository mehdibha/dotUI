# Plan 008: Per-palette knob overrides (palette config objects)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src/schema.ts packages/colors/src/theme.ts packages/colors/src/engine.test.ts`
> Plans 003/005/006/007 are EXPECTED to have landed (they touch `schema.ts`/`theme.ts`); what must still match are the specific excerpts below — `resolvePalettes` and `buildPaletteOpts` in particular. On a mismatch in those two functions, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (reworks palette resolution — the orchestrator's core; defaults must stay byte-identical)
- **Depends on**: docs/plans/2026-06-11-colors-audit/003-open-algorithm-registry.md (this plan edits `generativePalettes`, which plan 003's `customThemeOptionsSchema` reuses — land 003 first so there is one edit point)
- **Category**: direction (approved axis)
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

All generation knobs (`chromaMult`, `minChroma`, `hueTorsion`, `chromaMode`, `preserveSeedAt`, `saturation`, …) are theme-global today: every palette gets the same values. Real design systems tune palettes independently — a vivid brand accent with muted status colors, the brand lightness pinned at step 500 for the accent only, a higher-chroma warning. The kernel's per-mode `paletteOverride` covers only `seed`/`ratios`/`tones`, so per-palette knob control has no path at all. This plan extends the palette value syntax from `seed-string | boolean` to also accept a config object — `{ seed: '#…', chromaMult: 2 }` — merged over the theme-global knobs, with mode-level overrides still winning. Plain string/boolean configs produce byte-identical output.

## Current state

- `packages/colors/src/schema.ts` — the generative palette shape (lines 11-14):

```ts
/** Generative palettes: `primary` required (seed); others = seed string or on/off; custom names allowed. */
const generativePalettes = z
  .object({ primary: z.string() })
  .catchall(z.union([z.string(), z.boolean()]))
```

`paletteOverride` (lines 16-20) is the per-MODE override (`seed`/`ratios`/`tones`) — unchanged by this plan. `BaseThemeOptions.palettes` (line 94) is `Record<string, string | ColorScale | boolean>`.

- `packages/colors/src/theme.ts` — the two functions this plan reworks:

```ts
// theme.ts:31-59 — resolvePalettes: name → seed string (generative) or scale map (fixed).
// Generative branch resolves: primary (string), neutral (explicit string or derived from
// primary), others (string seed, or `true` → SEMANTIC_COLORS default), skipping non-strings.
function resolvePalettes(
  palettes: Record<string, string | ColorScale | boolean>,
  isFixed: boolean,
): Map<string, string | ColorScale> { /* … */ }

// theme.ts:94-113 — buildPaletteOpts: spreads global opts, sets seed/neutral/scale,
// maps contrast `saturation` (0–100) onto producer `chroma`, applies mode overrides:
return {
  ...opts,
  seed,
  neutral: name === 'neutral',
  scale: typeof input === 'object' ? input : undefined,
  chroma: opts.saturation != null ? opts.saturation / 100 : undefined,
  ratios: override?.ratios ?? opts.ratios,
  tones: override?.tones ?? opts.tones,
}
```

The mode loop (lines 135-164) iterates `baseInputs` and calls `produceValidated(algorithm, paletteOpts, ctx)` — producer zod schemas strip foreign knobs (the mechanism that makes a knob-superset merge safe; proven by `engine.test.ts:95-109`).

- The neutral seed also feeds the mode background: `theme.ts:130-132` reads `baseInputs.get('neutral')` as `neutralBase` (a string), and line 144 `resolved.palettes.neutral?.seed ?? neutralBase`. The rework must keep a plain string seed reachable for this.
- Tests: `engine.test.ts` — `a non-string neutral derives from primary` (lines 111-125) pins the explicit-or-derived neutral rule; `per-mode palette seed override diverges modes` (lines 374-386) pins mode-override precedence; snapshots pin all default values.
- Repo conventions: no `as` casts where avoidable (a narrow type-guard function is the accepted idiom), zod v4 with `.catchall(...)` for open objects, doc comments explain intent.

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
- `packages/colors/src/engine.test.ts`
- `docs/plans/2026-06-11-colors-audit/README.md` (status row)

**Out of scope** (do NOT touch):

- `packages/colors/src/producer.ts`, all producers — they already accept the merged opts; nothing changes.
- The `fixed` arm and the fixed branch of `resolvePalettes` — fixed palettes stay literal scale records; no seed-sniffing there.
- `paletteOverride` (the per-mode shape) — mode overrides keep their current 3 fields and their precedence.
- All `www/**` files (string-seed configs only; unaffected). Snapshot files — must not change.

## Git workflow

- Branch: `advisor/008-per-palette-knob-overrides`
- Commit message style: `feat(colors): per-palette knob overrides via palette config objects`
- Run `pnpm check:fix` before committing. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Extend the schema

In `schema.ts`:

```ts
/** A generative palette input: a seed string, or a config object carrying per-palette knob overrides (validated by each producer's schema). */
const paletteSeedConfig = z.object({ seed: z.string() }).catchall(z.unknown())
const paletteInput = z.union([z.string(), paletteSeedConfig])
/** Generative palettes: `primary` required; others = seed/config or on/off; custom names allowed. */
const generativePalettes = z
  .object({ primary: paletteInput })
  .catchall(z.union([paletteInput, z.boolean()]))
```

Update `BaseThemeOptions.palettes` to `Record<string, string | ColorScale | boolean | PaletteSeedConfig>` with an exported type:

```ts
/** Object form of a generative palette input: seed + per-palette knob overrides. */
export interface PaletteSeedConfig {
  seed: string
  [knob: string]: unknown
}
```

(`seed: string` is compatible with the index signature since `string` ⊆ `unknown`.)

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Rework `resolvePalettes` to carry knobs

In `theme.ts`, introduce the resolved-entry shape and a type guard, then rework only the generative branch:

```ts
interface ResolvedPaletteInput {
  input: string | ColorScale
  /** Per-palette knob overrides from the object form (producer schemas validate/strip them). */
  knobs?: Record<string, unknown>
}

function isSeedConfig(v: unknown): v is { seed: string } & Record<string, unknown> {
  return typeof v === 'object' && v !== null && typeof (v as { seed?: unknown }).seed === 'string'
}

function toEntry(v: string | PaletteSeedConfig): ResolvedPaletteInput {
  if (typeof v === 'string') return { input: v }
  const { seed, ...knobs } = v
  return { input: seed, knobs }
}
```

`resolvePalettes` returns `Map<string, ResolvedPaletteInput>`. Behavior to preserve exactly, now over both forms:

- fixed branch: unchanged logic, wrapping each scale as `{ input: scale }`.
- `primary`: string or config → `toEntry`.
- `neutral`: explicit string/config wins (`toEntry`); otherwise derive **the seed only** from primary (`{ input: primarySeed }` — primary's knobs do NOT leak into the derived neutral; the derived neutral keeps no knobs).
- other names: `true` → `{ input: SEMANTIC_COLORS[name] }` when defined; string/config → `toEntry`; anything else skipped.

Update the two consumers of the old map shape:

- `neutralBase` (lines 130-132): `const neutralEntry = baseInputs.get('neutral')` → `neutralBase = !isFixed && typeof neutralEntry?.input === 'string' ? neutralEntry.input : undefined`.
- The mode loop: `for (const [name, entry] of baseInputs)` passes `entry` to `buildPaletteOpts`.

**Verify**: `pnpm typecheck` → exit 0 (tests come after Step 3).

### Step 3: Merge order in `buildPaletteOpts`

Precedence (lowest → highest): theme-global opts → palette config knobs → per-mode override. Keep the existing `Record<string, unknown>` return type — it avoids casts:

```ts
/** Build the per-palette opts: global knobs, then the palette config's overrides, then mode overrides. Each producer's zod schema keeps only its own. */
function buildPaletteOpts(
  name: string,
  entry: ResolvedPaletteInput,
  opts: BaseThemeOptions,
  override: ResolvedMode['palettes'][string] | undefined,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...opts, ...entry.knobs }
  const seed =
    override?.seed ?? (typeof entry.input === 'string' ? entry.input : undefined)
  const saturation = merged.saturation
  return {
    ...merged,
    seed,
    neutral: name === 'neutral',
    scale: typeof entry.input === 'object' ? entry.input : undefined,
    // the kernel maps contrast `saturation` (0–100) onto the producer's `chroma`
    chroma: typeof saturation === 'number' ? saturation / 100 : undefined,
    ratios: override?.ratios ?? merged.ratios,
    tones: override?.tones ?? merged.tones,
  }
}
```

Note this preserves a subtlety: `palettes`/`modes`/`steps`/`algorithm` still ride along in the spread and are stripped by producer schemas, same as today.

**Verify**: `pnpm vitest run packages/colors` → exit 0, **zero snapshot changes** (string/boolean configs take the same code path values as before).

### Step 4: Tests

In `engine.test.ts`, add a new describe `per-palette knob overrides` (place after `review regressions`):

```ts
describe('per-palette knob overrides', () => {
  it('a palette config object overrides a knob for that palette only', () => {
    const themed = createTheme({
      algorithm: 'oklch',
      palettes: {
        primary: '#3b82f6',
        success: { seed: '#22c55e', chromaMult: 0, minChroma: 0 },
      },
    })
    const plain = createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6', success: '#22c55e' },
    })
    // success is desaturated by its own knobs…
    expect(toOklch(val(sc(themed, 'light', 'success'), '500')).c).toBeLessThan(
      toOklch(val(sc(plain, 'light', 'success'), '500')).c,
    )
    // …while primary is untouched
    expect(sc(themed, 'light', 'primary')).toEqual(sc(plain, 'light', 'primary'))
  })

  it('per-palette preserveSeedAt pins only that palette', () => {
    const seed = '#3b82f6'
    const theme = createTheme({
      algorithm: 'oklch',
      palettes: { primary: { seed, preserveSeedAt: '500' }, success: true },
    })
    expect(toOklch(val(sc(theme, 'light', 'primary'), '500')).l).toBeCloseTo(
      toOklch(seed).l,
      2,
    )
  })

  it('mode-level override still beats the palette config (seed)', () => {
    const theme = createTheme({
      algorithm: 'oklch',
      palettes: { primary: { seed: '#3b82f6', chromaMult: 1 } },
      modes: { light: { palettes: { primary: { seed: '#e11d48' } } }, dark: true },
    })
    const lightHue = toOklch(val(sc(theme, 'light', 'primary'), '500')).h
    const darkHue = toOklch(val(sc(theme, 'dark', 'primary'), '500')).h
    expect(Math.abs(lightHue - darkHue)).toBeGreaterThan(30)
  })

  it('an object-form primary still derives the neutral from its seed (knobs do not leak)', () => {
    const objForm = createTheme({
      algorithm: 'oklch',
      palettes: { primary: { seed: '#3b82f6', chromaMult: 2 } },
    })
    const plain = createTheme({ algorithm: 'oklch', palettes: { primary: '#3b82f6' } })
    expect(sc(objForm, 'light', 'neutral')).toEqual(sc(plain, 'light', 'neutral'))
  })
})
```

(If plan 005 landed, `preserveSeedAt` in dark mode pins at the mirrored step — the test above reads light mode, unaffected.)

**Verify**: `pnpm vitest run packages/colors/src/engine.test.ts` → exit 0, 4 new tests pass.

### Step 5: Full gates

**Verify**: `pnpm test` → exit 0. `pnpm typecheck` → exit 0. `pnpm check` → exit 0. `git status --porcelain packages/colors/src/__snapshots__ www/src/registry/theme/__snapshots__` → empty.

## Test plan

Step 4. Pattern: the existing `review regressions` describe in `engine.test.ts`. Cases: per-palette knob isolation; per-palette `preserveSeedAt`; mode-override precedence; neutral derivation from an object-form primary; defaults byte-identical (snapshots).

## Done criteria

- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0; 4 new tests pass.
- [ ] All snapshot files byte-unchanged.
- [ ] `engine.test.ts:111-125` (`non-string neutral derives from primary`) and `:374-386` (mode-override) pass unmodified.
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any snapshot changes — the string/boolean path drifted; find the cause instead of updating.
- `resolvePalettes`/`buildPaletteOpts` no longer match the excerpts structurally (a prior plan reshaped them beyond what's described) — reconcile before editing; if irreconcilable, report.
- Plan 003 has NOT landed and `generativePalettes` has a single consumer — you may still proceed, but note in the PR that 003 will need to re-point `customThemeOptionsSchema` at the new `generativePalettes`.
- Typing forces more than the single `isSeedConfig` guard (e.g. casts inside the mode loop) — the design has a hole; report rather than sprinkling casts.

## Maintenance notes

- www follow-up (separate, product-gated): the builder could expose per-palette "advanced" knob panels; the codec must learn the object form (`www/src/modules/create/preset/`) before any UI ships.
- Plan 009 (on-color option) touches the same mode loop in `theme.ts`; whichever lands second rebases trivially but should re-run the full snapshot gate.
- Reviewer focus: the precedence rule (global < palette < mode) stated in `buildPaletteOpts`'s doc comment and exercised by the third test; the no-knob-leak rule for derived neutrals.
