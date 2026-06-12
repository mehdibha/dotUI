# Plan 006: Slim the runtime shiki bundle (~10 MB of unused grammars in deploy output)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. This plan has an INVESTIGATE gate (Step 2) — if its findings
> contradict the approach, stop and report with the evidence rather than
> forcing the planned fix. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- www/src/modules/docs/dynamic-pre.tsx www/package.json`
> On any drift, compare excerpts below against live code; mismatch = STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED (touches the live code-highlighting path of all 44 playgrounds)
- **Depends on**: 003 recommended first (fumadocs version then stays fixed under this work)
- **Category**: perf
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

Playground code re-highlights client-side as users tweak controls — that is by design (`DynamicPre` → fumadocs `useShiki`). But the import chain ends in fumadocs-core's *full* shiki factory, which does `await import("shiki")` — the full bundle. The build therefore emits **every shiki grammar and theme** as chunks: ~8 MB of grammars + ~1.5 MB of themes in the nitro server output, plus hundreds of grammar chunks in the client build (measured in `docs/research/2026-06-11-docs-build-memory.md`; e.g. `emacs-lisp` 780 KB, `cpp` 626 KB). The docs only ever highlight `tsx`. Loading is lazy, so there's no cold-start hit — the cost is ~10 MB of dead deploy weight and chunk-graph pollution. Pinning the highlighter to a fine-grained core with one grammar and two themes removes nearly all of it.

## Current state

- `www/src/modules/docs/dynamic-pre.tsx:1-12` — the only runtime shiki entry point in `www/src`:

  ```tsx
  import { Suspense, useDeferredValue, useId } from 'react'
  import type { HighlightOptions } from 'fumadocs-core/highlight'
  import { useShiki } from 'fumadocs-core/highlight/client'
  ```

  `DynamicPre` is imported only by `interactive-demo.tsx` (playgrounds; 44 pages). Build-time highlighting (rehype, `<Demo>` HAST) is a separate path and out of scope.

- The chain (verified in `node_modules/.pnpm/fumadocs-core@16.8.11_*/node_modules/fumadocs-core/dist/highlight/shiki/full.js`):

  ```js
  // full.js:4 and :14
  const { createHighlighter, createJavaScriptRegexEngine } = await import("shiki");
  …
  const { createHighlighter, createOnigurumaEngine } = await import("shiki");
  …
  engine: createOnigurumaEngine(import("shiki/wasm"))
  ```

  `import("shiki")` = the full bundle (all grammars/themes as lazy chunks). The langs/themes the docs actually need at runtime: `tsx` (the only `lang` `DynamicPre` is ever given — confirm in Step 2) with `github-light`/`github-dark` themes (see `rehype-transform.ts` and `source.config.ts` theme usage).

- `shiki` is a direct dependency (`www/package.json`: `"shiki": "^4.0.2"`), so importing fine-grained entry points (`shiki/core`, `@shikijs/themes/*`, `@shikijs/langs/*` or `shiki/langs/tsx.mjs` — exact entry points depend on the installed shiki major; check its package.json `exports`) is available without new deps.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Full build | `pnpm --filter www build` | exit 0; emits `.output`/dist |
| Measure server output | `du -sh www/.output 2>/dev/null || du -sh www/.nitro 2>/dev/null` and `find www/.output -name "*shiki*" -o -name "*langs*" \| head -20` | locate grammar chunks (exact dir: whatever the build emits — find it, don't guess) |
| Typecheck / tests / lint | `pnpm typecheck` / `pnpm test` / `pnpm check` | exit 0 / pass / exit 0 |
| Dev server | `pnpm dev:www` | playground highlight works |

## Scope

**In scope**:
- `www/src/modules/docs/dynamic-pre.tsx`
- A new small module if needed, e.g. `www/src/modules/docs/highlighter.ts` (the fine-grained highlighter factory)

**Out of scope**:
- `www/src/modules/docs/mdx-plugins/rehype-transform.ts` and `www/source.config.ts` — build-time highlighting; already fine (build-time shiki cost is a non-issue post-Rolldown, per the research doc).
- fumadocs internals / patching `fumadocs-core` — if config can't redirect the factory, replace the hook locally instead (Step 3 option B).
- `www/vite.config.ts` chunk hacks (manual `external`/alias tricks) — brittle; only with operator approval.

## Git workflow

- Branch: `advisor/006-shiki-slim`.
- Conventional commit, e.g. `perf(www): pin playground highlighter to fine-grained shiki core`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Baseline measurement

`pnpm --filter www build`, then locate and record: total size of the server output dir, the size and count of shiki grammar/theme chunks (server + client `dist/assets`). Record exact numbers in your report.

**Verify**: you can name the files/dirs that constitute the ~10 MB (research doc: `_libs/shikijs__langs.mjs` ~8 MB + themes ~1.5 MB in nitro output; client `dist` has per-grammar chunks). If you cannot find them at all, STOP — the bundling may have changed since the research; report what you see.

### Step 2: INVESTIGATE — what does `useShiki` accept?

Read the installed `fumadocs-core/dist/highlight/` sources (`client.js`, `shiki/react.js`, `shiki/full.js`, `shiki/index.js`, plus their `.d.ts`) and answer:

1. Does `useShiki(code, options)` accept a custom highlighter/factory/engine option (some versions accept `{ engine }` or a `createHighlighter` override)?
2. What langs does `DynamicPre` actually receive at runtime? (`grep -rn "DynamicPre" www/src --include="*.tsx"` → inspect the `lang` props passed; expected: only `tsx`.)
3. Does the full-bundle import happen eagerly at module scope or inside the hook call? (Determines whether merely *not calling* it avoids the chunks — it does not avoid the *emission*; Vite emits chunks for reachable dynamic imports regardless.)

**Verify**: write the three answers in your report before proceeding. Choose: if (1) is yes → Step 3 option A; else option B.

### Step 3A: Redirect the factory via fumadocs options (if supported)

Provide a custom highlighter built from fine-grained imports:

```ts
// www/src/modules/docs/highlighter.ts — shape, adjust to shiki 4's actual API
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export const highlighterPromise = createHighlighterCore({
  themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
  langs: [import('@shikijs/langs/tsx')],
  engine: createJavaScriptRegexEngine(),
})
```

(Resolve exact specifiers from the installed shiki's `exports` map; shiki 4 may expose `shiki/themes/github-light.mjs` instead of `@shikijs/*` subpackages — `cat node_modules/shiki/package.json | grep -A2 exports` style inspection, or `ls node_modules/shiki/dist`.) Pass it through the option discovered in Step 2.

### Step 3B: Replace the hook locally (if no override point)

Swap `useShiki` in `dynamic-pre.tsx` for a local equivalent: a small `use`-based suspense hook that awaits the shared `highlighterPromise` above and calls `highlighter.codeToHast(code, { lang, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false })`, rendering through the same `Pre`/`code` components (`toJsxRuntime` from `hast-util-to-jsx-runtime` is how fumadocs renders HAST → JSX; it's already in the dependency graph — verify with `pnpm why hast-util-to-jsx-runtime`, and if absent use fumadocs' exported HAST renderer if public, else STOP). Preserve the existing `Suspense` + `Placeholder` + `useDeferredValue` structure of `DynamicPre` exactly — only the highlighter source changes.

**Verify (either option)**: `pnpm dev:www` → on `/docs/components/button`, toggle controls; code stays highlighted (tokens colored in both light and dark mode — flip the site theme), placeholder shows briefly on first mount only.

### Step 4: Re-measure and gate

`pnpm --filter www build`, repeat Step 1's measurements.

**Verify**: grammar-chunk weight drops by several MB (expect: the full-langs chunks disappear; remaining: tsx grammar + 2 themes, well under 1 MB total). `pnpm typecheck && pnpm test && pnpm check` → exit 0. Record before/after numbers.

## Test plan

No new automated tests (visual/runtime behavior; the highlighting correctness gate is Step 3's manual check in both themes). The size assertion is the Step 4 measurement recorded in the report and PR description.

## Done criteria

- [ ] Step 2's three investigation answers recorded
- [ ] Server output no longer contains the full shiki grammar set (`find`-based evidence recorded; ≥5 MB reduction vs Step 1 baseline)
- [ ] Playground highlighting verified working in light and dark themes
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm check`, `pnpm --filter www build` all exit 0
- [ ] Only in-scope files modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

- Step 1 cannot locate the grammar chunks (bundling reality differs from the research snapshot).
- Neither option A nor B is implementable without patching `fumadocs-core` or vite config hacks.
- After the change, highlight breaks for any playground (wrong tokens / unstyled code / hydration mismatch) and one fix attempt doesn't resolve it.
- The fine-grained entry points don't exist in the installed shiki version's `exports`.

## Maintenance notes

- If a future playground highlights a language other than `tsx`, the fine-grained `langs` list must grow — make the lang list a named constant with a comment saying exactly that.
- A fumadocs major bump (e.g. core 17) may change the `highlight/client` API — whoever does that migration should re-check this integration.
- Deferred alternative (bigger, not planned): stop client-side highlighting entirely by pre-rendering per-control-state HAST at build time — rejected for now because control combinations are unbounded.
