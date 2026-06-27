# 002 — `chart` primitives item (port of shadcn `chart.tsx`)

> Planned at `a4c39a38`. Part of [2026-06-13-charts](README.md). Gated by Phase 0.1 (adopt Recharts). Gates [003](003-chart-families.md) (every family depends on `chart`).

## Goal

A new styles-less registry item `www/src/registry/ui/chart/` that is a near-verbatim port of shadcn's framework-agnostic `chart.tsx` (pure Recharts + Tailwind + `cn`, no Radix/RAC). This is what `shadcn add @dotui/chart` installs and what every family composes.

## Why styles-less (verified)

The publisher decides shipping behavior by `existsSync('styles.ts')` (`www/src/publisher/build-time/build-publishables.ts`). With **no** `styles.ts`, `transform-base.ts` ships `base.tsx` verbatim, rewriting only `@/registry/*` import paths (`@/registry/lib/utils` → `@/lib/utils`) — exactly the `loader` precedent. This sidesteps `extract-config.ts`'s static-literal fragility entirely (a non-static `createStyles` arg throws and the item is **silently skipped** from publishables, `/r/<name>`, and `registry.json` — 4 components already skip this way). Charts are themed by `var(--chart-N)` + Recharts inline props at runtime, so no tailwind-variants layer is needed for v1.

## Files to create

```
www/src/registry/ui/chart/
  meta.ts          # registry metadata
  base.tsx         # the shipped primitives (port of shadcn chart.tsx)
  index.tsx        # export * from './base'  (www wrapper, never shipped)
  types.ts         # exported *Props for build:references
  examples.tsx     # wires the tooltip-showcase demos for docs
  demos/           # the 9 Tooltip-showcase demos (see README inventory)
```

### `meta.ts`

```ts
import type { RegistryItem } from '@/registry/types'

const chartMeta = {
  name: 'chart',
  type: 'registry:ui',
  group: 'charts', // Phase 0.3 APPROVED — add 'charts' to the ComponentGroup union (step 1)
  files: [{ type: 'registry:ui', path: 'ui/chart/base.tsx', target: 'ui/chart.tsx' }],
  dependencies: ['recharts'],
  registryDependencies: [],
} satisfies RegistryItem

export default chartMeta
```

- `name` must be globally unique across base+ui+lib+hooks (enforced by `checkUniqueRegisteredNames`).
- `dependencies: ['recharts']` is passed verbatim into the shipped registry JSON (so the shadcn CLI installs it). It does **not** install locally — also add `recharts: '^3.x'` to `www/package.json` (see [005](005-build-publish-and-verification.md)).

### `base.tsx`

- Start with `'use client'` (parity/v0 cosmetic here — see README; SSR safety is the `initialDimension` contract, not this directive).
- Port shadcn's exports exactly: `ChartContainer`, `ChartStyle`, `ChartTooltip` (= Recharts `Tooltip`), `ChartTooltipContent`, `ChartLegend` (= Recharts `Legend`), `ChartLegendContent`, and the `ChartConfig` type. Keep internals: `useChart`, `ChartContext`, `THEMES`, `getPayloadConfigFromPayload`.
- Keep the full prop surface: `ChartTooltipContent` indicator `dot | line | dashed`, `hideLabel`, `hideIndicator`, `nameKey`, `labelKey`, `formatter`, `labelFormatter`; `ChartLegendContent` `verticalAlign`, `hideIcon`, `nameKey`.
- **Preserve the SSR contract verbatim**: `ChartContainer` wraps Recharts `ResponsiveContainer` and passes shadcn's `initialDimension` (e.g. `{ width: 320, height: 200 }` per current shadcn) plus the `min-h`/`aspect` classes. This is what makes it render server-side and survive minified production builds (see Risks).
- **Theming**: keep `ChartStyle` emitting `[data-chart=<id>] { --color-<key>: ... }` from `ChartConfig`, and default series to `var(--chart-N)`. dotUI's `.dark`-on-`<html>` matches shadcn's `.dark [data-chart=…]` selector.
- **A11y (approved, automatic) — add a `ChartDataTable` helper here.** Per Phase 0.4, the visually-hidden data-table layer lives in the primitives item so every family inherits it with zero user work. Author a small `ChartDataTable` (or fold into `ChartContainer` behind a `sr-only` wrapper) that **auto-derives** a `<table>` from the chart's existing `data` + `ChartConfig` (config keys → column headers, `data` rows → cells) and renders it `sr-only`. Optional `aria-label`/`caption` prop is the only user-facing surface. This is dotUI-original (not in shadcn) — keep it a static, styles-less component so the publisher ships it verbatim.
- **Imports only**: `react`, `recharts`, `@/registry/lib/utils` (`cn`). No `@/components`, router, or fumadocs (those are `index.tsx`-only — but here `index.tsx` is just a re-export).

