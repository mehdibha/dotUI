# codeOptions — exported-code style customization

> Status: implemented 2026-06-13 (branch `claude/competent-ramanujan-91c94a`). Point-in-time report; not kept current.
> Decision (2026-06-14): dropped all pure-formatting options. The consumer reformats with their own Prettier/Biome rules before committing, so any quote/indent/semicolon/width/sorting choice we ship is immediately overwritten — offering them as options is noise. `codeOptions` now keeps only the axes that survive a formatter pass (4 options, below). The UI also moved from a left-menu card to a footer button opening a split modal with a live code preview.

## Goal

The second customization layer named in CLAUDE.md's Product Direction: alongside the visual axes (colors, density, per-component styles…), let each user control the *style* of the code they export so it reads like their codebase, not ours. Sourced the option set from CLAUDE.md plus a multi-agent discovery workflow that catalogued **57 distinct candidate options** across formatters (Prettier/Biome/oxfmt/dprint/ESLint-stylistic), shadcn/registry codegen, TS/React style guides, tailwind-variants, scaffolders (Plop/Hygen/Nx/OpenAPI), and the dotUI source itself — then narrowed to what a formatter won't undo.

## Architecture

`codeOptions` rides the existing preset pipeline — no new transport or storage. It is an optional nested object on the design-system config (mirroring `color?: ColorConfig`), diffed against its default on encode so an untouched config still produces a clean URL.

```
/create: footer "Code style" button → split modal (CodeConfig + live /r/button preview)
  → setCodeOption → DesignSystem.codeOptions
  → encodePreset (diff vs DEFAULT_CODE_OPTIONS)   [codec.ts]
  → ?preset= blob → /r/$name                      [server route]
  → decodePreset → sanitizeCodeOptions → PublishPreset.codeOptions
  → publish() applies the serialize/comment transforms
  → format() runs a FIXED baseline (printWidth 80) — not a codeOptions axis
```

Two transform layers, both request-time and pure-JS (the request path must stay ts-morph-free / route-bundle-safe):

1. **serialize-shape** — `flattenClassArrays` collapses grouped `tv()` class arrays to one string per slot/variant when `classArrays` is off. A formatter reflows but never converts `['a','b']` ↔ `'a b'`, so this survives.
2. **comment/directive transforms** — `stripSectionComments` (the `// MARK:` dividers), `stripUseClient` (the `"use client"` directive), `applyFileHeader` (banner/license block, applied after the baseline format so it isn't reflowed). Formatters preserve comments + directives, so these survive too.

The output is still run through `oxfmt` once with a fixed config (`{ printWidth: 80 }`) so the shipped + previewed source is readable — but that's a baseline, not user-configurable.

### Key files

- `www/src/publisher/code-options.ts` — `CodeOptions` type, `DEFAULT_CODE_OPTIONS`, `sanitizeCodeOptions`, and the serialize/comment transforms. **Must stay free of any external import** (no `oxfmt`): the create codec imports it, and `cards.tsx` pulls the create preset module into the "Open in v0" showcase bundle, so anything imported here ships to v0. (This bit once — an `import type { FormatConfig } from 'oxfmt'` leaked into `showcase-bundle.ts`; that's why the formatter mapping was first split into `format-config.ts`, since deleted with the formatter options.)
- `www/src/modules/create/code-config.tsx` — the `CodeConfig` controls (4 rows).
- `www/src/modules/create/code-options-dialog.tsx` — the footer "Code style" button + split modal + the live `/r/button` preview (debounced fetch, highlighted with the docs `DynamicPre`).
- Wiring: `preset/{types,codec,use-design-system,index}.ts`, `publisher/{publish,types}.ts`, `routes/r/$name.tsx`, `customizer-panel.tsx`.
- Tests: `publisher/code-options.spec.ts` (unit), `modules/create/preset/code-options-e2e.spec.ts` (preset→publish→format chain).

## Shipped (4 options — the ones a formatter won't undo)

- **`classArrays`** — `tv()` base/slot class values as grouped arrays (one concern per line) vs a single joined string. Default `true` (preserves authored grouping).
- **`useClient`** — keep or strip the leading `"use client"` directive (RSC vs SPA/Vite). Default `keep`.
- **`sectionComments`** — keep or strip the source's `// MARK:` section dividers. Default strip (they're an internal Xcode convention that looks alien downstream).
- **`fileHeader`** — a banner/license comment prepended to every file. Default none.

## Dropped: pure formatting (the formatter's job)

semicolons, quote style, JSX quote style, indentation (tabs/spaces), indent width, print width, trailing commas, arrow parens, bracket spacing, object-wrap, quote-props, end-of-line, JSX bracket/attribute layout, **sort imports**, **sort Tailwind classes**. All are Prettier/Biome (or their plugins) features the consumer runs on commit, so picking them for the user is pointless. The publisher emits a fixed, conventional baseline instead.

## Deferred structural axes (need the publisher rewrite)

Everything requiring a structural rewrite of the component body — needs the registry source normalized to one canonical form first, then a build-time (ts-morph) transform. CLAUDE.md says don't deepen the publisher's AST reach (a rewrite is planned). These are NON-formatter (a formatter won't do them), so they're legitimate future codeOptions — just not cheap today:

- arrow ↔ function declaration (named in CLAUDE.md; source is inconsistent so it needs a normalization pass first), helper declaration, props destructuring location, interface ↔ type, `import type` syntax, React import style, **react-aria-components barrel vs subpath**, named vs default export, export placement, `React.FC`, `tv()` binding name, inline group comments in class lists, separate styles file.

Packaging axes (language target tsx/jsx, icon library, import aliases, cn utility, file naming, barrels) belong in their existing subsystems (`icon-map.ts`, the build-time alias rewrites, the utils init item), not the code-style path.

The full 57-option catalog with per-option mechanism/effort/risk/value/tier lives in the discovery workflow output (run `wf_d54caa0f-ac8`).
