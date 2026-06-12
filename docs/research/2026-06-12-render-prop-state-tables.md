# Render prop / CSS selector / Tailwind state tables for component docs

**Status:** Research + proposal, 2026-06-12. Awaiting approval before implementation.

> Decision (2026-06-12): Approved and implemented. States table is embedded in `Reference` (no separate Styling section). Resolution is className-param based with a `RENDER_PROPS_SOURCES` override map in the generator config (first entry: ColorThumbProps). `getTypeId` in type-to-ast.ts was also fixed to emit machine-independent typeLinks ids, making regeneration deterministic across checkouts.
>
> Decision (2026-06-12, revised): only stylable states make the table — render props with no `@selector` (the `state` object, `percentage`, `selectedItems`, value getters, …) are omitted, reversing the earlier "show with `—`" call. A "CSS selector / Tailwind selector" table should not carry rows that are dashes in both columns. Components left with nothing stylable (color-swatch, field-error) get no states table. This also covers **Base UI** components (drawer, otp-field): their state object carries no selectors, so the table is built from the sibling `*DataAttributes` enum (`DrawerPopupState` → `DrawerPopupDataAttributes`) — name / `[data-*]` selector / native `data-*:` Tailwind variant / JSDoc description — and the column header reads "Data attribute" (via `renderPropsKind`) instead of "Render prop". Base UI parts with no such enum (DrawerIndent, DrawerIndentBackground) get no table.

## Question

Add React Aria–style "Render Prop / CSS Selector" tables to all component docs, plus a third column for the Tailwind variant (via `tailwindcss-react-aria-components`). Where does React Aria pull this data from, and what is the cleanest way to do it here?

## How React Aria's docs do it (verified)

- Source of truth: `@selector` JSDoc tags on the properties of each `*RenderProps` interface in react-aria-components source, e.g. `ButtonRenderProps.isHovered` → `@selector [data-hovered]`. The prop description doubles as the table description.
- Their docs build (Parcel transformer, `packages/dev/parcel-transformer-docs`) parses the TS + JSDoc into a `docs` object; MDX pages render `<StateTable properties={docs.exports.ButtonRenderProps.properties} />` (e.g. `packages/react-aria-components/docs/Button.mdx:367`).
- `StateTable` (old site: `packages/dev/docs/src/StateTable.js`; new site: `packages/dev/s2-docs/src/StateTable.tsx`) renders Render Prop / CSS Selector columns with the description underneath, filters `optional` render props by default, and shows `—` for render props that have no selector (e.g. `ProgressBarRenderProps.percentage`).
- Key fact for us: the `@selector` tags **survive in the published package** — 287 of them across `react-aria-components/dist/types/src/*.d.ts` in our installed 1.18.0. No need to vendor or scrape anything.

## What dotUI already has (surprising amount)

- `www/scripts/api-docs-builder/src/componentHandler.ts` → `extractRenderProps()` already mines `@selector` tags through the TS type checker (the program includes RAC's d.ts), emitting `renderProps: { isPressed: { selector, description } }` into the reference JSONs.
- 55 of 183 generated JSONs (`www/src/modules/references/generated/`) already carry populated `renderProps` (button, checkbox, select, slider parts, tabs, toast, …).
- The field is typed (`ComponentApiReference.renderProps`, `www/src/modules/references/types.ts:48`) but **dropped** by `transformReference()` (`www/src/modules/references/transform.ts:144`) and never rendered in `www/src/modules/docs/reference.tsx`. So today it is extracted, committed, and invisible.

## Gaps in the current extraction

Resolution is by name convention: `XxxProps` → search the whole program for an interface named `XxxRenderProps`. This fails both ways:

- Misses on renames: `ComboboxProps` (RAC is `ComboBoxRenderProps`, capital B), `TableRowProps` (RAC `RowRenderProps`), `TableCellProps`/`TableColumnProps`, `accordion` (RAC `DisclosureGroup`), the renamed `*-content` parts (`select-content`, `menu-content`, `combobox-content`, `tooltip-content` → RAC `PopoverRenderProps`/`TooltipRenderProps`), `text-area`, `time-field`, etc.
- False positives: dotUI `TooltipProps` is the trigger root (renders no element) yet gets `TooltipRenderProps` attached by name collision; `TooltipContentProps` — the part that actually carries `data-placement` — gets nothing.
- Render props without a selector are skipped entirely (RA shows them with `—`; they are still available in `className`/`children` functions).

The fix that matches the type system: resolve the render-props type from the **`className` prop's function parameter** (`string | (values: T) => string` — the checker already prints `(values: ButtonRenderProps) => string` in button.json). Parts whose `className` is a plain string (plain HTML subcomponents) correctly get no table. Keep name convention as fallback plus a tiny override map in `api-docs-builder/src/config.ts` for stragglers.

## Tailwind column

- We register the plugin unprefixed (`@plugin 'tailwindcss-react-aria-components';` in `www/src/registry/base/base.css`), patched at v2.1.1 (`patches/`) for the upstream `not-*` bug.
- The plugin's whole mapping lives in `node_modules/tailwindcss-react-aria-components/src/index.js`: boolean attrs (with renames `data-hovered`→`hover`, `data-focused`→`focus`, `data-readonly`→`read-only`, `data-placeholder`→`placeholder-shown`) and enum attrs with short names (`selection-mode`→`selection-*`, `resizable-direction`→`resizable-*`, `sort-direction`→`sort-*`).
- Cleanest derivation: at build-references time, invoke the (patched) plugin with a stub `addVariant` to harvest `variant → selector(s)`, regex the `data-*` attribute out of each selector, build the reverse index. Zero drift with plugin updates/patches, no vendored table.
- Per-selector mapping rule: plugin-covered boolean → `pressed:`/`hover:`/…; plugin-covered enum → `placement-left:` …; data attribute not covered by the plugin (`data-today`, `data-inert`, `data-level`, `data-channel=…`) → native Tailwind v4 `data-today:` / `data-[channel=hue]:`; non-data selectors (`:not([aria-valuenow])`, `[aria-valuetext]`) → `—`.

## Proposal

1. **Generator** (`www/scripts/api-docs-builder/`): switch render-props resolution to className-param with name-convention fallback + config overrides; include selector-less render props; compute and emit a `tailwind` field next to `selector` (plugin harvest above). Mapping lives only in the generator; JSON stays the single artifact.
2. **Pipeline/UI**: carry `renderProps` through `transformReference()` (highlight selector/tailwind strings); render a states table inside `Reference` (`reference.tsx`) below the prop groups — columns Render Prop / CSS Selector / Tailwind, description underneath like RA. Because docs pages already render `<Reference>` per part, every part gets its correct table with **zero MDX churn** across ~60 pages. Optionally also export a standalone `<StateTable name="…"/>` MDX component for dedicated Styling sections later.
3. **Regenerate**: one dedicated commit for the JSON regen (full `build:references` run — expect the known generator-drift noise across ~121 files; keep it separate from the source commit).

Rejected alternatives: hand-written tables per MDX page (drifts, ~60 pages); vendoring RA's docs transformer (Parcel-specific, heavy); hardcoding the tailwind mapping table (drifts from the patched plugin).

## Open questions

- Show selector-less render props (RA does, with `—`) or keep state-only rows?
- Embed in `Reference` (recommended) vs a separate "Styling" docs section per page?
- dotUI-specific data attributes (`data-icon-only`, …) are not render props; documenting them would need its own `@selector`-style convention on our types — separate decision, out of scope here.
