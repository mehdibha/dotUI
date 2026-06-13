# Charts feature — implementation plan

Feature-design plan (not an audit, but follows the same folder/index/`NNN-slug.md` convention) to introduce **charts** to dotUI with full shadcn parity plus dotUI value-adds. Planned at `a4c39a38`.

Goal: a user can `shadcn add @dotui/chart-bar` (etc.) and get a runnable, themeable chart that looks like *their* design system; browse every chart in a new **Charts** docs section + gallery page reachable from the navbar; and (if approved) tune a **Chart colors** palette as a first-class builder axis. We mirror shadcn family-for-family and variant-for-variant, then add the things an accessibility-first React Aria project should have that shadcn lacks.

Start from this index, never from an individual plan. Read the whole plan you pick up, honor its STOP conditions, and update its status row here when done.

## Phase 0 — product decisions (RESOLVED 2026-06-13)

Per CLAUDE.md, a new axis / new tokens / a new dependency need the maintainer's sign-off before implementing. These were decided with the maintainer on 2026-06-13:

1. **Recharts v3 — ADOPTED.** Added as a per-item registry dependency + `www/package.json`. The one deliberate departure from the React Aria foundation, accepted for shadcn parity.
2. **Chart colors axis — APPROVED, derived-from-accent + manual override.** Emit `--chart-1..N` (+ `--on-chart-N`); default `N = 5` (shadcn parity), `N` user-configurable (clamp 3–8). Colors auto-derived by hue-rotating the accent in OKLCH with an optional manual override; separate dark-mode set (never reversed). Because derivation tracks the brand, prefer the **recipe-home (Option B)** in [001](001-chart-colors-axis.md) so the palette re-derives when the accent changes and exported projects inherit it.
3. **`'charts'` ComponentGroup — APPROVED + FULL builder integration.** Add `| 'charts'` to the `ComponentGroup` union and surface charts in the live `/create` customizer: a "Charts" category with real Recharts previews. Accepts recharts+d3 in the customizer iframe (and likely the Open-in-v0 showcase — see [005](005-build-publish-and-verification.md) §14).
4. **Accessibility — APPROVED, zero/low user-burden only.** Maintainer: accessibility matters, but **must not add user overhead**. So v1 includes only a11y that ships automatically with the component and needs no user config:
   - `accessibilityLayer` **on by default** on every chart (zero user work).
   - A **visually-hidden data-table** layer that **auto-derives** from the chart's existing `data` + `ChartConfig` — the user passes nothing extra (an optional `aria-label`/caption prop is the only "small extra work" allowed).
   - **Deferred (not approved for v1):** Combo/`ComposedChart` and Scatter — these are chart-type additions, not accessibility, and weren't selected. Keep in the [deferred list](#deferred--out-of-scope-binding-for-future-work).
5. **Docs demo strategy — Example-only galleries** (no `InteractiveDemo`). Technical decision, not gated; see "Verified gotchas".

## Execution order

```
Phase 0 (decisions)  ──►  001 chart-colors axis ─┐
                                                 ├─►  004 docs section + gallery + nav  ──►  005 build/publish/verify
         002 chart primitives  ──►  003 families ┘
```

- [001](001-chart-colors-axis.md) can ship with **no** chart component (a hand-built SVG preview block). It is independent of 002/003.
- [002](002-chart-primitives.md) (the `chart` primitives item) gates [003](003-chart-families.md) (every family `registryDependencies: ['chart']`).
- [003](003-chart-families.md) gates [004](004-docs-section-gallery-nav.md) (gallery cards/pages reference family demos that must exist).
- [005](005-build-publish-and-verification.md) is the regenerate-commit-verify discipline; run its checks after 002/003/004 and as the final gate.

## Status

| Plan | Title | Status |
|---|---|---|
| 000 | Phase 0 product decisions | DONE — resolved 2026-06-13 (Recharts; derived chart-colors axis; full builder integration; auto a11y layer + hidden data-table; Example-only docs) |
| [001](001-chart-colors-axis.md) | Chart colors builder axis (`--chart-N`) | DONE (Option A / tokens path) — `--chart-1..5` ship theme-derived + mode-aware in `base/theme.css`; a "Chart colors" customizer panel (`chart-colors-config.tsx`) overrides them via `setToken` with a "Match theme" reset. FOLLOW-UP: Option B engine recipe (accent hue-rotation, `--on-chart-N`, configurable N, OKLCH→hex for accurate picker pre-fill). |
| [002](002-chart-primitives.md) | `chart` primitives item (port of shadcn `chart.tsx`) | DONE — `ui/chart` ships (written, not skipped); `ChartDataTable` a11y helper added; 4 references generated. FOLLOW-UP: optional Tooltip-showcase demos under `ui/chart`. |
| [003](003-chart-families.md) | Per-family chart items + variant matrix | DONE — 6 families (`chart-bar/line/area/pie/radar/radial`) + ~75 variant demos, all written + typecheck. `accessibilityLayer` on every chart; colors via `var(--chart-N)`. |
| [004](004-docs-section-gallery-nav.md) | Charts docs section, gallery, nav, llms.txt | DONE — Charts sidebar section + `meta.json`, gallery `overview.mdx` + 6 family pages, `componentsData` category, gallery card previews, navbar link, `llms.txt` third bucket, Components-overview block. |
| [005](005-build-publish-and-verification.md) | Build/publish/drift + SSR/a11y verification | DONE — `build:registry` (all 7 written), full `build:references` (deterministic), `pnpm check`/`typecheck` green, production build prerenders all 7 chart pages (SSR validated). NOT committed (left for review). |

