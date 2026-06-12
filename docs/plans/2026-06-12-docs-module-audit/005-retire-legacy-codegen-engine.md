# Plan 005: Retire the legacy playground codegen engine (SourceFirst is fully migrated)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- www/src/modules/docs/interactive-demo www/src/modules/docs/mdx-plugins/rehype-transform.ts www/content/docs`
> On any drift, compare excerpts below against live code; mismatch = STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW-MED (pure deletion of a dead path, but it spans three files and the rehype default)
- **Depends on**: none (conflicts softly with plan 002 — both edit `rehype-transform.ts`; whichever lands second reconciles a few lines)
- **Category**: tech-debt
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

The interactive playground has two code-generation engines. The doc comment in `interactive-demo.tsx` says the legacy one is "Kept until every demo migrates" — **migration is complete**: all 44 `<InteractiveDemo>` uses across `www/content/docs/components/*.mdx` declare `engine="source"` (44 occurrences of each, exact 1:1 at the planned-at commit). The legacy path — `element-to-code.ts` (513 lines, including a ~235-line hand-maintained `COMPONENT_IMPORT_MAP` that silently rots) — never executes for any current page, yet ships in the client bundle of every playground page and remains the *default* engine in the rehype plugin (`engine ?? 'legacy'`), so any author who forgets the attribute silently gets the worse, unmaintained path. Deleting it removes ~600 lines of dead-in-practice runtime code, shrinks playground chunks, and eliminates the import-map staleness hazard (audit finding TEST-02 — "test element-to-code" — is resolved by deletion instead).

## Current state

- Usage census (verify in Step 1): `grep -o "<InteractiveDemo" www/content/docs/components/*.mdx | wc -l` → 44; `grep -o 'engine="source"' www/content/docs/components/*.mdx | wc -l` → 44.

- `www/src/modules/docs/interactive-demo/interactive-demo.tsx` — the component. Engine selection:

  ```tsx
  // lines 20, 23-33
  import { elementToCode, elementToPreviewCode } from './element-to-code'
  /**
   * Code generation has two engines, selected per demo:
   *  - SourceFirst (`codeTemplate` present): …
   *  - Legacy (`codeTemplate` absent): the playground is called as a plain function
   *    and its element tree serialized. Kept until every demo migrates.
   */
  ```

  Legacy branches at lines 102–126 (`propsForCode` — built ONLY for legacy serialization), 151–167:

  ```tsx
  // --- Legacy code generation (only when no template) ---
  const renderedElement = useMemo(() => {
    if (codeTemplate) return null
    const PlaygroundFn = Playground as (props: Record<string, unknown>) => React.ReactElement
    return PlaygroundFn(propsForCode)
  }, [Playground, propsForCode, codeTemplate])
  const legacyOutput = useMemo(() => (renderedElement ? elementToCode(renderedElement) : null), [renderedElement])
  const legacyPreview = useMemo(() => (renderedElement ? elementToPreviewCode(renderedElement) : ''), [renderedElement])

  // Displayed code depends on engine + expanded state.
  const displayedCode = codeTemplate
    ? ((isExpanded ? sourceExpanded : sourceCollapsed) ?? '')
    : isExpanded
      ? (legacyOutput?.full ?? '')
      : legacyPreview
  ```

  Note `codeTemplate?: CodeTemplate` is optional in `InteractiveDemoProps` (line 45).

- `www/src/modules/docs/interactive-demo/element-to-code.ts` (513 lines) — the legacy serializer + `COMPONENT_IMPORT_MAP` (lines ~25–260). **Sole importer**: `interactive-demo.tsx:20` (verified via `grep -rn "element-to-code" www/src --include="*.ts*"`).

- `www/src/modules/docs/mdx-plugins/rehype-transform.ts` — collection block (~lines 150–160):

  ```ts
  } else if (node.name === 'InteractiveDemo') {
    const name = extractNameAttribute(node)
    const controls = extractControlsAttribute(node)
    const engine =
      (extractStringAttribute(node, 'engine') as 'source' | null) ?? 'legacy'
    const file = extractStringAttribute(node, 'file') ?? undefined
    if (name && controls) {
      interactiveDemoNodes.push({ node, name, controls, engine, file })
    }
  }
  ```

  Downstream, `processInteractiveDemoNode` branches on `engine` (only `'source'` builds a `codeTemplate` via `buildSourceOverlay`). Read that function before editing — the legacy branch there must go too.

