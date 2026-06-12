# Plan 001: Shrink reference typeLinks payloads and make generator output machine-independent

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- www/scripts/api-docs-builder www/src/modules/references www/src/modules/docs/reference.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf + dx
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

The API-reference generator (`pnpm build:references`) serializes entire TypeScript stdlib interfaces into its output: of the ~2.8 MB (compact) of reference data, ~1.5 MB is the `typeLinks` field and ~0.9 MB of that is recursive dumps of `lib.dom.d.ts` / `lib.es*.d.ts` interfaces (one serialized `HTMLInputElement` is ~270 KB). Because each docs page inlines its reference data as a `JSON.parse("…")` literal, the worst pages ship ~360 KB client chunks that are mostly a dump of `HTMLInputElement`. Separately, `typeLinks` ids embed absolute machine paths (`/Users/<name>/Desktop/dotUI/node_modules/.pnpm/typescript@…`), which leaks local paths into shipped JS and makes the generator's output machine-dependent — this is the documented cause of "running `build:references` rewrites ~121 files" (see `docs/research/2026-06-11-docs-build-memory.md`, which measured all of this). Fixing the skip predicate, the id format, and two dead fields shrinks the worst docs chunks ~3–4× and makes generator output reproducible across machines.

## Current state

- `www/scripts/api-docs-builder/src/config.ts` — generator config. Lines 22–56 define a **name-based** skip set:

  ```ts
  // config.ts:22
  export const SKIP_RESOLVE_TYPES = new Set([
    // DOM types
    'Window', 'Document', 'Element', 'HTMLElement', 'SVGElement', 'Node',
    'EventTarget', 'Navigator',
    // DOM Events (native)
    'Event', 'MouseEvent', 'KeyboardEvent', /* … */
  ])
  ```

  Concrete element interfaces (`HTMLInputElement`, `HTMLDivElement`, `HTMLTextAreaElement`, …) and `Intl.*` types are **not** in the set, so the resolver serializes their full interface graphs.

- `www/scripts/api-docs-builder/src/componentHandler.ts:436` — the only consumer of the set on the resolve path:

  ```ts
  if (SKIP_RESOLVE_TYPES.has(typeName)) return false
  ```

  Lines 621–637 assemble the per-component `typeLinks` from `astContext.links` (keys sorted for deterministic output).

- `www/scripts/api-docs-builder/src/type-to-ast.ts:438-439` — the id format that embeds absolute paths:

  ```ts
  const sourceFile = decl.getSourceFile()
  return `${sourceFile.fileName}:${symbol.getName()}`
  ```

  `sourceFile.fileName` is an absolute path like `/Users/<name>/Desktop/dotUI/node_modules/.pnpm/typescript@6.0.3/node_modules/typescript/lib/lib.dom.d.ts`. Also relevant: `type-to-ast.ts:477-478` checks `fileName.includes('node_modules') || fileName.includes('.d.ts')`.

- `www/src/modules/references/generated/` — 183 generated JSONs. Current measured state (verify yourself in Step 1): `color-field.json` 735 KB with 120 occurrences of `/Users/mehdibenhadjali`; `number-field.json` 694 KB; `context-menu.json` 624 KB.

- `www/src/modules/references/transform.ts:103-126` — `transformProp` emits two fields nothing renders:

  ```ts
  return {
    name: propName,
    type: fullType,                                        // ← dead
    typeHighlighted: highlightCode(fullType, highlighter), // ← dead
    shortType,
    shortTypeHighlighted: highlightCode(shortType, highlighter),
    typeAst: prop.typeAst,
    default: prop.default,
    defaultHighlighted: prop.default ? highlightCode(prop.default, highlighter) : undefined,
    description: prop.description,
    required: prop.required,
  }
  ```

- `www/src/modules/docs/reference.tsx` — the only renderer of transformed props. It reads `prop.shortTypeHighlighted` (line 168), `prop.defaultHighlighted ?? prop.default` (lines 178, 225), and `prop.typeAst` (line 216). It never reads `prop.type` or `prop.typeHighlighted`.

- **Why skipping stdlib types is safe**: `www/src/modules/references/components/type-renderer.tsx` degrades gracefully when an id is missing from `links` — lines 520–524:

  ```tsx
  const linkedType = links[id]
  if (!linkedType) {
    return <span className={styles.variable}>{name}</span>
  }
  ```

  and it already has a curated `DOC_LINKS` map (line 252) with a `globals-docs` MDN fallback (`getDocLink`, lines 299–305) for exactly these built-in types. An MDN link is strictly better UX than an inline 270 KB interface dump.

- **Sanctioned use of `build:references`**: `CLAUDE.md` warns "Never run `pnpm build:references` to fix one field" because of this exact drift problem. This plan **fixes the generator itself**, so regenerating all 183 JSONs is the intended outcome here, not drift. Expect a large diff in `www/src/modules/references/generated/` — that is the point.

## Commands you will need

