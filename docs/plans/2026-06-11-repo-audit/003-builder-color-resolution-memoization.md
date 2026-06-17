# Plan 003: Stop recomputing color ramps on every builder knob tick (value-keyed memoization)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-repo-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0da0afa3..HEAD -- www/src/modules/core/styles.tsx www/src/modules/create/colors-config.tsx www/src/modules/create/color-contrast.tsx www/src/modules/create/preset/use-design-system.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `0da0afa3`, 2026-06-11

## Why this matters

The /create builder is the product's main surface, and its state lives in the URL: every knob tick re-encodes the design system into `?preset=`, and every consumer decodes it back into a **fresh object** (new identity even when a slice didn't change). `resolveColorConfig` — full OKLCH ramp generation, including the contrast algorithm's binary search (~20 iterations × ~11 steps × multiple palettes) — is keyed on that object identity, so it re-runs not only on every color-drag tick but also when the user changes **density or a component param** (color unchanged). The same applies to the WCAG contrast report and to the CSS emission inside the design-system provider, which runs in the preview iframe and the landing-page scoped previews. Value-keyed caching makes unrelated-axis changes free and repeated color resolutions for the same recipe instant.

## Current state

The identity chain:

- `www/src/modules/create/preset/use-design-system.ts:19-22` — design system is decoded fresh from the preset string:

```ts
const designSystem: DesignSystem = useMemo(() => {
  if (!preset) return DEFAULTS
  return decodePreset(preset)
}, [preset])
```

Every `set*` callback re-encodes and navigates (lines 24–35), so ANY change produces a new `preset` string → new `designSystem` object → new `designSystem.color` object identity even when the color recipe is unchanged.

- `www/src/modules/create/colors-config.tsx:81-86` — the builder panel resolves ramps keyed on that identity:

```ts
export function ColorsConfig() {
  const { designSystem, setColorSeed, setColorAlgorithm, setColorKnob } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const seeds = config.seeds
  const resolved = useMemo(() => resolveColorConfig(config), [config])
```

and renders `<ContrastReadout resolved={resolved} />` at line 168.

- `www/src/modules/create/color-contrast.tsx:41-42` — the readout calls the WCAG verifier directly in render, unmemoized:

```ts
export function ContrastReadout({ resolved }: { resolved: ResolvedPalettes }) {
  const results = solidContrastReport(resolved)
```

