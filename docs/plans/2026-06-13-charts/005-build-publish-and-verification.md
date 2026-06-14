# 005 — Build, publish, drift, and verification

> Planned at `a4c39a38`. Part of [2026-06-13-charts](README.md). Run these checks after [002](002-chart-primitives.md)/[003](003-chart-families.md)/[004](004-docs-section-gallery-nav.md) and as the final merge gate.

## Dependency

1. Add `recharts: '^3.x'` to `www/package.json` `dependencies` and `pnpm install`. `meta.dependencies: ['recharts']` does **not** install it locally — demos, examples, `typecheck`, and the showcase scan all need it present in `node_modules`.
2. Verify Recharts `^3.x` peer-compat with the catalog `react ^19.2.1`. If it pulls a mismatched `react-is`, add a `pnpm` override (in `pnpm-workspace.yaml` / root `package.json` overrides) pinning `react-is` to the React-19 line.

## Registry build + commit (CI registry-drift gate)

3. `pnpm build:registry`. Confirm in its output that `chart` and all six `chart-*` items are in the publishables **"written"** list, **not** "skipped" (a skipped item silently drops from publishables, `/r/<name>`, and `registry.json`).
4. Registration is automatic (the `ui/*/meta.ts` glob in `scripts/registry-build.ts`) — **no** hand-edit to `www/src/registry/ui/registry.ts`.
5. Commit exactly the committed generated artifacts the CI registry-drift job diffs (9 files + colors.css):
   - `www/src/registry/__generated__/{demos.tsx, icons.tsx, base-css.ts, registry-items.ts, showcase-bundle.ts, __tabler__.ts, __hugeicons__.ts, __remix__.ts}`
   - `www/src/modules/create/__generated__/examples.tsx`
   - `www/src/registry/base/colors.css`
6. **Do NOT** commit `www/src/registry/__generated__/publishables/` (gitignored).

## References build + commit (CI references-drift gate)

7. `pnpm build:references` **full / unscoped** (a scoped `-f` run can flip union-member order → false drift). Commit the regenerated `www/src/modules/references/generated/*.json`.
8. Inspect `chart.json` for noise/non-determinism (the generic `ChartConfig` risk from [002](002-chart-primitives.md)). Run `build:references` twice and diff — output must be byte-identical. If not, narrow `chart/types.ts` exports or drop `<Reference>` for the generic config.

## SSR / React-19 verification (the real risk)

9. `'use client'` is **inert** in this TanStack Start + Vite/Rolldown app — do not rely on it. SSR safety = Recharts' `initialDimension` + `min-h`/`aspect` contract (kept verbatim in [002](002-chart-primitives.md)).
10. Run a **production** build (`pnpm build` then preview/serve), open a chart page, and confirm:
    - charts server-render and hydrate without layout collapse or a vanished chart (the minified-`displayName` regression),
    - no hydration warnings in the console.
11. If a chart drops in production, wrap chart bodies in a `ClientOnly` boundary (and document it) — do not ship a chart that only works in `dev`.

## Accessibility verification (required — Phase 0.4 approved)

12. Confirm `accessibilityLayer` is set on every family `base.tsx`/demo (per-chart Recharts prop, not a primitive default) — keyboard focus moves across data points, AT announces values.
13. Confirm the auto-derived visually-hidden data-table ([002](002-chart-primitives.md) `ChartDataTable`) mirrors each chart's series and is reachable by screen readers, with **no extra props** required from the user (optional `aria-label`/caption only). Spot-check one chart per family with a screen reader or the accessibility tree.

## Open-in-v0 showcase (only if charts join `cards.tsx`)

14. If a chart enters `www/src/components/marketing/showcase/cards.tsx`:
    - add `recharts` to `DEP_VERSIONS` in `www/scripts/build-showcase-bundle.ts` (pin a version),
    - ensure `--chart-N` ship in the bundle `globals.css`,
    - if the showcase closure now reaches a **new** `@/registry/theme` named export, add it to `themeStub()` in `build-showcase-bundle.ts` (the drift guard cannot catch a missing named export there — this once broke "Open in v0").
15. If charts do **not** join the showcase, this whole section is irrelevant.

## Final gate

16. `pnpm check` (oxlint + `oxfmt --check`) — CI fails on formatting and import order.
17. `pnpm typecheck`.
18. `pnpm test` **only if** `packages/colors` was touched (e.g. Option B `deriveChartColors` / new `emit-css` coverage from [001](001-chart-colors-axis.md)).
19. Sanity-fetch a few registry endpoints: `/r/chart`, `/r/chart-bar` — JSON well-formed, `dependencies` includes `recharts`, `registryDependencies` correct, `base.tsx` imports rewritten to `@/lib/utils`.

## Done criteria

- registry-drift and references-drift CI jobs pass (generated artifacts committed, byte-stable).
- All chart items "written"; endpoints serve clean publishables.
- Production build renders + hydrates charts cleanly.
- `accessibilityLayer` on every chart + the auto-derived hidden data-table verified (no extra user props).
- Charts preview live in `/create` (full builder integration) with no blank slugs.
- `pnpm check` + `pnpm typecheck` (+ `pnpm test` if colors touched) green.

## STOP conditions

- Any chart in the "skipped" list → stop, fix, do not commit.
- Non-byte-stable `build:references` output → stop, resolve determinism before committing.
- Chart renders in `dev` but not in a production build → stop, add the `ClientOnly`/`initialDimension` fix before merging.