- Related but **kept**: `www/src/modules/docs/codegen/source-overlay.ts` + `code-template.ts` (the SourceFirst engine, spec-covered by `source-overlay.spec.ts`), and `process-controls.ts` (controls inference — used by both engines' metadata path; check its imports before assuming any of it is legacy-only).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0 |
| Tests | `pnpm test` | all pass (incl. `source-overlay.spec.ts`) |
| Lint/format | `pnpm check` | exit 0 |
| Full build | `pnpm --filter www build` | exit 0 — this compiles all MDX and is the real gate |
| Dev server | `pnpm dev:www` | playgrounds render |

## Scope

**In scope**:
- `www/src/modules/docs/interactive-demo/element-to-code.ts` (delete)
- `www/src/modules/docs/interactive-demo/interactive-demo.tsx` (remove legacy branches; make `codeTemplate` required)
- `www/src/modules/docs/interactive-demo/types.ts` / `index.ts` (only if they export legacy-only types/symbols)
- `www/src/modules/docs/mdx-plugins/rehype-transform.ts` (engine handling)
- `www/content/docs/components/*.mdx` — ONLY if you choose the "drop the attribute" option in Step 4, and then only the `engine="source"` attribute lines.

**Out of scope**:
- `www/src/modules/docs/codegen/**` — the SourceFirst engine stays untouched.
- `www/src/modules/docs/interactive-demo/process-controls.ts` and `controls.tsx` — unless a symbol is provably legacy-only (grep both directions before touching; report rather than guess).
- `www/src/modules/docs/demo.tsx` / `example.tsx` / `mdx-plugins/transformer.ts` — the static `<Demo>`/`<Example>` path is a *different* feature that legitimately uses `transformer.ts`; it is NOT the legacy playground engine. Do not delete it.

## Git workflow

- Branch: `advisor/005-retire-legacy-engine`.
- Conventional commits, e.g. `refactor(www): retire legacy playground codegen engine`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-verify the census

```sh
grep -o "<InteractiveDemo" www/content/docs/components/*.mdx | wc -l
grep -o 'engine="source"' www/content/docs/components/*.mdx | wc -l
grep -rn "element-to-code" www/src --include="*.ts*"
```

**Verify**: first two counts are equal; the only `element-to-code` import is `interactive-demo.tsx`. If counts differ, STOP — a legacy-engine demo exists; list it.

### Step 2: Make SourceFirst the only engine in the rehype plugin

In `rehype-transform.ts`: remove the `engine` attribute handling — every `InteractiveDemo` node is processed as SourceFirst. If `processInteractiveDemoNode` has a legacy branch (no-template path), delete it; a node that cannot build a `codeTemplate` becomes an error (today: `console.error` + null; if plan 002 already landed, it's an aggregated throw — either way, no silent legacy fallback). Keep accepting and ignoring a stray `engine` attribute in MDX for now (Step 4 decides whether to strip the attribute from content).

**Verify**: `pnpm --filter www build` → exit 0 (all 44 playgrounds compile through the SourceFirst path — they already did).

### Step 3: Remove the legacy runtime path

In `interactive-demo.tsx`:
- Delete the import on line 20 and the legacy `useMemo` blocks (lines ~151–167) and the `propsForCode` memo (lines ~102–126) **if** nothing else consumes it (grep within the file).
- `displayedCode` becomes `(isExpanded ? sourceExpanded : sourceCollapsed) ?? ''`.
- Change `codeTemplate?: CodeTemplate` to required `codeTemplate: CodeTemplate`, and update the doc comment (lines 23–33) to describe the single engine.
- Delete `element-to-code.ts`.
- Fix any `index.ts`/`types.ts` exports that referenced deleted symbols.

**Verify**: `pnpm typecheck` → exit 0. If the now-required `codeTemplate` breaks a call site, inspect it: the only legitimate constructor is the rehype-injected one — any other call site is undiscovered legacy usage → STOP and report it.

### Step 4: Decide the MDX attribute's fate (pick A unless plan 002 landed first)

- **Option A (default)**: leave `engine="source"` in MDX as inert (rehype ignores it). Zero content churn; the attribute documents intent until someone sweeps it.
- **Option B (only if plan 002's content spec exists)**: remove the 44 `engine="source"` attributes via a careful search-replace across `www/content/docs/components/*.mdx`, and drop the spec's "every InteractiveDemo declares engine" assertion if plan 002 added one. Keep the diff purely attribute-line deletions.

**Verify**: `pnpm --filter www build` → exit 0 either way.

### Step 5: Visual spot-check

`pnpm dev:www`; load `/docs/components/button` and `/docs/components/select`:
- Playground renders; toggling a control updates BOTH the preview and the code block.
- The expand/collapse code toggle works (collapsed and expanded variants render).

**Verify**: no console errors; code output reacts to controls.

### Step 6: Gates

```sh
pnpm test && pnpm check && pnpm typecheck
```

**Verify**: all exit 0; `source-overlay.spec.ts` still green.

## Test plan

No new tests: the deleted path was untested dead code, and the surviving engine is already pinned by `www/src/modules/docs/codegen/source-overlay.spec.ts` (426 lines — real invariants over template fill, default omission, indentation). The build compiling all 44 playgrounds plus Step 5's interaction check is the behavioral gate.

## Done criteria

- [ ] `ls www/src/modules/docs/interactive-demo/element-to-code.ts` → file does not exist
- [ ] `grep -rn "elementToCode\|elementToPreviewCode\|COMPONENT_IMPORT_MAP\|'legacy'" www/src/modules/docs/` → no matches
- [ ] `codeTemplate` is a required prop of `InteractiveDemo`
- [ ] `pnpm --filter www build`, `pnpm typecheck`, `pnpm test`, `pnpm check` all exit 0
- [ ] Playground interaction verified on ≥2 pages (Step 5)
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

- Step 1 census mismatch (a demo without `engine="source"` exists).
- Any importer of `element-to-code` beyond `interactive-demo.tsx`.
- `processInteractiveDemoNode`'s structure differs materially from "branches on engine" (e.g. the `file` attribute drives a second legacy variant) — report what the `file` attribute actually does before deleting anything.
- Making `codeTemplate` required breaks a call site other than the rehype-injected one.
- A demo's playground visually breaks in Step 5.

## Maintenance notes

- After this lands, "add a playground" has exactly one path: author the demo file under `www/src/registry/ui/<c>/demos/`, reference it from MDX — the rehype plugin builds the template or errors. The PR should say this explicitly for future authors.
- Plan 002 and this plan both touch the `InteractiveDemo` collection block in `rehype-transform.ts`; second-lander reconciles (~5 lines).
- Deferred deliberately: unifying the import-path rewriting between `source-overlay.ts` (`rewriteImportPath` from the publisher) and anything else — the publisher rewrite (already planned at repo level) is the right home for that abstraction.