- `www/src/modules/core/styles.tsx:194` and `:314` — the design-system provider emits primitives CSS from `resolveColorConfig(color)` inside its CSS-building code paths (line 194 in the unscoped path, line 314 in the scoped path). These run in the preview iframe on every postMessage'd design-system change (`www/src/routes/_app/create.tsx:60-77` sends on every `designSystem` change) and in the landing-page scoped previews.
- `resolveColorConfig` itself lives in `www/src/registry/theme/` (re-exported from `@/registry/theme`) and is pure: `ColorConfig` in → resolved palettes out. `ColorConfig` is a small JSON-safe object (algorithm + seeds + knobs — see `www/src/modules/create/preset/codec.ts:94-99` which already `JSON.stringify`s it for comparison).
- Repo conventions: `www/src/modules/core/styles.tsx` is the www-side styling runtime — the right home for a www-side cache. Do NOT put caching inside `www/src/registry/theme/` (registry stays a clean, mechanism-free source tree per CLAUDE.md). The repo uses `oxlint-disable-next-line react/exhaustive-deps -- <reason>` comments where deps are intentionally narrowed (see `www/src/routes/_app/create.tsx:44,55`) — match that idiom if needed.
- Existing spec to model on: `www/src/modules/create/color-contrast.test.ts` (vitest, node, imports via `@/` alias).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Tests | `pnpm test` | all pass |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` | exit 0 |
| Manual check (optional) | `pnpm build:registry && pnpm dev:www` | builder at /create works |

## Scope

**In scope**:

- `www/src/modules/core/styles.tsx` (add `resolveColorConfigCached`, use it at the two internal call sites)
- `www/src/modules/create/colors-config.tsx` (use the cached resolver)
- `www/src/modules/create/color-contrast.tsx` (memoize the report on `resolved`)
- `www/src/modules/core/resolve-color-cached.test.ts` (create)

**Out of scope**:

- `www/src/registry/theme/**` and `packages/colors/**` — the pure engine stays pure; no caching inside it.
- `www/src/modules/create/preset/use-design-system.ts` and `codec.ts` — the URL-state architecture is intentional; don't restructure it.
- `www/src/routes/_app/create.tsx` / `preview/$slug.tsx` / `iframe-sync.ts` — postMessage batching (rAF) is a possible follow-up, NOT this plan; the cache already removes the expensive part of each message.
- `www/src/publisher/emit-theme.ts:163` and `emit-bundle-css.ts:35` — request-time/build-time single calls; caching there buys nothing.

## Git workflow

- Branch: `advisor/003-color-resolution-memoization`
- Commit style: `perf(create): cache color resolution by config value`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the value-keyed cache

In `www/src/modules/core/styles.tsx`, near the other module-scoped registries (lines ~51–55), add a size-1 cache:

```ts
let lastColorResolution: { key: string; value: ReturnType<typeof resolveColorConfig> } | null = null

/** resolveColorConfig keyed by config VALUE (size-1) — identical recipes return the same object. */
export function resolveColorConfigCached(config: ColorConfig): ReturnType<typeof resolveColorConfig> {
  const key = JSON.stringify(config)
  if (lastColorResolution?.key === key) return lastColorResolution.value
  const value = resolveColorConfig(config)
  lastColorResolution = { key, value }
  return value
}
```

(`resolveColorConfig` and the `ColorConfig` type are already imported in this file — see line 15 and the existing call sites. Size-1 is deliberate: the builder flips between at most one recipe at a time; don't build an LRU.)

Note for the panel and the iframe: they run in **separate documents**, so each gets its own module instance/cache — that's fine and expected.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Use it at the provider call sites

In the same file, replace `resolveColorConfig(color)` with `resolveColorConfigCached(color)` at the two CSS-emission sites (lines 194 and 314 at planning time — locate them by grepping `resolveColorConfig(` in this file).

**Verify**: `pnpm typecheck` → exit 0; `grep -n "resolveColorConfig(" www/src/modules/core/styles.tsx` → only the cached wrapper's internal call remains (plus the import).

### Step 3: Use it in the builder panel

In `www/src/modules/create/colors-config.tsx:86`, replace the memo with a direct call (the cache makes useMemo redundant and identity-stable across re-renders):

```ts
const resolved = resolveColorConfigCached(config)
```

importing `resolveColorConfigCached` from `@/modules/core/styles`. Remove the now-unused `useMemo` import only if nothing else in the file uses it.

**Verify**: `pnpm typecheck` and `pnpm check` → exit 0.

### Step 4: Memoize the contrast report

In `www/src/modules/create/color-contrast.tsx:41-42`, wrap the report: `const results = useMemo(() => solidContrastReport(resolved), [resolved])`. With Step 3, `resolved` keeps its identity when the recipe didn't change, so this memo actually holds across density/param ticks.

**Verify**: `pnpm typecheck` → exit 0.

### Step 5: Spec the cache

Create `www/src/modules/core/resolve-color-cached.test.ts` (model on `www/src/modules/create/color-contrast.test.ts`):

- same-value, different-identity configs (`JSON.parse(JSON.stringify(DEFAULT_COLOR_CONFIG))` twice) → `toBe`-identical results (same object).
- a changed seed (e.g. different `seeds.accent`) → different result object, and the resolved accent ramp differs from the default's.
- changed-then-restored config → recompute happens (size-1 semantics), result deep-equals the original.

**Verify**: `pnpm test -- resolve-color-cached` → 3 tests pass; then `pnpm test` → full suite green.

### Step 6 (optional, if preview tooling is available): observe the win

If your environment has the preview tools: `pnpm build:registry && pnpm dev:www`, open `/create`, change density back and forth, and confirm via console instrumentation (temporary `console.time` around `resolveColorConfig` in the cached wrapper) that density changes no longer trigger resolution. Remove any temporary instrumentation before committing.

**Verify**: no instrumentation left: `grep -rn "console.time" www/src/modules/core/styles.tsx` → no matches.

## Test plan

- New `resolve-color-cached.test.ts` as Step 5 (identity stability, correct invalidation, size-1 behavior).
- Existing suites that lock resolution correctness must stay green untouched: `www/src/registry/theme/primitives.test.ts` (32 tests), `palettes.test.ts`, `www/src/modules/create/color-contrast.test.ts`.
- Final: `pnpm test` → all pass.

## Done criteria

- [ ] `resolveColorConfigCached` exists in `www/src/modules/core/styles.tsx` with the size-1 value-keyed semantics
- [ ] `grep -rn "resolveColorConfigCached(" www/src/modules` shows it used in `styles.tsx` (2 sites) and `colors-config.tsx` (1 site)
- [ ] `solidContrastReport` call in `color-contrast.tsx` is wrapped in `useMemo`
- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check` all exit 0; new spec has ≥3 passing tests
- [ ] No changes under `www/src/registry/` or `packages/colors/` (`git status`)
- [ ] `docs/plans/2026-06-11-repo-audit/README.md` status row updated

## STOP conditions

Stop and report back if:

- `resolveColorConfig`'s return value turns out to be mutated by any consumer (the cache would leak mutations across renders) — search call sites for writes into the resolved object before assuming; if found, report rather than cloning.
- `ColorConfig` turns out to contain non-deterministically-ordered keys from different producers (JSON key makes false negatives) — report; do not switch to deep-equal without discussion.
- The visual output of /create changes in any way you can detect (this plan must be behavior-preserving).

## Maintenance notes

- If a future change makes color resolution async or worker-offloaded, the cache wrapper is the single place to adapt.
- Follow-up explicitly deferred: requestAnimationFrame-batching the iframe postMessage in `www/src/routes/_app/create.tsx:60-77` (only worth measuring after this lands), and `React.useDeferredValue` on the preview side for drag smoothness.
- Reviewer should scrutinize: that nothing mutates the cached resolved object, and the oxlint exhaustive-deps situation in `colors-config.tsx` after removing the useMemo.