| Purpose | Command (from repo root) | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Regenerate references | `pnpm --filter www build:references` | exit 0, rewrites JSONs under `www/src/modules/references/generated/` |
| Typecheck | `pnpm typecheck` | exit 0 (note: runs `build:registry` first; slow but expected) |
| Tests | `pnpm test` | all pass |
| Lint/format | `pnpm check` | exit 0 (`pnpm check:fix` to auto-fix) |

## Scope

**In scope** (the only files you should modify):
- `www/scripts/api-docs-builder/src/config.ts`
- `www/scripts/api-docs-builder/src/componentHandler.ts`
- `www/scripts/api-docs-builder/src/type-to-ast.ts`
- `www/src/modules/references/transform.ts`
- `www/src/modules/references/types.ts` (if the dead fields are typed there)
- `www/src/modules/references/generated/*.json` (regenerated output — commit it)
- `www/scripts/api-docs-builder/src/output-invariants.spec.ts` (create — see Test plan)

**Out of scope** (do NOT touch, even though they look related):
- `www/src/modules/docs/reference.tsx` and `www/src/modules/references/components/*` — renderers already handle missing links; no change needed.
- `www/src/modules/docs/mdx-plugins/rehype-transform.ts` — plan 002's territory.
- `www/src/registry/**` — registry source; the generator only reads it.
- `www/scripts/api-docs-builder/src/order.json` — prop ordering, unrelated.

## Git workflow

- Branch: `advisor/001-references-typelinks` off the current branch.
- Conventional commits, e.g. `fix(www): skip stdlib types in reference typeLinks` and `chore(www): regenerate reference JSONs`. Keep the generator change and the regeneration in separate commits so the mechanical diff is reviewable.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Record the baseline

Measure current state so the win is provable:

```sh
ls -la www/src/modules/references/generated/ | sort -k5 -rn | head -5
grep -c "/Users/" www/src/modules/references/generated/color-field.json
du -sh www/src/modules/references/generated/
```

**Verify**: `color-field.json` is ~735 KB and the grep count is >0 (≈120). Record all three outputs in your report.

### Step 2: Make the skip predicate path-based

In `www/scripts/api-docs-builder/src/type-to-ast.ts`, find where a type's declaration is resolved into `links` (the resolve decision feeding `componentHandler.ts:436`'s name check). Add a **source-file predicate**: a type whose declaration lives in a TypeScript stdlib file must not be resolved into `typeLinks`:

```ts
function isStdlibDeclaration(fileName: string): boolean {
  // matches lib.dom.d.ts, lib.es2015.d.ts, lib.esnext.*.d.ts, …
  return /\/typescript\/lib\/lib\.[^/]*\.d\.ts$/.test(fileName)
}
```

Wire it in wherever the resolve decision is made (alongside, not replacing, the existing `SKIP_RESOLVE_TYPES` name check — the name set still covers React types etc.). Keep `SKIP_RESOLVE_TYPES` itself unchanged except for a comment noting stdlib types are now excluded by path.

**Verify**: `pnpm --filter www build:references` exits 0, then
`grep -c "HTMLInputElement" www/src/modules/references/generated/color-field.json` → a small number (single digits — name mentions in prop type strings remain; the serialized interface graph is gone), and `ls -la` shows `color-field.json` well under 150 KB.

### Step 3: Make typeLinks ids package-relative

In `www/scripts/api-docs-builder/src/type-to-ast.ts:438-439`, normalize the id:

```ts
const sourceFile = decl.getSourceFile()
return `${normalizeSourcePath(sourceFile.fileName)}:${symbol.getName()}`
```

with:

```ts
function normalizeSourcePath(fileName: string): string {
  // node_modules file → path relative to the *innermost* node_modules,
  // which drops machine prefix AND .pnpm version segments:
  //   /…/node_modules/.pnpm/typescript@6.0.3/node_modules/typescript/lib/lib.dom.d.ts
  //   → typescript/lib/lib.dom.d.ts
  const marker = '/node_modules/'
  const last = fileName.lastIndexOf(marker)
  if (last !== -1) return fileName.slice(last + marker.length)
  // repo file → path relative to repo root
  return path.relative(process.cwd(), fileName)
}
```

Check whether `type-to-ast.ts` (or `componentHandler.ts`) parses these ids anywhere (e.g. splitting on `:` or re-checking `.includes('node_modules')` on an id rather than a fileName). The runtime side (`type-renderer.tsx`) treats ids as opaque map keys, so format changes are safe there — but the generator must be internally consistent: ids in `typeAst` references and keys of `typeLinks` must use the same normalization.

**Verify**: `pnpm --filter www build:references` exits 0, then
`grep -rc "/Users/" www/src/modules/references/generated/ | grep -v ":0"` → no output (zero files contain absolute paths).

### Step 4: Remove the dead `type` and `typeHighlighted` fields

In `www/src/modules/references/transform.ts:103-126`, delete the `type: fullType` and `typeHighlighted: highlightCode(fullType, highlighter)` properties from the returned object (keep `fullType` if it feeds `shortType` computation; otherwise remove it too). Remove the fields from the `TransformedProp` interface (in `transform.ts` or `www/src/modules/references/types.ts` — find it with `grep -rn "typeHighlighted" www/src/modules/references/`).

