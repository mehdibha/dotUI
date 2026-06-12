# Static server functions: keep or replace?

**Status:** assessment, 2026-06-11. Open question: migrate the docs data loading off `@tanstack/start-static-server-functions`? Recommendation below is to migrate to plain server functions + CDN cache headers.

> Decision (2026-06-11): migrate — option B, implemented in the PR that adds this report. Measured before/after comparison appended at the bottom. The shipped header drops the sketch's `stale-while-revalidate=60`: entries never expire within a deployment (`s-maxage` = 1 year) and a new deploy starts an empty cache, so there is never a stale entry to serve.

## TL;DR

The static-server-functions setup works in production today (verified: docs client-side navigations are served 100% from Vercel's CDN, zero function invocations). But the package is officially experimental, barely maintained, has two open upstream bugs in its core mechanism, and our setup has a **live correctness bug**: baked JSONs are browser-cached for 1 year `immutable` while their filenames don't change when content changes — returning visitors see stale docs data after deploys. Recommendation: drop the middleware and use plain `createServerFn` + `Cache-Control` headers — what tanstack.com itself and fumadocs' main TanStack Start example both do. Prerendering (the thing that makes direct visits/SEO fast) is unaffected; it doesn't depend on this package.

## Current setup (audited)

- `www/src/routes/_app/docs/$.tsx` — `serverLoader` (docs page data: title, description, rawContent, neighbours) wrapped in `staticFunctionMiddleware`. Load-bearing.
- `www/src/routes/_app/route.tsx` — `getPageTree` wrapped in `staticFunctionMiddleware`. Load-bearing.
- `www/src/lib/github.ts` — `getGitHubContributors` (static middleware) + `getGitHubStars`. **Entirely dead code: nothing imports `@/lib/github`.**
- `www/package.json` `build:postprocess` — `cp -r .vercel/output/dist/client/__tsr .vercel/output/static/__tsr` — **obsolete**. Verified on the 2026-06-10 build output: `.vercel/output/dist/client` no longer exists; the prerender pass now writes the cache JSONs (65 files) directly into `.vercel/output/static/__tsr/staticServerFnCache`. The `2>/dev/null || true` makes it silently no-op. (Upstream fix: TanStack/router PR #6940, Mar 2026.)

How it works: at build time, prerendering (enabled in `www/vite.config.ts`, `crawlLinks` defaults to true so the sidebar covers all docs pages) executes each loader; the middleware writes each server-fn result to `/__tsr/staticServerFnCache/<sha1(functionId + input)>.json` (only during prerender — gated on `TSS_CLIENT_OUTPUT_DIR`, set exclusively by the prerender phase). In production browsers, the middleware's client side replaces the server-fn call with a fetch of that JSON. Direct visits never touch it (prerendered HTML + dehydrated loader data).

## Verified production behavior (dotui.org, 2026-06-11)

| Request | cache-control | Served |
| --- | --- | --- |
| `/docs/components/loader` (HTML) | `public, max-age=0, must-revalidate` | CDN HIT, fresh after deploys |
| `/__tsr/staticServerFnCache/<hash>.json` | `public, max-age=31557600, immutable` | CDN HIT |
| Non-existent `__tsr` JSON | 404, `text/html` | falls through to SSR |

## Findings

### 1. Live bug: 1-year immutable browser caching on input-addressed files

The cache filename is `sha1(functionId + hash(input))` — the **content is not part of the name**. Same page slug → same filename forever (confirmed: the same hash filename exists in yesterday's local build and in the separately-built production deploy). With `max-age=31557600, immutable`, a returning visitor's browser serves year-old JSON from disk without a network request. After a docs content deploy, client-side navigations to previously visited pages show stale title/description, stale "copy page" rawContent, stale pager neighbours — and if a page's source file was renamed, a stale `path` makes `clientLoader.getComponent()` fail (broken page). Direct visits stay fresh (HTML is `max-age=0`). The immutable header is not in our Vercel `config.json` routes — it comes from the Nitro/Start static-asset layer, i.e. not something we configured or control today.

### 2. No fallback on cache miss

`staticFunctionMiddleware`'s client side does `fetch(url).then(r => r.json())` with no `r.ok` check and no try/catch — a missing JSON returns the HTML 404 page, `.json()` throws, and the error propagates instead of falling back to the real server function. Consequence: client-side navigation (or hover preload — `defaultPreload: 'intent'`) to a removed/never-baked docs URL renders `DefaultError`, not the NotFound page. Direct visits to bad URLs are fine (SSR runs the fn normally, `notFound()` works). Bigger consequence: any upstream regression in where the JSONs land (see #7479/#6787 below — a recurring bug class) breaks **all** docs client navs in production, silently.

### 3. Upstream status: experimental, thinly maintained

- Official docs open with `> [!WARNING] Static Server Functions are experimental!` ([guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions)).
- ~8.0k weekly downloads vs ~14.3M for `@tanstack/react-start` (~0.06% adoption). No README, no unit tests (`test:unit` is `exit 0`), package description is copy-paste boilerplate.
- ~3 substantive fixes in 9 months, mostly community-supplied. Four open issues with zero maintainer replies: [#7479](https://github.com/TanStack/router/issues/7479) (static cache 404s on production builds — Nitro build-order/routing), [#6787](https://github.com/TanStack/router/issues/6787) (static fn runs on every visit — cache never lands in output dir), [#6152](https://github.com/TanStack/router/issues/6152) (`basePath` ignored), [#6420](https://github.com/TanStack/router/issues/6420) (`crypto.subtle` in `vite preview`).
- Still published in lockstep (1.167.x, and into `2.0.0-alpha.x`), so not abandoned — but no maintainer statement on its future exists anywhere.

### 4. This repo already burned on its integration gaps twice

- Commit `0873262f` (Jan 2026): pnpm patch because the middleware wrote cache files at runtime on Vercel's read-only FS (`ENOENT: mkdir 'dist'`). Fixed upstream later; patch dropped in #152.
- Commit `4df5f23f` (Jan 2026): the `__tsr` copy hack in `build:postprocess`, needed because the cache landed outside Vercel's static dir. Fixed upstream (PR #6940); hack now dead weight.

Both are instances of the same fragility class as open bugs #7479/#6787: the build-output plumbing between Start's prerender, Nitro presets, and the host keeps shifting under this package.

### 5. What the reference implementations do

- **tanstack.com** (TanStack's own site): zero usages of `staticFunctionMiddleware`. Docs load via plain `createServerFn` + `setResponseHeader` CDN cache headers (`src/utils/docs.functions.ts`).
- **fumadocs** official `examples/tanstack-start`: plain `createServerFn` in the loader, no static middleware. The middleware appears only in `examples/tanstack-start-spa` — static export with **no server at runtime**, where baked JSON is the only option. We have a server (Vercel functions), so we're not in that niche.
- TanStack's [static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) and [ISR guide](https://tanstack.com/start/latest/docs/framework/react/guide/isr) (both non-experimental) never mention static server functions: the blessed path is prerendered HTML + `Cache-Control`/stale-while-revalidate + router `staleTime`.

## Options

### A. Keep + harden

Keep the middleware; fix the rough edges: inject a Vercel route header (`patch-vercel-config.mjs` already injects routes) overriding `/__tsr/staticServerFnCache/(.*)` to `public, max-age=0, must-revalidate` (kills finding 1; etag revalidation keeps it cheap); vendor the ~60-line middleware into `www/src/` with an `r.ok` fallback to `ctx.next()` (kills finding 2 and the supply-chain worry — it's MIT, only dep is seroval). Preserves the zero-invocation property: client navs stay pure CDN. Cost: we own a fork of experimental plumbing whose upstream integration keeps shifting; the postprocess stays bespoke.

### B. Plain server functions + CDN cache headers (recommended)

Remove the middleware. The two GET server fns set, on their success path only (never on `notFound()`), `Cache-Control: public, max-age=0, must-revalidate, s-maxage=31536000, stale-while-revalidate=60` via `setResponseHeader` from `@tanstack/react-start/server`. Vercel's CDN caches the GET response per URL (payload serialization is deterministic) and purges on every deploy → always fresh, no staleness windows. Effects:

- Direct visits: unchanged — still prerendered static HTML (prerendering runs the loaders at build regardless; it does not depend on this package).
- Client navs: first hit per page per region invokes the function (~100–300ms warm on Fluid), then CDN HIT (~same as today). Hover preloads likewise.
- Cache miss / bad URL: falls through to the real function → proper NotFound restored.
- Deletable: `@tanstack/start-static-server-functions` dep, the `cp` line in `build:postprocess`, `www/src/lib/github.ts` (dead either way).
- This is byte-for-byte the tanstack.com pattern; nothing experimental remains.

Trade-off vs A: gives up "zero invocations, instant first nav" for "negligible invocations, instant after first nav per region per deploy" — for a docs site, noise.

### C. Eliminate the docs server fn entirely (later, optional)

The MDX body is already a content-hashed static client chunk (fumadocs `createClientLoader`); the page tree is already in the parent loader; `findNeighbour` is isomorphic, so neighbours are derivable client-side; `rawContent` could be fetched on demand from the existing `/docs/{$}.md` server route when the copy button is clicked. That would make docs client navs server-fn-free without any experimental package. Bigger refactor (head()/SEO data flow on client navs needs care) — not needed to fix anything above; revisit only if B's first-hit latency ever matters.

## Recommendation

Option B. The user-visible win of A over B is small (first-nav-per-page latency only), and A's price is owning experimental build plumbing that has bitten this repo twice and is currently biting production (stale immutable JSONs). Migration sketch: delete `www/src/lib/github.ts`; drop the middleware from `serverLoader` and `getPageTree` and add success-path cache headers; remove the dep and the `cp` line; update the two `staleTime: Infinity` comments (the staleTime itself stays correct); verify on a Vercel preview that `/_serverFn/` GETs go MISS→HIT, client navs work, and a client nav to a bad docs URL shows NotFound.

## Measured before/after (2026-06-11)

Method: TTFB via curl on a pre-warmed connection (mimics a client-side nav over the page's existing HTTP/2 connection), 8 runs per URL, single vantage point (FRA edge, ~50ms baseline RTT). Before = production dotui.org (static server functions, commit `0da0afa3`); after = the Vercel preview deployment of this PR (`dotui-h3sj4t9fm`). Server-fn requests sent with the client protocol headers (`x-tsr-serverFn: true`, framed accept, `Sec-Fetch-Site: same-origin`). The data request is the only thing that changed: direct visits serve the same prerendered HTML in both architectures.

| Data fetch per client-side docs nav | Before (static JSON file) | After (server fn + s-maxage) |
| --- | --- | --- |
| Steady state (CDN HIT) — median over 9 pages | 57–91 ms | 66–114 ms (one noisy outlier at 186 ms) |
| First request per page per region per deploy | n/a (always static) | 315–466 ms (warm function) |
| Worst case: fresh deploy, cold function | n/a | 1.7–2.1 s (observed on the first two invocations only) |
| Payload size (e.g. loader page) | 625 B | 635 B (seroval result envelope, ~+10 B) |
| Direct visit HTML (sanity) | 63 ms median, CDN HIT | 77 ms median, CDN HIT |

Behavior changes verified on the deployed preview:

- CDN caching works: `x-vercel-cache: MISS` once per URL, then `HIT` with `age` advancing; Vercel consumes `s-maxage` and the browser receives `cache-control: public, max-age=0, must-revalidate` — the year-long `immutable` browser cache (finding 1) is gone, so docs data is fresh immediately after every deploy.
- notFound responses carry no cache header, are never CDN-cached (MISS on repeat), and serialize `isNotFound` in-band — client-side navs to bad URLs render the NotFound page again instead of the error boundary (finding 2).
- Response bodies verified byte-equivalent in content (same fields, same rawContent) to the old baked JSONs.

Bottom line: steady-state navigation latency is at parity (CDN HIT both sides); the migration's cost is one ~0.3–0.5 s function invocation per docs page per region per deploy (up to ~2 s if the function is cold), paid by the first visitor only; in exchange the stale-browser-cache bug and the broken not-found path are fixed and the experimental dependency plus its build hacks are gone.

Caveats: single vantage point, n=8 per URL, not a load test; preview measured on `*.vercel.app` while before was the production custom domain (both Vercel edge); cold-start frequency on production depends on traffic (Fluid keeps the function warm under steady load).

### Reference point: ui.shadcn.com (same method, same vantage, same day)

shadcn's docs are Next.js App Router on Vercel, fully prerendered (HTML and RSC payloads both serve `x-vercel-cache: HIT` with `max-age=0, must-revalidate`). Their client-side-nav data fetch is the RSC payload (`RSC: 1` request to the page URL). Measured across 6 component pages (`/docs/components/radix/{button,select,table,dropdown-menu,tabs,accordion}`):

| Median TTFB (warm conn) / transfer size | dotUI after (this PR) | ui.shadcn.com |
| --- | --- | --- |
| Direct visit HTML | 77 ms / ~18 KB | 77–117 ms / 71–90 KB |
| Client-nav data fetch, steady state | 66–114 ms / 0.6–3.6 KB | 69–80 ms / 48–66 KB |
| First hit per page per region per deploy | 315–466 ms (function MISS; ~2 s if cold) | none (payloads prerendered) |

Read: steady-state latency is the same league — everyone is CDN-bound. dotUI transfers are an order of magnitude smaller because the MDX body ships once as a content-hashed JS chunk (browser-cached immutable) while the per-nav fetch is a small JSON; RSC re-ships the rendered page tree on every first visit to a page (~50 KB). The axis where shadcn's setup is strictly better — no function invocation ever — is exactly what static server functions tried to give us (option A / the before state); Next.js gets it for free because prerendering RSC payloads is first-class there, with build-id-based cache invalidation instead of our input-addressed-immutable bug.
