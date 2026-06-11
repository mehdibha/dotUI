# Plan 002: Add a CI production-build job and a publishables schema/completeness sweep test

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-repo-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0da0afa3..HEAD -- .github/workflows/ci.yml www/src/publisher www/src/routes/r www/package.json`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: docs/plans/2026-06-11-repo-audit/001-publisher-evaluate-styles-fail-loud.md (the completeness assertion expects input/slider/progress-bar/otp-field to be published; if 001 hasn't landed, see Step 4's allowlist note)
- **Category**: tests
- **Planned at**: commit `0da0afa3`, 2026-06-11

## Why this matters

CI today runs lint, typecheck, unit tests, and a registry-drift diff — but never the production build and never exercises what `npx shadcn add` actually receives. A broken Vite build surfaces only on Vercel after merge, and a malformed registry item (bad JSON shape, unresolved `%%TV_CONFIG%%` placeholder, missing files) would ship without any check failing. The exported registry item is the product. This plan adds (a) a CI job that runs the real `pnpm build:www`, (b) workflow-level concurrency cancellation, and (c) a vitest sweep that publishes every publishable in-process and validates the result against the shadcn registry-item shape.

## Current state

- `.github/workflows/ci.yml` — four jobs (`check`, `tsc`, `test`, `registry-drift`), each `runs-on: ubuntu-latest` with `actions/checkout@v4` (`fetch-depth: 0`) + `uses: ./.github/actions/setup`, then one pnpm command. There is no `concurrency` block and no job runs `vite build`.
- `.github/actions/setup/action.yml` — composite action: `pnpm/action-setup@v3`, `actions/setup-node@v4` with `node-version: 24` + pnpm cache, then `pnpm install`.
- `www/package.json:10` — `"build": "pnpm build:registry && NODE_OPTIONS='--max-old-space-size=8192' vite build && pnpm build:postprocess"`. The 8 GB heap is set inside the script, so the CI job needs no extra env. GitHub's standard ubuntu-latest runners have 16 GB RAM.
- Root `package.json` — `"build:www": "pnpm --filter=www build"`.
- Serving path the sweep must mirror — `www/src/routes/r/$name.tsx`:
  - line 18–20: `import { publishables, PUBLISHABLE_NAMES } from '@/registry/__generated__/publishables'`
  - line 29: `setKnownDotuiNames(PUBLISHABLE_NAMES)` at module scope
  - lines 63–66: `const mod = await loader()`, `selectPublishable(mod, preset)`, then `publish({ publishable, preset })` → `{ item, rawContent }`
  - line 131: `defaultPreset()` is `{ density: 'compact', componentParams: {} }`
- `www/src/publisher/publish.ts:108-118` — `publish()` returns `PublishedItem { item: RegistryItem; rawContent: string }`.
- `www/src/registry/types.ts` — the repo's own `RegistryItem` type (read it before writing the schema; the sweep validates runtime shape, not just types).
- Registered-vs-published mapping: `www/scripts/registry-build.ts` builds publishables from `registryUi` (imported at line 30 from `../src/registry/ui/registry`); items without a `base*.tsx` in `meta.files` legitimately skip (see `collectBaseFiles` in `www/src/publisher/build-time/build-publishables.ts:261-276`, exported).
- Root `vitest.config.ts` — aliases `@/` → `www/src/`, default include patterns (any `*.spec.ts` under `www/src` runs), excludes `**/fixtures/**`, `**/templates/**`. A new spec file is picked up automatically. `zod` v4 is already a www dependency if you want it, but hand-rolled assertions are fine and avoid schema-version questions.
- Existing test to model structure on: `www/src/publisher/publish.spec.ts` (it already imports `publish`, `setKnownDotuiNames`, `setDotuiDepResolver` — see its lines 18 and 32).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Tests | `pnpm test` | all pass |
| Production build (local proof) | `pnpm build:www` | exit 0 |
| Lint/format | `pnpm check` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |

## Scope

**In scope**:

- `.github/workflows/ci.yml`
- `www/src/publisher/publishables-sweep.spec.ts` (create)

**Out of scope**:

- `.github/actions/setup/action.yml` — shared by all jobs; don't change it.
- `.github/workflows/pr-labeler.yml`.
- Any HTTP-level/E2E testing harness (Playwright etc.) — the sweep calls `publish()` in-process on purpose; route handlers are thin wrappers over it.
- Removing `fetch-depth: 0` from existing jobs — plausible cleanup, but verify-and-change is not worth coupling to this plan. Note it for a follow-up instead.
- `turbo.json` caching changes.

## Git workflow

- Branch: `advisor/002-ci-build-and-sweep`
- Commit style: `type(scope): summary`, e.g. `ci: build www in CI` and `test(publisher): sweep every publishable through publish()`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add workflow concurrency

In `.github/workflows/ci.yml`, after the `on:` block, add:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Verify**: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"` → exit 0 (or any YAML parse check available).

### Step 2: Add the build job

Append a job mirroring the existing ones:

```yaml
  build:
    runs-on: ubuntu-latest
    name: Build www
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: ./.github/actions/setup

      - run: pnpm build:www
```

(Keep `fetch-depth: 0` for consistency with the other jobs — see out-of-scope note.)

**Verify**: YAML parses (as Step 1); then prove the command works on this machine: `pnpm build:www` → exit 0. Record how long it took in your report (if it exceeds ~10 minutes locally, note that in the report — it still belongs in CI, but the operator may want it on merge-group only).

### Step 3: Write the sweep spec

Create `www/src/publisher/publishables-sweep.spec.ts`. Shape:

- Imports: `publishables`, `PUBLISHABLE_NAMES` from `@/registry/__generated__/publishables`; `publish`, `setKnownDotuiNames`, `setDotuiDepResolver` from `@/publisher/publish` (if plan 004 has landed, `setDotuiDepResolver` is gone — pass the resolver through `publish()` instead, matching the updated `publish.spec.ts`); `registryUi` from `@/registry/ui/registry`; `collectBaseFiles` from `@/publisher/build-time/build-publishables`.
- `beforeAll`: `setKnownDotuiNames(PUBLISHABLE_NAMES)` (mirror `publish.spec.ts`).
- **Test A — completeness**: every `registryUi` item where `collectBaseFiles(meta).length > 0` must appear in `PUBLISHABLE_NAMES`. Assert the missing-set is empty and print it on failure.
- **Test B — schema sweep**: `for (const name of PUBLISHABLE_NAMES)` (use `it.each` or a loop of `it(...)` so failures name the component): `const mod = await publishables[name]!()`, `const { item, rawContent } = publish({ publishable: mod.publishable, preset: { density: 'compact', componentParams: {} } })`, then assert:
  - `item.name === name`; `item.type === 'registry:ui'`
  - `Array.isArray(item.files)` and every file has non-empty string `path`, `type`, `content`
  - no file `content` (nor `rawContent`) contains `%%TV_CONFIG%%`
  - `item.dependencies`/`registryDependencies`, when present, are arrays of non-empty strings
  - `JSON.parse(JSON.stringify(item))` deep-equals `item` (serializable — this is what the route responds with)
- **Test C — enum-file variants**: for every `mod` with `publishableByPath`, run the Test B assertions on each entry too (this is the path `selectPublishable` in `www/src/routes/r/$name.tsx:107-128` picks from).

Before finalizing assertions, read `www/src/registry/types.ts` (`RegistryItem`) and one real published output (e.g. run `publish` on `button` in a scratch test) so assertions reflect actual field names — do not guess fields this plan doesn't list.

**Verify**: `pnpm test -- publishables-sweep` → all pass (expect ~60+ test cases). Then `pnpm test` → full suite passes.

### Step 4: Completeness expectations vs plan 001

If plan 001 has NOT landed yet, Test A will fail on `input`, `otp-field`, `progress-bar`, `slider`. In that case add a `KNOWN_UNPUBLISHED = new Set([...those four])` with a comment pointing at `docs/plans/2026-06-11-repo-audit/001-*`, assert nothing **outside** that set is missing, and leave a `TODO(001)` to empty the set. If 001 has landed, no allowlist — the missing-set must be empty.

**Verify**: `pnpm test` → green either way.

## Test plan

The sweep spec IS the test. Model file structure on `www/src/publisher/publish.spec.ts`. Cases: completeness (A), per-publishable schema (B), enum-file variants (C). Final: `pnpm test` all green, `pnpm check` and `pnpm typecheck` exit 0.

## Done criteria

- [ ] `.github/workflows/ci.yml` has a `concurrency` block and a `build` job running `pnpm build:www`
- [ ] `pnpm build:www` exits 0 locally
- [ ] `www/src/publisher/publishables-sweep.spec.ts` exists; `pnpm test` exits 0
- [ ] Sweep covers every name in `PUBLISHABLE_NAMES` (assert count > 50 inside the spec so an accidentally-empty loop can't pass)
- [ ] `pnpm check` and `pnpm typecheck` exit 0
- [ ] `docs/plans/2026-06-11-repo-audit/README.md` status row updated

## STOP conditions

Stop and report back if:

- `pnpm build:www` fails locally for a pre-existing reason (the plan assumed it builds; a real build break is its own finding — report it, don't fix it here).
- The sweep surfaces a publishable that genuinely violates the schema (e.g. leftover placeholder) — that's a product bug to report with the component name, not something to allowlist silently.
- Importing `collectBaseFiles` into vitest drags in something that breaks the test environment (it imports ts-morph transitively; expected to work under node — if not, inline a minimal local copy of the base-file predicate and note it).

## Maintenance notes

- When a new component is added to the registry, the sweep extends automatically via `PUBLISHABLE_NAMES`; the completeness test extends via `registryUi`. No per-component test registration needed.
- If plan 004 lands after this one, its `publish()` signature change will touch this spec (the `setDotuiDepResolver` import) — expected, small.
- Follow-up candidates deliberately not done here: dropping `fetch-depth: 0` from CI jobs (verify nothing needs history first), turbo remote caching, and a true HTTP smoke test against a built server.
