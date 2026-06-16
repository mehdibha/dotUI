# Plan 002: Docs build fails loud on broken demos/references + content-integrity spec

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- www/src/modules/docs/mdx-plugins www/src/modules/docs/components-list/components-data.ts www/content/docs`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (a throw in the MDX pipeline can fail builds — that is the goal, but it must not fire on healthy content)
- **Depends on**: none (see conflict note with plan 005 in Dependency notes of the audit README)
- **Category**: tests + dx
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

The rehype plugin that powers every docs page (`<Demo>`, `<Example>`, `<Reference>`, `<InteractiveDemo>`) swallows all failures: a demo whose registry file is missing, a reference whose JSON doesn't exist, or a node missing its `name` attribute is logged with `console.error` (or silently skipped) and the build **succeeds**. The un-transformed node is left in the tree and renders as a broken/empty component at runtime. Authors only find out by visiting the page. Additionally, the components gallery (`components-data.ts`) is hand-maintained with no check that its entries point at real docs pages, or that every component page appears in the gallery. This plan makes the MDX build fail loudly on broken content and adds a vitest spec that pins MDX ↔ registry ↔ gallery integrity so `pnpm test` catches drift without a full build.

## Current state

- `www/src/modules/docs/mdx-plugins/rehype-transform.ts` (813 lines) — the build-time MDX transform. Three silent-failure sites:

  1. **Collection guards** (~lines 127–160): nodes without a usable `name` are silently ignored:

     ```ts
     visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElementHast) => {
       if (node.name === 'Demo' || node.name === 'Example') {
         const name = extractNameAttribute(node)
         if (name) {           // ← no name → node silently skipped
           …
       } else if (node.name === 'Reference') {
         const name = extractNameAttribute(node)
         if (name) {           // ← same
           referenceNodes.push({ node, name })
         }
       } else if (node.name === 'InteractiveDemo') {
         …
         if (name && controls) {  // ← missing controls also silently skipped
     ```

  2. **Per-node catch** (`processDemoNode`, ~lines 303–310; `processReferenceNode` and `processInteractiveDemoNode` have the same shape):

     ```ts
     } catch (error) {
       console.error(`[rehype-transform] Failed to process demo "${info.name}":`, error)
       return null
     }
     ```

  3. **Filter of nulls** (~lines 197–205):

     ```ts
     const successfulDemos = processedDemos.filter((d): d is ProcessedDemo => d !== null)
     ```

     Failed nodes are never transformed; the raw `<Demo name="x">` element stays in the HAST. At runtime, `mdx-components.tsx` maps `Demo`/`Reference`/`InteractiveDemo` to real components (lines 155+, 23–24), so the component mounts **without** its build-time-injected props — a broken empty shell, no error.

- **Current content is healthy** (verified at planned-at commit): all `<Demo>`/`<Example>` names resolve to files under `www/src/registry/ui/`, and all `<Reference>` names resolve to JSONs in `www/src/modules/references/generated/`. Flipping to throw is safe today.

- `www/src/modules/docs/components-list/components-data.ts` (456 lines) — hand-written gallery data:

  ```ts
  export interface ComponentInfo {
    name: string
    slug: string
    href: string          // e.g. '/docs/components/button'
    scale?: number
    status: ComponentStatus  // 'pending' | 'in review' | 'done'
  }
  ```

  No automated check that `href` targets exist or that every content page has a gallery entry.

- `www/content/docs/components/` — 61 component MDX pages. There is **no** `components/meta.json` (fumadocs auto-includes the folder alphabetically); only `www/content/docs/meta.json` and `www/content/docs/(root)/meta.json` exist, both tiny and explicit. So "page missing from meta.json" is NOT a real failure mode for component pages — do not add a meta.json check for them.

- Demo name → file resolution rule (from `rehype-transform.ts`, `resolveDemoPath`): a name like `button/demos/default` maps to `<registryBasePath>/ui/button/demos/default.tsx`; in this repo that is `www/src/registry/ui/button/demos/default.tsx`. Reference name `X` maps to `www/src/modules/references/generated/X.json`.

- Existing spec to model after: `www/src/modules/docs/codegen/source-overlay.test.ts` (vitest, runs via root `pnpm test`; root `vitest.config.ts` aliases `@/` → `www/src/`).

## Commands you will need

| Purpose | Command (from repo root) | Expected on success |
|---|---|---|
| Tests | `pnpm test` | all pass |
| Typecheck | `pnpm typecheck` | exit 0 (runs `build:registry` first) |
| Lint/format | `pnpm check` | exit 0 |
| Full site build (the real gate for the throw) | `pnpm --filter www build` | exit 0; NODE has 8 GB heap flag built into the script |
| Dev server | `pnpm dev:www` (after `pnpm build:registry` in a fresh worktree) | serves localhost |

## Scope

**In scope** (the only files you should modify):
- `www/src/modules/docs/mdx-plugins/rehype-transform.ts`
- `www/src/modules/docs/docs-content.test.ts` (create)

**Out of scope** (do NOT touch, even though they look related):
- `www/src/modules/docs/codegen/source-overlay.ts` — separately spec'd engine; its `OverlayError`s already propagate into `processInteractiveDemoNode`'s catch, which this plan re-throws — no change needed inside it.
- `www/content/docs/**` — if the new checks reveal broken content, that's a STOP (report, don't silently "fix" content this plan didn't audit). Exception: none expected; content was verified healthy.
- `www/src/modules/docs/interactive-demo/**` and the `engine` default — plan 005's territory.
- `www/source.config.ts` — schema unchanged.
- Splitting rehype-transform into modules — explicitly deferred (see audit README, rejected/deferred findings).

## Git workflow

- Branch: `advisor/002-docs-fail-loud`.
- Conventional commits, e.g. `fix(www): fail docs build on unresolved demo/reference nodes` and `test(www): add docs content-integrity spec`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Write the content-integrity spec first (it documents the invariants)

Create `www/src/modules/docs/docs-content.test.ts`. It uses `node:fs` + `node:path` to read files relative to the repo root (compute the root from `import.meta.dirname`, like `vitest.config.ts` does — the spec lives at `www/src/modules/docs/`, so root is four levels up). Assertions:

1. **Demo/Example names resolve**: scan every `www/content/docs/**/*.mdx` for `name="…"` attributes on `<Demo`, `<Example` and `<InteractiveDemo` elements (a regex over raw MDX text is acceptable: `/<(Demo|Example|InteractiveDemo)\b[^>]*?name="([^"]+)"/gs` — but note attributes can be on separate lines, so match across newlines and verify the count: there are 44 `<InteractiveDemo` occurrences at planned-at commit). Each captured name `N` must satisfy `existsSync(repoRoot, 'www/src/registry/ui', N + '.tsx')` — except `InteractiveDemo` names, which refer to a component slug whose demo file is `www/src/registry/ui/<name>/demos/playground.tsx` — **verify the actual resolution rule for InteractiveDemo in `rehype-transform.ts` (`processInteractiveDemoNode` / the `file` attribute) before encoding it**, and encode what the code actually does.
2. **Reference names resolve**: every `<Reference name="X">` has `www/src/modules/references/generated/X.json`.
3. **Gallery ↔ content correspondence**: every `componentsData` entry's `href` of the form `/docs/components/<slug>` has a matching `www/content/docs/components/<slug>.mdx`; and every `components/*.mdx` file has a `componentsData` entry. If the second direction fails today (a deliberately ungalleried page), add an explicit `EXCLUDED_FROM_GALLERY` allowlist constant at the top of the spec with a comment, listing the current misses — do not weaken the assertion.
4. **Frontmatter completeness**: every component MDX has non-empty `title:` and `description:` in its frontmatter block (llms.txt and og meta consume both).

**Verify**: `pnpm test` → the new spec passes against current content (if any assertion fails, STOP — content is not as healthy as the audit found; report the failures).

### Step 2: Make collection misses loud

In `rehype-transform.ts`'s `visit` collection (lines ~127–160): when a `Demo`/`Example`/`Reference`/`InteractiveDemo` node yields no `name` (or `InteractiveDemo` yields no `controls`), throw:

```ts
throw new Error(
  `[rehype-transform] <${node.name}> is missing a literal ${missing} attribute` +
  `${file?.path ? ` in ${file.path}` : ''}`,
)
```

The rehype plugin signature is `(tree, file) => …` in unified — check the actual transformer signature in this file; if the `file` argument isn't currently destructured, add it (it's a `VFile`; `file.path` carries the MDX path under fumadocs-mdx — verify by temporarily logging it during `pnpm dev:www`, then remove the log).

