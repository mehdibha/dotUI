# 004 — Charts docs section, gallery, nav, llms.txt

> Planned at `a4c39a38`. Part of [2026-06-13-charts](README.md). Gated by [003](003-chart-families.md) (gallery cards/pages reference family demos that must exist, or the nodes render nothing).

## Goal

A new top-level **Charts** section in the docs sidebar, a charts **gallery/overview** page reachable from the navbar (and linked from the docs overview), and one page per chart family — all using `<Example>`/`<ComponentsGrid>` galleries, **not** `<InteractiveDemo>` (see README gotcha).

## Verified codebase facts

- Docs sidebar order is driven by fumadocs `meta.json`: `www/content/docs/meta.json` = `{ "title":"Docs", "root":true, "pages":["(root)","components"] }`; component pages auto-discover (no `meta.json` in `components/`).
- The splat route `_app/docs/$.tsx` auto-renders any MDX under `content/docs` — **no route file needed** for new pages.
- `(root)/components.mdx` is the existing gallery: `## Heading` + `<ComponentsGrid category="<slug>" />`. `ComponentsGrid` (`modules/docs/components-list/components-grid.tsx`) looks up `category` in `componentsData` by `.slug`; unknown slug warns.
- `CATEGORY_PREVIEW_HEIGHT` in `components-grid.tsx` has `dates/navigation/data-display/colors` entries (e.g. `'data-display':'h-52'`).
- Gallery card previews come from `modules/docs/components-list/demos/<slug>.tsx` registered in `demos/index.ts` (`componentDemos` map); missing → card falls back to plain name text.
- `componentsData` **also** populates the `/create` preview Select (`customizer-panel.tsx:387`) — see the coupling gotcha below.
- Navbar items: `navItems` in `www/src/config/site.tsx` (flat `{name,to}[]`), consumed by `header.tsx` (desktop) and `mobile-nav.tsx` (mobile, which **also** auto-lists the page-tree folder).
- `search-command.tsx` sources the page tree (auto-includes new `charts/` folder) **and** has a hardcoded "Menu" section listing only `{Docs, Components}`.
- `routes/llms[.]txt.tsx` buckets pages: `url === '/docs/components' || url.startsWith('/docs/components/')` → **Components**, everything else → **Overview**.
- `routes/sitemap[.]xml.tsx` and `routes/llms-full[.]txt.tsx` auto-include all `docsSource.getPages()` — charts covered for free (verify, don't edit).

## Steps

### A. New sidebar section

1. Add `"charts"` to `www/content/docs/meta.json` pages: `["(root)", "components", "charts"]` (array position = sidebar order; the folder auto-titles "Charts").
2. Create `www/content/docs/charts/meta.json`: `{ "title": "Charts", "pages": ["overview", "bar-chart", "line-chart", "area-chart", "pie-chart", "radar-chart", "radial-chart"] }` (controls page order; alphabetical otherwise).
3. Create `www/content/docs/charts/overview.mdx` — the **gallery**: frontmatter (`title`, `description`) + `## Bar` / `## Line` / … headings each followed by `<ComponentsGrid category="charts" />` (or per-family sub-categories if you want one grid per family — see decision below). Routable at `/docs/charts/overview` (splat route, no route file).
4. Create one `www/content/docs/charts/<family>-chart.mdx` per family: frontmatter + `## Examples` with `<Example name="chart-<family>/demos/<variant>" title="…" />` for each variant + `<Reference name="chart" />` for the primitives' props. **No `<InteractiveDemo>`.**

### B. Gallery taxonomy (`componentsData`) — mind the double-duty

5. Add to `www/src/modules/docs/components-list/components-data.ts`:
   ```ts
   { title: 'Charts', slug: 'charts', components: [
       { name: 'BarChart',    slug: 'chart-bar',    href: '/docs/charts/bar-chart',    scale: 1, status: 'in review' },
       { name: 'LineChart',   slug: 'chart-line',   href: '/docs/charts/line-chart',   scale: 1, status: 'in review' },
       { name: 'AreaChart',   slug: 'chart-area',   href: '/docs/charts/area-chart',   scale: 1, status: 'in review' },
       { name: 'PieChart',    slug: 'chart-pie',    href: '/docs/charts/pie-chart',    scale: 1, status: 'in review' },
       { name: 'RadarChart',  slug: 'chart-radar',  href: '/docs/charts/radar-chart',  scale: 1, status: 'in review' },
       { name: 'RadialChart', slug: 'chart-radial', href: '/docs/charts/radial-chart', scale: 1, status: 'in review' },
   ] }
   ```
6. **Builder preview coupling — path (a), per Phase 0.3 (full builder integration).** Adding the above puts each chart slug into the `/create` preview Select (`customizer-panel.tsx:387`). The iframe resolves `GroupExamplesIndex[slug] ?? ExamplesIndex[slug]`; each family ships a working `examples.tsx` (from [003](003-chart-families.md)), so its first example renders live in the builder. This is intended — recharts+d3 in the customizer iframe is accepted. Verify no slug renders a blank preview (every family `examples.tsx` must have at least one example).
7. Add `'charts': 'h-52'` to `CATEGORY_PREVIEW_HEIGHT` in `components-grid.tsx` (charts want taller cards).
8. For each gallery card preview, add `modules/docs/components-list/demos/<slug>.tsx` and register it in `demos/index.ts` (`componentDemos` map), else cards show plain text.
9. Add a `## Charts` heading + `<ComponentsGrid category="charts" />` to `(root)/components.mdx` so the existing Components overview surfaces charts too.

### C. Nav + discovery wiring

10. Add `{ name: 'Charts', to: '/docs/charts/overview' }` to `navItems` in `www/src/config/site.tsx` — point at a **concrete page** (the bare `charts/` folder has no implicit index; `/docs/charts` alone may 404). Auto-appears in `header.tsx`. On mobile it may appear twice (nav item + auto-listed page-tree folder) — accept or special-case in `mobile-nav.tsx`.
11. **`llms.txt` third bucket** — edit `routes/llms[.]txt.tsx` so `/docs/charts` + `/docs/charts/*` form their own `## Charts` section instead of falling into `## Overview`. Mirror the existing components-prefix check (generalize the partition rather than hardcoding a second prefix if practical).
12. **search-command** — confirm charts auto-appear via the page tree; optionally add a "Charts" shortcut to the hardcoded Menu section (`{Docs, Components}` → `{Docs, Components, Charts}`).
13. (Optional) add a prose link to `/docs/charts/overview` from `(root)/index.mdx`.

### D. Free-but-verify

14. `sitemap.xml` and `llms-full.txt` auto-include charts pages — **verify**, don't edit. Ensure each chart MDX renders clean processed markdown (no broken demo nodes) so `llms-full.txt` concatenation stays valid.

## Done criteria

- "Charts" appears as its own sidebar section after "Components"; the family pages render their example galleries; `<Reference name="chart" />` resolves.
- The charts gallery page is reachable from the navbar and from the Components overview; every embedded `<Example>`/`ComponentsGrid` id resolves to an existing registry demo (no blank cards, no missing-reference throw).
- `/create` preview Select renders a real chart preview for every chart slug — no blank preview (path 6a).
- `llms.txt` shows a distinct `## Charts` section; `sitemap.xml` lists the new pages.
- `pnpm check` + `pnpm typecheck` green; if any docs codegen/spec runs (`playground-fidelity.spec.ts` only fires for `InteractiveDemo` — none added), it stays green.

## STOP conditions

- Do **not** add `<InteractiveDemo>` to chart MDX (binding `playground-fidelity.spec.ts` + `buildControlsFromReference` throws without a reference and chart knobs aren't on any `*Props`).
- If any chart slug renders a **blank** `/create` preview, stop and fix its `examples.tsx` — full builder integration means every chart in `componentsData` must preview, not error or blank.
