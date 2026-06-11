# Plan 001: Restore the 4 silently-skipped components and make publisher skips fail the build

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0da0afa3..HEAD -- www/src/publisher www/src/modules/core/styles.tsx www/scripts/registry-build.ts www/src/registry/ui/input www/src/registry/ui/slider www/src/registry/ui/progress-bar www/src/registry/ui/otp-field`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `0da0afa3`, 2026-06-11

## Why this matters

dotUI's product is exported component code: users run `npx shadcn add @dotui/<name>` against `GET /r/<name>`. Today four registered components — **input, slider, progress-bar, otp-field** — have no publishable, so `/r/input` etc. return 404 while the public docs pages (`www/content/docs/components/input.mdx`, `slider.mdx`, `progress-bar.mdx`, `otp-field.mdx`) advertise them. The build pipeline knows: `pnpm build:registry` prints a "4 component(s) skipped" warning, but nothing fails — CI is green, the drift job passes, and the breakage ships silently. This plan (a) fixes extraction for those four components and (b) turns unexpected skips into a build failure so this class of bug can never ship silently again.

## Current state

How the pipeline works today:

- `www/scripts/registry-build.ts` — orchestrator run by `pnpm build:registry`. Its `buildShadcnPublishables()` (lines 615–629) calls `buildPublishables(...)` and **only logs** the skipped list:

```ts
// www/scripts/registry-build.ts:615
async function buildShadcnPublishables() {
  const { written, skipped } = await buildPublishables({
    registryDir: REGISTRY_DIR,
    items: registryUi,
  })
  for (const filePath of written) {
    console.log(`  ✓ ${path.relative(REGISTRY_DIR, filePath)}`)
  }
  if (skipped.length > 0) {
    console.log(`\n  ${skipped.length} component(s) skipped:`)
    for (const { name, reason } of skipped) {
      console.log(`    - ${name}: ${reason}`)
    }
  }
}
```

- `www/src/publisher/build-time/build-publishables.ts` — per-item loop; any throw becomes a skip (lines 46–58). `buildOne()` (line 164) calls `extractStylesConfig(stylesTsPath)` at line 177. It also exports `assertPlaceholderInTemplate` (lines 395–404) which is currently **never called** by anything.
- `www/src/publisher/build-time/extract-config.ts` — AST-walks the second argument of `createStyles(meta, <config>)` and converts it to a plain value. It only supports literals; anything else throws, e.g. line 127:

```ts
// www/src/publisher/build-time/extract-config.ts:127
throw new Error(
  `[publisher/extract] unsupported expression kind ${node.getKindName()} in ${filePath}: "${node.getText()}"`,
)
```

- The four failing `styles.ts` files use non-literal expressions **on purpose** (they are well-factored, not sloppy):
  - `www/src/registry/ui/input/styles.ts` — top-level `const tokens = tv({...})` (line 10), `const compactText = '...'` / `defaultText` (lines 22–23), four field-shell `tv()` consts (`outlineField` line 31, `lineField` 42, `filledLineBottomField` 53, `filledField` 64), and addon-helper string consts (lines 80–85). The config then references them, e.g. `inputGroup: tokens({ h: 6 })` (line 147) and `inputGroup: outlineField({ focus: 'group' })` (line 221).
  - `www/src/registry/ui/slider/styles.ts` — `root: fieldStyles().field()` (line 9), where `fieldStyles` is imported from `@/registry/ui/field` (line 1) — a **cross-module** call.
  - `www/src/registry/ui/progress-bar/styles.ts` — same `root: fieldStyles().field()` pattern (line 9).
  - `www/src/registry/ui/otp-field/styles.ts` — `root: [fieldStyles().field({ className: 'group/otp-field' }), '...']` (lines 9–12).
- Because of the cross-module `fieldStyles()` calls, extending the AST evaluator is a dead end (you would be reimplementing the JS runtime). The fix is to **evaluate the styles module at build time and capture the config object** — the same evaluation the live builder already performs at runtime.
- `www/src/modules/core/styles.tsx` — defines `createStyles` (section marker at line 414) and already has precedent for module-scoped capture registries populated at module load:

```ts
// www/src/modules/core/styles.tsx:51
const enumVarsRegistry = new Map<...>
const scalarVarsRegistry = new Map<string, Record<string, string>>()
```

- Node-safety: all `document` access in `styles.tsx` is inside functions (lines 160, 280, 320…), top level is imports + Map/Set/context creation, so the module imports cleanly under node. `www/scripts/registry-build.ts` already imports app modules through the same graph (e.g. `../src/registry/ui/registry`, and `build-publishables.ts` itself imports `@/registry/types`) under `tsx`, so path aliases resolve in this context.
- `GET /r/registry.json` (`www/src/routes/r/registry[.]json.tsx`) builds its index from `PUBLISHABLE_NAMES`, so once the four publishables exist they are advertised automatically — no change needed there.
- Intentional exclusions live in `ORPHAN_ALLOWLIST` in `www/scripts/registry-build.ts` (lines 397–403: `ui/context-menu`, `ui/sidebar`, `ui/react-hook-form`, `ui/tanstack-form`, `lib/context`), each with a doc comment explaining why. Mirror that documentation style for the new expected-skips set.
- Repo conventions: single quotes, no semicolons where the file omits them — match the file you are editing. Generated artifacts under `www/src/registry/__generated__/` are committed; CI's registry-drift job diffs them (see `.github/workflows/ci.yml:45-70`).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Regenerate registry | `pnpm build:registry` | exit 0, prints `✅ Registry built successfully!` |
| Typecheck | `pnpm typecheck` | exit 0 |
| Tests | `pnpm test` | all pass |
| Lint/format | `pnpm check` (`pnpm check:fix` to fix) | exit 0 |

## Scope

**In scope** (the only files you should modify):

- `www/src/modules/core/styles.tsx` (add config capture to `createStyles`)
- `www/src/publisher/build-time/evaluate-config.ts` (create)
- `www/src/publisher/build-time/build-publishables.ts` (fallback wiring + placeholder assert)
- `www/scripts/registry-build.ts` (fail-loud guard)
- `www/src/publisher/build-time/build.spec.ts` (extend tests) and/or a new `www/src/publisher/build-time/styles-extraction-sweep.spec.ts`
- `www/src/registry/__generated__/**` and `www/src/registry/base/colors.css` (regenerated artifacts — commit whatever `pnpm build:registry` produces)

**Out of scope** (do NOT touch, even though they look related):

- The four `styles.ts` files themselves — they are correct source; do not inline or restructure them.
- `www/src/publisher/publish.ts`, `flatten.ts`, `resolve-classes.ts`, `serialize.ts` — the request-time pipeline is untouched by this plan.
- `www/src/routes/r/**` — the routes pick up new publishables automatically.
- `extract-config.ts` — keep the AST extractor exactly as is; it stays the primary path.

## Git workflow

- Branch: `advisor/001-publisher-evaluate-styles`
- Commit style: `type(scope): summary` (e.g. `fix(publisher): evaluate styles configs the AST extractor can't parse`). PR titles become commit titles; describe the change, don't justify it.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Reproduce and record the baseline

Run `pnpm build:registry` and capture the skipped list. Then count publishables.

**Verify**: output contains `4 component(s) skipped:` listing `input`, `otp-field`, `progress-bar`, `slider` with `[publisher/extract] unsupported expression kind …` reasons → matches this plan. `ls www/src/registry/__generated__/publishables | wc -l` → 57 (56 components + index.ts). If the skip list differs, STOP.

### Step 2: Capture styles configs in `createStyles`

In `www/src/modules/core/styles.tsx`, next to the existing `enumVarsRegistry`/`scalarVarsRegistry` (lines ~51–55), add a module-scoped `const capturedStylesConfigs = new Map<string, unknown>()`. Inside `createStyles(meta, config)` (find the function below the `/* --- createStyles --- */` marker at line ~414), record `capturedStylesConfigs.set(meta.name, config)` before returning. Export a getter:

```ts
/** Build-time hook: raw config object as authored, captured at module load. */
export function getCapturedStylesConfig(name: string): unknown {
  return capturedStylesConfigs.get(name)
}
```

Keep it always-on (it holds references to objects that exist anyway; no measurable cost).

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Create the evaluation fallback

Create `www/src/publisher/build-time/evaluate-config.ts`:

- `export async function evaluateStylesConfig(componentName: string, stylesTsPath: string): Promise<StylesConfig>`
- Implementation: `await import(pathToFileURL(stylesTsPath).href)` (import `pathToFileURL` from `node:url`), then `getCapturedStylesConfig(componentName)` from `@/modules/core/styles`. Throw with a clear `[publisher/evaluate]`-prefixed message if nothing was captured (e.g. the file doesn't call `createStyles` or `meta.name` mismatches).
- Validate the captured value before returning it: deep-walk and assert every leaf is `string | number | boolean | null | undefined` and every node is a plain object/array (i.e. `JSON.parse(JSON.stringify(v))` deep-equals `v`). At build time, runtime values like `tokens({ h: 6 })` and `fieldStyles().field()` have already evaluated to strings, so a failure here means a component author put something non-serializable in a config — throw, listing the offending path.
- Return it typed as `StylesConfig` (import the type from `../types` like `build-publishables.ts:17` does).

**Verify**: `pnpm typecheck` → exit 0.

### Step 4: Wire the fallback into `buildOne`

In `www/src/publisher/build-time/build-publishables.ts`, change the styles-config resolution at lines 176–178 from `extractStylesConfig(stylesTsPath)` to: try `extractStylesConfig` first; on throw, fall back to `await evaluateStylesConfig(meta.name, stylesTsPath)` and `console.log` one line noting the component used the evaluate path. AST extraction stays primary so the 56 existing publishables are byte-stable by construction.

**Verify**: `pnpm build:registry` → exit 0, output now shows `0 skipped` (no "component(s) skipped" block), and four new files exist: `ls www/src/registry/__generated__/publishables/{input,otp-field,progress-bar,slider}.ts` → all four listed.

### Step 5: Confirm existing publishables are unchanged

**Verify**: `git status --short www/src/registry/__generated__/publishables/` → shows exactly 4 added files plus a modified `index.ts` (and `git diff www/src/registry/__generated__/publishables/index.ts` shows only the four new entries in `publishables` and `PUBLISHABLE_NAMES`). Any modification to a pre-existing `<name>.ts` is a STOP condition. Also spot-check content: `grep -c "border-border-field" www/src/registry/__generated__/publishables/input.ts` → ≥ 1 (the outline field shell made it into the config), and `grep -c "%%TV_CONFIG%%" www/src/registry/__generated__/publishables/input.ts` → ≥ 1 (template placeholder present, pre-resolution).

### Step 6: Make unexpected skips fail the build

In `www/scripts/registry-build.ts`, above `buildShadcnPublishables()`, add an `EXPECTED_PUBLISHABLE_SKIPS = new Set<string>([])` with a doc comment in the same style as `ORPHAN_ALLOWLIST` (lines 377–403) explaining: a name listed here may skip publishable generation without failing the build; everything else must build. In `buildShadcnPublishables()`, after the existing logging, throw an `Error` listing name+reason for every skipped entry not in the set (the existing `main()` catch at lines 659–662 already turns a throw into exit 1).

**Verify**: `pnpm build:registry` → still exits 0. Then prove the guard works: temporarily rename `www/src/registry/ui/input/styles.ts`'s `outlineField` const ONLY at its definition site (creating an unresolvable identifier), run `pnpm build:registry` → exits non-zero mentioning `input`; revert the temporary edit (`git checkout -- www/src/registry/ui/input/styles.ts`), rerun → exit 0.

### Step 7: Wire `assertPlaceholderInTemplate`

In `build-publishables.ts`, inside `buildOne()`'s template mapping (lines 185–193), after `transformBase(...)` returns, call `assertPlaceholderInTemplate(meta.name, template)` — but only when `hasStyles` is true. First read `www/src/publisher/build-time/transform-base.ts` to confirm the placeholder is unconditionally injected for styles-bearing components; if you find a legitimate styles-bearing case where the placeholder is intentionally absent, do not add the call — note it in your report instead (this sub-step is a guard, not a behavior change).

**Verify**: `pnpm build:registry` → exit 0, still 0 skipped.

### Step 8: Tests

Two additions (model the structure on the existing `www/src/publisher/build-time/build.spec.ts`):

1. In `build.spec.ts`: a test that `evaluateStylesConfig('input', <abs path to ui/input/styles.ts>)` resolves and the result contains `params.style.outline.slots.inputGroup` including the substring `border-border-field`, and one asserting `slider`'s `base.slots.root` is a non-empty string.
2. New `www/src/publisher/build-time/styles-extraction-sweep.spec.ts`: for **every** directory under `www/src/registry/ui/*/` that has a `styles.ts`, assert `extractStylesConfig` succeeds OR `evaluateStylesConfig` succeeds (try/catch the first). This is the regression net for the whole registry — a future component using unsupported constructs fails tests, not just the build.

**Verify**: `pnpm test` → all pass, including the new tests.

## Test plan

- New tests as in Step 8 (evaluate-path happy cases for `input` and `slider`; all-components extraction sweep).
- Existing `publish.spec.ts` (19 tests) and `build.spec.ts` (8 tests) must stay green untouched — they lock the behavior of the 56 previously-working components.
- Final: `pnpm test` → all pass; `pnpm typecheck` → exit 0; `pnpm check` → exit 0.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm build:registry` exits 0 and prints no "component(s) skipped" block
- [ ] `ls www/src/registry/__generated__/publishables/{input,otp-field,progress-bar,slider}.ts` lists all four files
- [ ] `git diff 0da0afa3 --stat -- www/src/registry/__generated__/publishables` shows only 4 added files + `index.ts` modified
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm check` all exit 0
- [ ] Guard proven: an artificially broken `styles.ts` makes `pnpm build:registry` exit non-zero (Step 6 verify)
- [ ] Regenerated `__generated__/*` artifacts are committed (CI registry-drift job diffs them)
- [ ] `docs/plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Importing a `styles.ts` module under tsx/vitest throws (e.g. a browser-API access at module top level somewhere in its import graph) — the evaluate approach needs a different loading strategy; report the exact import chain.
- Step 5 shows any pre-existing publishable changed content — the fallback leaked into the primary path.
- The captured config fails JSON-serializability for any of the four components.
- The skip list at Step 1 differs from `input, otp-field, progress-bar, slider` (the codebase drifted; the plan's premise changed).
- Step 7's placeholder assert fires for a component that legitimately has no placeholder.

## Maintenance notes

- The publisher has a planned rewrite (per CLAUDE.md). This plan deliberately adds the smallest possible surface: capture hook + fallback + guard. The rewrite should subsume `extract-config.ts` and `evaluate-config.ts` into one evaluation path; the fail-loud guard and the sweep test should survive the rewrite.
- Reviewers should scrutinize: the generated `input.ts` publishable diff (it is large — the input config has many slots/params), and that `createStyles`' capture map cannot collide on `meta.name` (names are unique per the registry integrity check in `registry-build.ts`).
- Deferred: docs pages exist for `input-group`, `text-area`, `tree`, `pagination`, `header`, `heading` which have ui/ folders but no `meta.ts`/registration at all — that's a separate product decision (see audit notes in `docs/plans/README.md`), not part of this fix.