**Verify**: `pnpm dev:www`, temporarily add `<Demo>` (no name) to `www/content/docs/(root)/index.mdx`, load `/docs` → dev overlay/console shows the new error naming the file. Revert the temporary edit (`git checkout -- "www/content/docs/(root)/index.mdx"`).

### Step 3: Make processing failures fatal, aggregated

Replace the silent-null pattern. Keep per-node catch (so all failures are collected, not just the first), but after the `Promise.all`s and *before* filtering (lines ~197–205), aggregate:

```ts
const failures: string[] = []
// in each catch: failures.push(`${info.type ?? node kind} "${info.name}": ${String(error)}`)
// after processing:
if (failures.length > 0) {
  throw new Error(
    `[rehype-transform] ${failures.length} docs node(s) failed to build:\n- ` +
    failures.join('\n- '),
  )
}
```

Implementation detail: the cleanest mechanical change is to have `processDemoNode`/`processReferenceNode`/`processInteractiveDemoNode` return a discriminated result (`{ok: true, value} | {ok: false, message}`) instead of `T | null`, then partition. Keep `console.error` for the detail/stack; the thrown message carries the summary list. Delete the now-unneeded null-filters.

**Verify**: temporarily change one demo name in `www/content/docs/components/button.mdx` to a nonexistent one (e.g. `button/demos/does-not-exist`), run `pnpm --filter www build` → build FAILS with the aggregated error naming the demo. Revert the temporary edit. Then run `pnpm --filter www build` again → exit 0.