Before deleting, confirm nothing else reads them:

```sh
grep -rn "typeHighlighted\b" www/src --include="*.ts*" | grep -v transform.ts
grep -rn "prop\.type\b" www/src/modules/docs www/src/modules/references --include="*.tsx"
```

**Verify**: both greps return no consuming sites; `pnpm typecheck` exits 0.

### Step 5: Regenerate everything and run the full gates

```sh
pnpm --filter www build:references
pnpm typecheck
pnpm test
pnpm check
```

**Verify**: all exit 0. Then re-measure: `du -sh www/src/modules/references/generated/` → expect roughly 2–3 MB lower than Step 1's baseline; `ls -la … | sort -k5 -rn | head -5` → former top-3 files dramatically smaller.

### Step 6: Spot-check rendering

Start the dev server (`pnpm dev:www` — run `pnpm build:registry` first if this is a fresh worktree) and load `/docs/components/color-field` and `/docs/components/number-field`:

- The API reference table renders.
- Clicking a type that previously inlined (e.g. a prop typed with a render-props interface) still opens its popover.
- A stdlib type name (e.g. `HTMLInputElement` if visible in a type signature) renders as plain styled text or an MDN link — not a broken popover, no console errors.

If browser preview tooling is unavailable, render-test via `pnpm --filter www build` exiting 0 and note the manual check as not performed.

**Verify**: no client console errors on those two pages.

## Test plan

Create `www/scripts/api-docs-builder/src/output-invariants.spec.ts` (vitest picks up `*.spec.ts` repo-wide; model the file header after `www/src/modules/docs/codegen/source-overlay.spec.ts`). It reads the **committed** generated JSONs (no generator execution in tests) and asserts:

1. No file under `www/src/modules/references/generated/` contains the substring `/Users/` or `\\Users\\` (machine paths).
2. No file contains `node_modules/.pnpm` (version-pinned paths).
3. No `typeLinks` key resolves a stdlib type: no key matching `^typescript/lib/lib\.` (they should be skipped entirely now, not just renamed).
4. A size budget: no single generated JSON exceeds 200 KB (today's worst legitimate file after the fix should be well under; this pins the regression).
5. Every prop object has no `type` / `typeHighlighted` keys — guards the dead fields from returning. (Skip this assertion if the generated JSONs never contained them — they're added at MDX-compile time by `transform.ts`, not the generator. Check one JSON first; if absent there, instead assert in a small unit test that `transformProp`'s return object lacks the keys, importing `transformReference` from `www/src/modules/references/transform.ts` with a stub highlighter — see how `source-overlay.spec.ts` builds fixtures.)

Verification: `pnpm test` → all pass, including the new spec.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -rl "/Users/" www/src/modules/references/generated/` → no matches
- [ ] `ls -la www/src/modules/references/generated/color-field.json` → < 150 KB
- [ ] `grep -rn "typeHighlighted" www/src/modules/references/transform.ts` → no matches
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm check` all exit 0
- [ ] New `output-invariants.spec.ts` exists and passes
- [ ] Running `pnpm --filter www build:references` twice in a row produces zero diff (`git status --porcelain` clean after the second run) — output is now deterministic on this machine
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

Stop and report back (do not improvise) if:

- `type-to-ast.ts:438-439` doesn't match the excerpt (id format already changed).
- After Step 2, `color-field.json` is still > 300 KB — the serialization has a second driver this plan didn't identify; report what the largest `typeLinks` entries are.
- Ids are parsed structurally somewhere (split on `/` or matched against absolute-path patterns) such that normalization breaks popover navigation — report the parsing site instead of patching around it.
- The regeneration diff touches files **outside** `www/src/modules/references/generated/` — the generator writes somewhere this plan didn't map.
- `pnpm --filter www build:references` fails before any change (pre-existing breakage — possibly the `typescript-api-extractor@1.0.0-beta.4` pin; see the audit README).

## Maintenance notes

- Cross-machine determinism can't be fully proven from one machine; the committed invariant spec (no `/Users/`, no `.pnpm`) is the proxy. The first regeneration by a *different* contributor is the real test — reviewer should watch that diff.
- If a dependency bump changes react-aria type shapes, `build:references` diffs will now be *semantic only* — that's the desired signal. Don't reintroduce environment-dependent fields.
- Deferred (out of scope here): moving reference data out of MDX modules into the route loader (option 2 in `docs/research/2026-06-11-docs-build-memory.md`) — re-evaluate only if page weight still matters after this lands. RSC was evaluated and deferred (option 3, same doc).
- Reviewer focus: Step 3's normalization must apply to *every* id-producing site (grep `getSourceFile().fileName` in `type-to-ast.ts` / `componentHandler.ts`), or ids in `typeAst` and keys in `typeLinks` desync and popovers silently stop opening.
