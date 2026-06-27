# 003 — Per-family chart items + variant matrix

> Planned at `a4c39a38`. Part of [2026-06-13-charts](README.md). Gated by [002](002-chart-primitives.md) (`chart` must exist). Charts are a **synced group** — land changes to the shared primitive across all families in one PR.

## Goal

Six registry items, one per chart family, each `add`-able and runnable, each colored exclusively by `var(--chart-N)`:

```
www/src/registry/ui/chart-bar/
www/src/registry/ui/chart-line/
www/src/registry/ui/chart-area/
www/src/registry/ui/chart-pie/
www/src/registry/ui/chart-radar/
www/src/registry/ui/chart-radial/
```

Each family's `base.tsx` is its **canonical default** variant (a card composing `ChartContainer` + the Recharts chart). The **full shadcn variant matrix** for the family ships as `demos/*.tsx` (the `table` model — one self-contained `'use client'` default-export per variant). This delivers parity without ~70 separate registry items.

## Per-family file layout

```
ui/chart-<family>/
  meta.ts          # group:'charts', dependencies:['recharts'], registryDependencies:['chart','card']
  base.tsx         # default variant: card + ChartContainer + recharts, var(--chart-N)
  index.tsx        # export * from './base'
  types.ts         # exported props (if any beyond Recharts) for build:references
  examples.tsx     # wires the variant demos for the docs gallery
  demos/*.tsx      # the family's full variant matrix (see inventory)
```

### `meta.ts` (example: `chart-bar`)

```ts
import type { RegistryItem } from '@/registry/types'

const chartBarMeta = {
  name: 'chart-bar',
  type: 'registry:ui',
  group: 'charts',
  files: [{ type: 'registry:ui', path: 'ui/chart-bar/base.tsx', target: 'ui/chart-bar.tsx' }],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartBarMeta
```

- **`registryDependencies` drift is a HARD failure.** `checkRegistryDepsDrift` fails the build if `base.tsx` imports a `@/registry/*` item not declared here (under-declaration only). Declare every one: `chart` (always), `card` (if the default wraps a card — recommended for parity), and **`select`** for the interactive Area variant (its `base.tsx`/demo uses a Select). `utils`/`focus-styles`/`theme` are exempt (`BUNDLED_INTO_INIT`).
- Styles-less (no `styles.ts`) — same publisher path as [002](002-chart-primitives.md).

## Variant matrix (ship as `demos/*.tsx`)

From the [README inventory](README.md#full-inventory-shadcn-parity-family-for-family-count-for-count). `base.tsx` = the "default" of each; the rest are demos:

- **chart-area** (10): default(base), linear, step, stacked, stacked-expand, legend, icons, gradient, axes, interactive *(+`select` dep)*.
- **chart-bar** (10): default(base), multiple, stacked, horizontal, label, label-custom, mixed, active, negative, interactive.
- **chart-line** (10): default(base), linear, step, multiple, dots, dots-custom, dots-colors, label, label-custom, interactive.
- **chart-pie** (11): simple(base), separator-none, label, label-custom, label-list, legend, donut, donut-active, donut-text, stacked, interactive.
- **chart-radar** (14): default(base), dots, lines-only, label-custom, grid-custom, grid-none, grid-circle, grid-circle-no-lines, grid-circle-fill, grid-fill, multiple, legend, icons, radius.
- **chart-radial** (6): simple(base), label, grid, text, shape, stacked.

Authoring rules per demo:
- `'use client'`, single default export, fully self-contained (its own `data` array + `ChartConfig`).
- Colors via `var(--chart-1..N)` only — **no hex**. The chart-colors axis ([001](001-chart-colors-axis.md)) is approved, so `--chart-N` always exists.
- **`accessibilityLayer` on every chart** (Phase 0.4, approved). It's a per-chart Recharts prop, not a primitive default — set it on the Recharts root in **every** `base.tsx` and demo.
- **Inherit the hidden data-table** from the `chart` primitive's `ChartDataTable` ([002](002-chart-primitives.md)). If it's folded into `ChartContainer`, families get it for free (pass the same `data`/`config`); if it's a separate component, render it `sr-only` alongside each chart. Zero extra props for the end user.
- Match shadcn's chart structure so v0-pasted blocks interoperate; swap any shadcn icon imports for dotUI's icon convention (the publisher swaps icons on its side; author with the registry icon set).

## Steps

1. Author all six families together (synced group). Start with `chart-bar` as the reference, then mirror structure across the rest.
2. Wire each family's `demos/` into its `examples.tsx` via `<Examples>`/`<Example>`.
3. `pnpm build:registry` → confirm **all six** appear in the publishables "written" list and `__generated__/registry-items.ts`; demos auto-register.
4. `pnpm build:references` (full) → review any emitted `chart-*.json`.
5. Commit regenerated artifacts per [005](005-build-publish-and-verification.md).

## Done criteria

- `shadcn add @dotui/chart-bar` (and each family) installs `chart` + `card` + `recharts` and yields a running, themed chart.
- Every family is in the "written" list; no `checkRegistryDepsDrift` failure.
- All series colors resolve to `var(--chart-N)`; charts re-theme live when the chart-colors axis changes; legible in light + dark.
- `pnpm check` + `pnpm typecheck` green.

## STOP conditions

- If a family needs a `@/registry/*` item beyond `chart`/`card`/`select`, declare it and re-verify drift — do not leave it undeclared.
- If a variant can't be expressed without a non-static `styles.ts`, ship it styles-less (Recharts inline props) — do **not** add a `styles.ts` that risks the publisher silently skipping the item.