### Step 4: Duplicate-control guard

In the same file, where `InteractiveDemo` controls are extracted (`extractControlsAttribute` / before `buildSourceOverlay` is called): if the controls array contains two entries with the same control name, include it in the same failure mechanism with the message `duplicate control "<name>" in <InteractiveDemo name="…">`. (Controls entries are either strings or objects with a `name` — read `extractControlsAttribute` to normalize before comparing.)

**Verify**: `pnpm test && pnpm typecheck && pnpm check` → all exit 0; full `pnpm --filter www build` → exit 0 on the untouched content.

## Test plan

- The content-integrity spec from Step 1 is the main new test surface (4 assertion groups; list of cases above).
- For the throw paths, prefer a small unit test if `rehype-transform`'s processors are exportable without refactor; if exporting them would mean restructuring the file, rely on the Step 2/3 manual fault-injection verifications instead and say so in the report — do not restructure the file for testability (deferred refactor, see audit README).
- Verification: `pnpm test` → all pass including the new spec; the two fault-injection checks (Steps 2–3) observed and reverted.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `www/src/modules/docs/docs-content.test.ts` exists; `pnpm test` exits 0
- [ ] `grep -n "return null" www/src/modules/docs/mdx-plugins/rehype-transform.ts` shows no remaining silent-failure returns in the three process functions (other legitimate `return null`s elsewhere in the file may remain — judge by enclosing function)
- [ ] Fault-injection: a bogus demo name fails `pnpm --filter www build` (observed once, then reverted; `git status` clean of content edits)
- [ ] `pnpm typecheck` and `pnpm check` exit 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

Stop and report back (do not improvise) if:

- Step 1's spec fails on current content — the audit's "content is healthy" premise is wrong; report which names/files fail and wait for direction.
- The rehype transformer cannot access the source file path (no usable `file` argument) — report; errors without file context are still acceptable, but flag the limitation rather than threading new plumbing through fumadocs config.
- `processInteractiveDemoNode`'s resolution rule for names/`file` attributes doesn't match what Step 1 needs to encode — report the actual rule; do not guess.
- The full `www` build fails for a reason unrelated to your change (pre-existing breakage).
- Plan 005 has already landed and the lines in "Current state" moved substantially — reconcile line numbers via the drift check; if the engine-default logic is gone entirely, adapt Step 2's InteractiveDemo guard to the new shape and note it.

## Maintenance notes

- This plan makes broken content a build failure. CI currently has no production-build job — repo-audit plan 002 (`docs/plans/2026-06-11-repo-audit/002-ci-build-and-registry-sweep.md`) adds one; until it lands, the throw protects local builds and deploys (Vercel runs `pnpm build`), and the vitest spec protects CI. Mention this pairing in the PR description.
- Plan 005 (legacy engine retirement) edits the same collection block in `rehype-transform.ts` (the `engine` default). Whichever lands second reconciles a few lines.
- Future MDX components added to the transform should join the same aggregate-failure mechanism — a reviewer should reject new `return null`-on-error processors.