## Architecture in one paragraph

Charts ship as **owned registry source**, not a black-box dep: one styles-less `chart` primitives item (a near-verbatim port of shadcn's framework-agnostic `chart.tsx` — pure Recharts + Tailwind + `cn`, no Radix/RAC), plus one registry item per chart **family** (`chart-bar`, `chart-line`, `chart-area`, `chart-pie`, `chart-radar`, `chart-radial`). Each family's `base.tsx` is its canonical default; the full shadcn variant matrix for that family ships as `demos/*.tsx` (exactly how `table` ships ~20 demos), so users `add` the family and copy variants. Colors come exclusively from `var(--chart-N)`, injected at runtime by the existing `DesignSystemProvider` — the one visual decision two design systems disagree on goes through a runtime axis, never a hardcoded hex. Registration is automatic (the `build:registry` glob over `ui/*/meta.ts`); no hand-edit to `ui/registry.ts`.

## Full inventory (shadcn parity, family-for-family, count-for-count)

Verified against `ui.shadcn.com/charts` + the `shadcn-ui/ui` registry. The critic confirmed no shadcn type is omitted.

- **Primitives** (`ui/chart`): `ChartContainer`, `ChartTooltip` (alias of Recharts `Tooltip`), `ChartTooltipContent`, `ChartLegend` (alias of Recharts `Legend`), `ChartLegendContent`, `ChartStyle`, `ChartConfig` type, internals (`useChart`, `ChartContext`, `THEMES`, `getPayloadConfigFromPayload`, initial-dimension constant).
- **Area** (10): default, linear, step, stacked, stacked-expand, legend, icons, gradient, axes, interactive.
- **Bar** (10): default, multiple, stacked, horizontal, label, label-custom, mixed, active, negative, interactive.
- **Line** (10): default, linear, step, multiple, dots, dots-custom, dots-colors, label, label-custom, interactive.
- **Pie** (11): simple, separator-none, label, label-custom, label-list, legend, donut, donut-active, donut-text, stacked, interactive.
- **Radar** (14): default, dots, lines-only, label-custom, grid-custom, grid-none, grid-circle, grid-circle-no-lines, grid-circle-fill, grid-fill, multiple, legend, icons, radius.
- **Radial** (6): simple, label, grid, text, shape, stacked.
- **Tooltip showcase** (9, as demos under `ui/chart`): default, indicator-line, indicator-none, label-none, label-custom, label-formatter, formatter, icons, advanced.

### dotUI additions beyond shadcn

**Approved for v1** (accessibility, automatic — no user overhead per Phase 0.4):

- **`accessibilityLayer` on by default** — Recharts' keyboard/AT layer; shadcn leaves it opt-in. It's a prop on each chart (`<BarChart accessibilityLayer>`), so "on by default" means setting it in every family `base.tsx` and demo, not a single primitive change.
- **Visually-hidden data-table layer** — a non-color, screen-reader-readable rendering of the series, **auto-derived** from the chart's existing `data` + `ChartConfig` so the user passes nothing extra (optional `aria-label`/caption is the only allowed extra). Implement as a small shared helper in the `chart` primitives item so every family inherits it.

**Deferred (not v1)** — chart-type additions, not accessibility; not selected by the maintainer:

- **Combo / `ComposedChart`** — Recharts ships it first-class; shadcn only approximates via bar-mixed. Means the v1 core inventory has *no* multi-series-type chart. Revisit as a fast-follow.
- **Scatter / bubble** — shadcn has none either; a known parity-neutral coverage hole for "recreate any design system."

## Verified gotchas (confirmed in code at `a4c39a38`)

These are the traps that will bite; each is grounded in a file read, not assumed.

- **`InteractiveDemo` playgrounds are high-risk for charts — recommend Example-only.** `playground-fidelity.spec.ts` (`www/src/modules/docs/codegen/`) is a binding vitest test over *every* `<InteractiveDemo>`: it asserts the shown code is an `oxfmt` fixed-point, collapsed==dedented-expanded, and all icons imported. Chart playgrounds (data arrays + `ChartConfig` + Recharts JSX) are the hardest possible fixed-point case. Worse, `buildControlsFromReference` (`interactive-demo/process-controls.ts:38`) **throws** `API reference not found for <name>` with no reference, and resolves every `controls` entry against the reference's props — but the meaningful chart knobs (`accessibilityLayer`, `layout`, `dataKey`, `data`) live on Recharts components, **not** on any dotUI `*Props` interface. There is essentially nothing useful to expose as controls. → Charts use `<Example>`/`<ComponentsGrid>` galleries, not `<InteractiveDemo>`.
- **`componentsData` double-duty (now a requirement, given full builder integration).** Adding a `'charts'` category to `components-data.ts` populates the docs gallery **and** the `/create` preview Select (`customizer-panel.tsx:387` does `componentsData.flatMap(c => c.components).map(...ListBoxItem...)`). The iframe preview resolves `GroupExamplesIndex[slug] ?? ExamplesIndex[slug]`; a chart slug with no `examples.tsx` renders a **blank** preview. → Phase 0.3 chose full builder integration, so this is the *intended* path: every chart family ships a working `examples.tsx` (from [003](003-chart-families.md)) and its first example renders live in `/create`. Accept recharts+d3 in the customizer iframe.
- **`llms.txt` miscategorizes charts.** `routes/llms[.]txt.tsx` buckets pages by `url === '/docs/components' || url.startsWith('/docs/components/')` → Components, **everything else → Overview**. New `/docs/charts/*` pages land under "## Overview". → Add a third bucket / generalize the section grouping (see [004](004-docs-section-gallery-nav.md)).
- **Two taxonomies, both need a charts entry.** `ComponentGroup` (builder, `registry/types.ts`) and `componentsData` (docs gallery, keyed by `.slug`) are independent — `componentsData` already has a `'data-display'` slug with **no** matching `ComponentGroup` member. Touch both.
- **Dark-mode reversal trap.** `resolveColorConfig` derives dark via `reverseRamp` (lightness-ladder flip). Reusing that for categorical chart colors makes a "red series" not-red in dark mode. → Emit a **separate** dark-tuned set; keep hues constant, only nudge L/C. Pair `--on-chart-N` foregrounds or legend/label text is unreadable.
- **Styles-less ≠ params-less.** The publisher detects shipping behavior by `existsSync('styles.ts')` (`build-publishables.ts`), independent of `params`. `loader/meta.ts` *has* params yet is the styles-less precedent. A chart can be styles-less and still carry params later. (The draft conflated these; conclusion "charts ship styles-less for v1" still holds.)
- **`'use client'` is inert here.** TanStack Start + Vite/Rolldown has no RSC/`'use client'` enforcement (no `next-themes`; dark mode is a plain `.dark` class). Keep the directive for shadcn/v0 parity, but SSR safety rests entirely on Recharts' `initialDimension` + `min-h`/`aspect` contract (and possibly a `ClientOnly` wrapper) — verify in a **production** build, not just dev.
- **`chart.json` determinism is unverified.** `ChartConfig` is a generic record with `ComponentType`/`ReactNode`/function members and a `color | theme` union. `typescript-api-extractor` may emit noisy or order-unstable JSON (the union-member-order flip CLAUDE.md already warns about). Validate the emitted `chart.json` before relying on `<Reference name="chart" />`.
- **Drift discipline.** `build:registry` regenerates 9 committed files + `base/colors.css`; `build:references` must run **full** (unscoped). `__generated__/publishables/` is gitignored — don't commit it. Confirm each chart lands in the publishables "written" list, not "skipped".
- **Open-in-v0 showcase.** Only relevant **if** charts join `components/marketing/showcase/cards.tsx`. If they do: add `recharts` to `DEP_VERSIONS` in `build-showcase-bundle.ts`, ship `--chart-N` in the bundle `globals.css`, and add any newly-reached `@/registry/theme` export to `themeStub()` (the drift guard can't catch a missing named export there — it once broke Open in v0).

## Deferred / out of scope (binding for future work)

- **Density-aware chart sizing** (tick/padding scaling with the density axis) — v1 charts are styles-less and themed by Recharts inline props, so the density builder axis will **not** affect them. Surface this to users rather than silently ignoring an axis. Revisit only if a fully-static-literal `styles.ts` is achievable (publisher `extract-config.ts` throws on non-static `createStyles` args and silently skips the item).
- **Translucent/elevated tooltip "grouped tweak"** — the draft cited a "planned menu/popover translucency switch"; **no such axis exists** in `menu/styles.ts` or `popover/styles.ts` and no plan in `docs/plans` proposes one. Dropped as a phantom dependency. If wanted, it's a separate axis proposal.
- **Mirroring all ~70 shadcn blocks as separate registry items** — rejected in favor of one primitives item + 6 family items with variants-as-demos (the `table` model). Far less registry surface, still `add`-able per family.
- **Mobile-nav double-listing** — adding `Charts` to `navItems` may list it once as a nav item and once via the auto-listed page-tree folder on mobile. Accept or special-case in [004](004-docs-section-gallery-nav.md).

## Conventions

- Update your plan's status row above (TODO | IN PROGRESS | DONE | BLOCKED | REJECTED) with a one-line reason.
- Plans are self-contained for cold-context executors: verified excerpts, per-step verification, drift checks against `a4c39a38`, and STOP conditions. Honor STOP conditions — report back instead of improvising.
- Charts are a **synced group**: `chart-bar ⇄ chart-line ⇄ chart-area ⇄ chart-pie ⇄ chart-radar ⇄ chart-radial` share the `chart` primitive and the `--chart-N` palette; a change to the shared primitive lands across the group in one PR (Button ⇄ ToggleButton convention).
