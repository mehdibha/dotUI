# codeOptions — exported-code style customization

> Status: first cut implemented 2026-06-13 (branch `claude/competent-ramanujan-91c94a`). Point-in-time report; not kept current.

## Goal

The second customization layer named in CLAUDE.md's Product Direction: alongside the visual axes (colors, density, per-component styles…), let each user control the *style* of the code they export so it reads like their codebase, not ours. Sourced the option set from CLAUDE.md ("separator comments or not, arrow functions vs function declarations, tailwind-variants styles as commented arrays vs one line per slot/variant") plus a multi-agent discovery workflow that catalogued **57 distinct candidate options** across formatters (Prettier/Biome/oxfmt/dprint/ESLint-stylistic), shadcn/registry codegen, TS/React style guides, tailwind-variants, scaffolders (Plop/Hygen/Nx/OpenAPI), and the dotUI source itself.

## Architecture

`codeOptions` rides the existing preset pipeline — no new transport or storage. It is an optional nested object on the design-system config (mirroring `color?: ColorConfig`), diffed against its default on encode so an untouched config still produces a clean URL.

```
/create UI (CodeConfig) → setCodeOption → DesignSystem.codeOptions
  → encodePreset (diff vs DEFAULT_CODE_OPTIONS)   [codec.ts]
  → ?preset= blob → /r/$name | /r/init           [server routes]
  → decodePreset → sanitizeCodeOptions → PublishPreset.codeOptions
  → publish() applies serialize/comment transforms
  → format() applies the oxfmt-mapped formatting   [routes/r/$name.tsx]
```

Three transform layers, all request-time and pure-JS (the request path must stay ts-morph-free / route-bundle-safe):

1. **oxfmt pass-through** — `codeOptionsToFormatConfig` maps onto the `oxfmt.format()` call that already runs on every export. Because oxfmt re-prints the whole file last, the build-time ts-morph pins (`QuoteKind.Double`, `IndentationText.Tab`, semicolons) never reach the consumer — quotes/indent/semis/width/commas are genuinely oxfmt's call.
2. **serialize-shape** — `flattenClassArrays` collapses grouped class arrays to one string per slot/variant when `classArrays` is off (the "commented arrays vs one line per slot/variant" axis).
3. **comment/directive transforms** — `stripSectionComments` (the `// MARK:` dividers), `stripUseClient`, `applyFileHeader` (banner/license block, applied after format).

### Key files

- `www/src/publisher/code-options.ts` — `CodeOptions` type, `DEFAULT_CODE_OPTIONS`, `sanitizeCodeOptions`, and the serialize/comment transforms. **Must stay free of any `oxfmt`/external import**: the create codec imports it, and `cards.tsx` pulls the create preset module into the "Open in v0" showcase bundle, so anything imported here ships to v0. (This bit once — the initial `import type { FormatConfig } from 'oxfmt'` leaked into `showcase-bundle.ts`.)
- `www/src/publisher/format-config.ts` — `codeOptionsToFormatConfig` (the only oxfmt-typed piece); imported by the `/r/*` routes only, never bundled.
- `www/src/modules/create/code-config.tsx` — the `CodeConfig` builder panel + `CodeSummary` card.
- Wiring: `preset/{types,codec,use-design-system,index}.ts`, `publisher/{publish,types}.ts`, `routes/r/{$name,init,showcase-bundle}.tsx`, `customizer-panel.tsx`.
- Tests: `publisher/code-options.spec.ts` (unit), `modules/create/preset/code-options-e2e.spec.ts` (preset→publish→format chain).

## Shipped (20 options)

All low-risk, pure-JS, request-safe.

- **Formatting (oxfmt):** semicolons, quote style, JSX quote style, indent style (tab/space), indent width, print width, trailing commas, arrow parens, bracket spacing, object key quoting, end of line.
- **JSX (oxfmt):** closing-bracket same line, one attribute per line.
- **Imports & classes:** sort imports (on/off), sort Tailwind classes (on/off), tv class values (arrays vs single string).
- **Directives & comments:** `"use client"` keep/strip, section comments keep/strip, file header (banner text).

### Defaults

Conventional Prettier/shadcn norms: double quotes, semicolons, 2-space, 80-col, trailing-`all`, arrow `always`, sorted imports + classes, `classArrays` on (preserves authored grouping), section comments stripped, header none. Two deliberate departures from the raw publisher's prior output (which only pinned `printWidth:120, useTabs:true`): **2-space over tabs** and **80 over 120**.

> Open question (taste): defaults follow the shadcn/Prettier *consumer* norm (double quotes + semicolons), not the dotUI *source* style (single quotes, no semicolons). Both are coherent; every option is user-overridable, so the default is a one-constant change in `DEFAULT_CODE_OPTIONS`. Confirm with the product owner.

## Deferred (and why)

Everything requiring a structural rewrite of the component body — needs the registry source normalized to one canonical form first, then a build-time (ts-morph) transform. CLAUDE.md says don't deepen the publisher's AST reach (a rewrite is planned), and the discovery assessment rated these effort/risk high. **Do these with the publisher rewrite.**

- **template-AST / source-structural:** component declaration (arrow ↔ function — named in CLAUDE.md, but the source itself is inconsistent: Button=arrow, Alert=function, so it's blocked on a source-normalization pass), helper declaration, props destructuring location, interface ↔ type, `import type` syntax, React import style, **react-aria-components barrel vs subpath**, named vs default export, export placement, `React.FC`, explicit return types, static className wrapping, `tv()` binding name, inline group comments in class lists.
- **packaging (belongs in existing subsystems, not the code-style path):** language target tsx/jsx, icon library (already handled by `icon-map.ts`), import aliases (the publisher already rewrites `@/registry/*` → `@/components/*` at build time; parameterizing the target is a low-effort extended follow-up), cn utility impl/name, file naming, barrels, co-located test/story files, tailwind base color (belongs with the color engine).
- **likely never:** variant engine cva (loses tv slots/density), state-styling mechanism, css-vars-vs-utilities (the OKLCH engine is variable-native).

The full 57-option catalog with per-option mechanism/effort/risk/value/tier lives in the discovery workflow output (run `wf_d54caa0f-ac8`).

## Follow-ups worth doing next (cheap, in current architecture)

- Import aliases (`@/components/ui`, `@/lib/utils`, …) as request-time prefix rewrites over the template — mirrors shadcn `components.json` aliases; the build-time rewrite already exists, just parameterize the target.
- Widen `sortImports` from boolean to the 3 grouping presets (grouped+blank / grouped-no-blank / flat-sorted).
- `// MARK:` → banner (`/* --- */`) / `// #region` reform modes in `stripSectionComments` (currently strip-only).
