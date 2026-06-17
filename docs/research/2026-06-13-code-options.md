# codeOptions — exported-code style customization

> Status: implemented 2026-06-13 (branch `claude/competent-ramanujan-91c94a`, PR #251). Point-in-time report; not kept current.
> Decision (2026-06-14): scoped down to **2 options** — `classArrays` and `sectionComments`. Pure-formatting options were dropped (the consumer reformats with Prettier/Biome). `useClient` was dropped (the shadcn CLI's `rsc` flag handles the `"use client"` directive). `fileHeader` was dropped. `sectionComments` ON now renders real `/* --- */` separator rules where the source has `// MARK:` markers; the `// MARK: <name>Styles` marker (an internal note for where the resolved `tv()` goes) is *always* stripped. The UI is a footer button opening a split modal with a live code preview.

## Goal

The second customization layer named in CLAUDE.md's Product Direction: alongside the visual axes (colors, density, per-component styles…), let each user control the *style* of the code they export so it reads like their codebase, not ours. Sourced the option set from CLAUDE.md plus a multi-agent discovery workflow that catalogued **57 distinct candidate options**, then narrowed hard to what's worth a toggle: not the formatter's job, not the CLI's job, and meaningfully different between codebases.

## Architecture

`codeOptions` rides the existing preset pipeline — no new transport or storage. It is an optional nested object on the design-system config (mirroring `color?: ColorConfig`), diffed against its default on encode so an untouched config still produces a clean URL.

```
/create: footer "Code style" button → split modal (CodeConfig + live /r/button preview)
  → setCodeOption → DesignSystem.codeOptions
  → encodePreset (diff vs DEFAULT_CODE_OPTIONS)   [codec.ts]
  → ?preset= blob → /r/$name                      [server route]
  → decodePreset → sanitizeCodeOptions → PublishPreset.codeOptions
  → publish() applies the two transforms
  → format() runs a FIXED baseline (printWidth 80) — not a codeOptions axis
```

Two transform layers, both request-time and pure-JS (the request path must stay ts-morph-free / route-bundle-safe):

1. **serialize-shape** (`flattenClassArrays`) — collapses grouped `tv()` class arrays to one string per slot/variant when `classArrays` is off. A formatter reflows but never converts `['a','b']` ↔ `'a b'`, so this survives.
2. **section separators** (`applySectionComments`) — the `// MARK: <name>Styles` marker is *always* dropped (internal injection point). The remaining `// MARK:` markers become real `/* --- */` comment rules when `sectionComments` is on, or are dropped when off.

The output is still run through `oxfmt` once with a fixed config (`{ printWidth: 80 }`) so the shipped + previewed source is readable — but that's a baseline, not user-configurable.

### Key files

- `www/src/publisher/code-options.ts` — `CodeOptions` type, `DEFAULT_CODE_OPTIONS`, `sanitizeCodeOptions`, `flattenClassArrays`, `applySectionComments`. **Must stay free of any external import** (no `oxfmt`): the create codec imports it, and `cards.tsx` pulls the create preset module into the "Open in v0" showcase bundle, so anything imported here ships to v0.
- `www/src/modules/create/code-config.tsx` — the `CodeConfig` controls (2 rows).
- `www/src/modules/create/code-options-dialog.tsx` — the footer "Code style" button + split modal + the live `/r/button` preview (debounced fetch, highlighted with the docs `DynamicPre`).
- Wiring: `preset/{types,codec,use-design-system,index}.ts`, `publisher/{publish,types}.ts`, `routes/r/$name.tsx`, `customizer-panel.tsx`.
- Tests: `publisher/code-options.test.ts` (unit), `modules/create/preset/code-options-e2e.test.ts` (preset→publish→format chain).

## Shipped (2 options)

- **`classArrays`** — `tv()` base/slot class values as grouped arrays (one concern per line) vs a single joined string. Default `true`.
- **`sectionComments`** — divide the file into sections with `/* --- */` comment rules. Default `false`. (The internal `// MARK: …Styles` marker is always stripped regardless.)

## Dropped

- **Pure formatting** (semicolons, quotes, indentation, width, trailing commas, arrow parens, bracket spacing, object-wrap, quote-props, EOL, JSX layout, sort imports, sort Tailwind classes) — the consumer's Prettier/Biome job. The publisher emits a fixed baseline instead.
- **`useClient`** — the shadcn CLI's `rsc` flag already adds/strips the `"use client"` directive on install.
- **`fileHeader`** — banner/license text; cut to keep the surface minimal.

## Deferred structural axes (need the publisher rewrite)

Non-formatter axes that require a structural rewrite of the component body — they need the registry source normalized to one canonical form, then a build-time (ts-morph) transform. CLAUDE.md says don't deepen the publisher's AST reach (a rewrite is planned). Legitimate future codeOptions, just not cheap today:

- arrow ↔ function declaration (named in CLAUDE.md; source is inconsistent so it needs a normalization pass first), helper declaration, props destructuring location, interface ↔ type, `import type` syntax, React import style, **react-aria-components barrel vs subpath**, named vs default export, export placement, `React.FC`, `tv()` binding name, inline group comments in class lists, separate styles file.

Packaging axes (language target tsx/jsx, icon library, import aliases, cn utility, file naming, barrels) belong in their existing subsystems, not the code-style path.

The full 57-option catalog with per-option mechanism/effort/risk/value/tier lives in the discovery workflow output (run `wf_d54caa0f-ac8`).