### `types.ts`

Export `ChartContainerProps`, `ChartTooltipContentProps`, `ChartLegendContentProps` so `build:references` emits `chart.json` for `<Reference name="chart" />`.

> **Validate determinism (Risk):** `ChartConfig` is a generic record with `ComponentType`/`ReactNode`/function members and a `color | theme` union. `typescript-api-extractor` may emit noisy or order-unstable JSON (the union-member-order flip CLAUDE.md warns about). After `build:references`, **inspect** `www/src/modules/references/generated/chart.json`. If it's noisy/non-deterministic: narrow what `types.ts` exports (e.g. omit the raw `ChartConfig` record from the documented surface, document only the component props), or skip `<Reference>` for the generic config and document it in prose.

### demos + `examples.tsx`

Author the **9 Tooltip-showcase** demos (default, indicator-line, indicator-none, label-none, label-custom, label-formatter, formatter, icons, advanced) as self-contained `'use client'` default-export components under `demos/`. Wire them in `examples.tsx` via `<Examples>`/`<Example>` (the `table` model). **Do not** add a `playground.tsx`/`InteractiveDemo` (see README gotcha — `playground-fidelity.spec.ts` + no meaningful reference-backed controls).

## Steps

1. Add `| 'charts'` to the `ComponentGroup` union in `www/src/registry/types.ts` (Phase 0.3 approved). This is what makes `group: 'charts'` type-check and surfaces the Charts category in `/create`.
2. Add `recharts: '^3.x'` to `www/package.json`; `pnpm install`. If Recharts pulls a `react-is` mismatching the catalog `react ^19.2.1`, add a `pnpm` override.
3. Create the files above; port `chart.tsx` faithfully.
4. `pnpm build:registry` → confirm `chart` appears in the publishables **"written"** list (not "skipped"), and in `__generated__/registry-items.ts`; demos auto-register into `__generated__/demos.tsx`, `examples.tsx` into `create/__generated__/examples.tsx`.
5. `pnpm build:references` (full, unscoped) → inspect `chart.json` (see determinism note).
6. Commit regenerated artifacts per [005](005-build-publish-and-verification.md).

## Done criteria

- `pnpm build:registry` lists `chart` as written; `/r/chart` serves a clean publishable whose `base.tsx` has `@/lib/utils` (rewritten) and lists `recharts` in `dependencies`.
- A throwaway `<ChartContainer>` renders in a **production** build under TanStack Start and hydrates without layout collapse (see Risk).
- `pnpm check` + `pnpm typecheck` green; `chart.json` reviewed and deterministic across two full `build:references` runs.

## Risks

- **Recharts + React 19 + SSR**: `ResponsiveContainer` does not server-render and has v3 production regressions (minified `displayName` collapses to `'Component'`, dropping the chart). Mitigation: keep `initialDimension` + `min-h`/`aspect` verbatim; verify in `pnpm build` output, not just `pnpm dev:www`. If still flaky, wrap chart bodies in a `ClientOnly` boundary.
- **Bundle weight**: `recharts` + `d3` is large; `import * as RechartsPrimitive` tree-shakes imperfectly. Acceptable for an owned-source chart users opt into; keep it out of the customizer iframe (see [001](001-chart-colors-axis.md) step 4).

## STOP conditions

- If `build:registry` puts `chart` in the **"skipped"** list, stop — something made it look styles-ful or non-static. Do not ship; report.
- If `chart.json` is non-deterministic after narrowing exports, stop and decide the `<Reference>` strategy with the maintainer rather than committing churny output.
