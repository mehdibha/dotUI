# Docs app — TanStack best-practice audit

_Date: 2026-06-04 · Scope: the `www` docs site (TanStack Start, Router, and fumadocs)_

## TL;DR

**The docs approach is sound and largely idiomatic.** The `www` app is a TanStack
Start and Router application that renders MDX docs through fumadocs, prerendered to
static HTML. We audited it across **13 dimensions** against the official TanStack
agent skills. Seven dimensions pass cleanly; the rest surfaced **12 raw findings**,
which an adversarial verification pass narrowed to **6 confirmed issues — all LOW
severity**. No correctness, security, or data-loss issues were found.

This PR **applies the 5 safe fixes** and **defers 1** as a deliberate UX judgment
call. The remaining raw findings were filtered out because they were either factually
wrong against the installed package versions, or real-but-immaterial to a
prerendered-static site.

## Method

1. **Vendored the TanStack skills the app uses** into `.agents/skills/` (see
   [Vendored skills](#vendored-skills)) — these are the authoritative best-practice
   reference, version-controlled alongside the existing `mattpocock/skills`.
2. **Multi-agent audit.** One expert agent per dimension read the authoritative skill
   _and_ the actual code, then reported deviations with evidence (`file:line`).
3. **Adversarial verification.** A skeptical verifier re-checked every finding against
   ground truth, explicitly accounting for the prerendered-static, `staticFunctionMiddleware`,
   and fumadocs context (e.g. recommendations that only help per-request SSR or client SWR
   caching do not apply here). Only findings that were _real_ **and** _applicable_ were actioned.

## What's already idiomatic

The audit confirmed these are done correctly and need no change:

| Dimension                                      | Verdict                                                                                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Router config** (`router.tsx`, `__root.tsx`) | `scrollRestoration`, `defaultPreload: "intent"`, `defaultNotFoundComponent`, `<HeadContent/>`/`<Scripts/>` all per the skills. No `createRootRouteWithContext` needed (no router-context DI). |
| **SSR / head**                                 | Root + per-route `head()` with full meta/OG/twitter + `links`; `<Scripts/>` correctly in `<body>`. Matches the SSR skill's document-shell pattern.                                            |
| **Path params**                                | Splat (`$` → `params._splat`), optional (`{-$category}`), and suffix (`{$}.md`) routes all use the documented keys.                                                                           |
| **Search params**                              | `validateSearch` with Zod v4 + `.catch()` fallbacks; `useSearch` for reads. Idiomatic.                                                                                                        |
| **Code splitting**                             | Automatic code splitting is always-on under the Start plugin; no manual config needed.                                                                                                        |
| **Server functions / middleware**              | `createServerFn({ method: "GET" })` for read-only loaders, correct middleware → validator → handler order, `notFound()` thrown inside handlers.                                               |
| **Not-found handling**                         | Router-wide `defaultNotFoundComponent`; `NotFound` avoids the `useLoaderData` pitfall; `throw notFound()` bubbles correctly.                                                                  |
| **Execution model**                            | The `serverLoader` (server-only fumadocs work behind `createServerFn` + `staticFunctionMiddleware`) / `clientLoader` split is the canonical fumadocs + Start pattern.                         |
| **Deployment**                                 | nitro preset selected per-target; prerender filter correctly excludes query-string URLs; `preview/$slug` uses `ssr: false` sensibly; ISR/cache via `vercel.ts`.                               |
| **fumadocs integration**                       | Page tree shared from the `_app` parent loader into the docs layout via `getRouteApi("/_app")` — the skill's documented cross-route typed-access pattern.                                     |

## Confirmed findings & fixes

All six are **LOW** severity.

| ID                                      | Area           | Status      | Summary                                                                                                                                |
| --------------------------------------- | -------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `not-found-errors-1` / `data-loading-1` | Error boundary | ✅ Fixed    | No router-wide `defaultErrorComponent` / per-route `errorComponent`; a non-`notFound` loader/render error had no scoped UI.            |
| `data-loading-3`                        | Caching        | ✅ Fixed    | Static, prerendered docs/page-tree loaders had no `staleTime`, so client re-matches background-revalidated immutable data.             |
| `server-routes-1`                       | Server route   | ✅ Fixed    | `r/$name` signalled 404 with `throw notFound()` inside a raw-`Response` handler instead of returning a `Response`.                     |
| `fumadocs-integration-1`                | Efficiency     | ✅ Fixed    | The docs `$` loader serialized the full page tree into loader data that no component consumes (the `_app` parent already provides it). |
| `data-loading-2`                        | Pending UI     | ⏸️ Deferred | No `pendingComponent` for cold client navigations — a UX judgment call (see below).                                                    |

### Fixes applied in this PR

- **Router-wide error boundary** — added `defaultErrorComponent: DefaultError` in
  `www/src/router.tsx` and a new `www/src/components/default-error.tsx`. It mirrors the
  `NotFound` chrome and retries via `router.invalidate()` (re-runs loaders), per the
  data-loading skill's "use `router.invalidate()`, not `reset()`" guidance. Covers both
  `data-loading-1` and `not-found-errors-1`. Render-only, so it cannot affect prerender.
- **`staleTime: Infinity`** on the two static loaders — `www/src/routes/_app/docs/$.tsx`
  (docs content) and `www/src/routes/_app/route.tsx` (page tree). Both are baked at build
  time via `staticFunctionMiddleware`, so they are immutable until the next deploy;
  background revalidation was pure waste.
- **Proper 404 Response** — `www/src/routes/r/$name.tsx` now returns
  `Response.json({ error: "Not found" }, { status: 404 })` (keeping the endpoint's JSON
  content type for `shadcn add` consumers) instead of `throw notFound()`, and drops the
  now-unused `notFound` import.
- **Dropped dead page-tree serialization** — `www/src/routes/_app/docs/$.tsx` no longer
  serializes `pageTree` into its loader data; the raw tree is still computed for
  `findNeighbour`. This trims wasted prerender compute and dead bytes from every doc
  page's dehydrated payload.

All fixes were verified: format and lint clean (`oxfmt`/`oxlint`), `tsc --noEmit` passes,
and the docs site was run in a dev preview — `/docs` renders fully (sidebar, content,
TOC, pager) with no new console errors, the 404 endpoint returns `404 {"error":"Not found"}`,
and a valid component (`/r/toast`) still returns `200`.

### Deferred (intentional)

- **`data-loading-2` — pending UI.** There is no `pendingComponent` for cold client
  navigations (touch devices, fast clicks before intent-preload completes). This is a
  **deliberate UX decision**, not a defect: `defaultPreload: "intent"` covers the common
  hover path, and adding a pending affordance neither helps nor hurts prerendering. Left
  for a design decision rather than auto-applied. If wanted, add a lightweight
  router-level `defaultPendingComponent`.

## Filtered out by verification

Shown for transparency — these raw findings did **not** survive the adversarial pass:

| Finding                                                     | Why dropped                                                                                                                                                                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `devtools()` not the first Vite plugin                      | Real position, but immaterial: `devtools()` already precedes `viteReact()` (the JSX transformer), so source-injection still works; the plugins before it (`mdx`/`nitro`/`tailwind`) don't transform component JSX. |
| `devtools-vite` under Vite 8 (outside `^6 \|\| ^7`)         | Refuted — the installed package's peer range includes Vite 8.                                                                                                                                                      |
| `getGitHubStars` is a bare async fn, not a `createServerFn` | Real stylistic inconsistency with its sibling, but it works correctly as-is; not a best-practice violation. Left as-is (out of "safe fixes" scope).                                                                |
| `$.tsx` statically imports `docsSource`                     | Not a deviation — the import is only used inside the server handler and is tree-shaken from the client bundle.                                                                                                     |
| Prerender without `crawlLinks`/`pages`                      | Refuted — the installed `@tanstack/start-plugin-core` version discovers the docs splat route without those options.                                                                                                |

## Vendored skills

The PR adds the **18 TanStack skills the app actually exercises** to `.agents/skills/`
(+ `.claude/skills/` symlinks), following the existing `portless` precedent (these are
not from `mattpocock/skills`, so `skills-lock.json` is intentionally untouched):

`tanstack-router-core`, `-data-loading`, `-ssr`, `-navigation`, `-not-found-and-errors`,
`-type-safety`, `-path-params`, `-search-params`, `-plugin`; `tanstack-start-core`,
`-server-functions`, `-server-routes`, `-middleware`, `-execution-model`, `-deployment`;
`tanstack-react-start`; `tanstack-devtools-vite-plugin`, `-app-setup`.

**Intentionally excluded** (not used by this app): `tanstack-router-code-splitting`
(automatic under Start, no config to maintain), `tanstack-router-auth-and-guards` (public
site, no auth), `tanstack-start-server-core` (no custom server entry), and
`tanstack-virtual-file-routes` (the app uses filesystem routing).
