# Docs build memory: why the enhanced Vercel machine, and how to get off it

Status: research snapshot (2026-06-11). Measurements from a clean worktree at `claude/inspiring-jennings-76903c` (post-#228 main). Open question: flip the Vercel project back to the standard build machine — pending decision.

## TL;DR

The OOM that forced the enhanced (16GB) build machine is gone. It dated from the TanStack Start migration ([#148](https://github.com/mehdibha/dotUI/pull/148), Jan 2026), which shipped on **Vite 7** (JS-based Rollup) and added `NODE_OPTIONS='--max-old-space-size=8192'` to the build in the same commit. The very next dependency change moved to **Vite 8 (Rolldown, native)** — bundling memory left the JS heap entirely — but the machine setting and heap flag were never re-measured.

Measured today on a full cold build (registry build + `vite build` incl. client, SSR, nitro environments and 67-page prerender):

| Config | Wall time | Peak RSS | Result |
|---|---|---|---|
| `--max-old-space-size=8192` (current) | 23.7s | 2.7GB | ✅ exit 0 |
| `--max-old-space-size=2048` (stress test) | 20.5s | 2.59GB | ✅ exit 0, all 67 pages prerendered |

The JS-heap share is under 2GB; the rest of RSS is native (Rolldown, tailwind oxide, lightningcss) and doesn't care about the Node flag. A standard machine (8GB, 4 cores) has ~3x headroom. RSC is not needed for this — see "Architecture options" below.

**Recommended actions, in order:**

1. Vercel dashboard → project → Build machine → **Standard**. This is the entire cost fix; zero code.
2. Remove `NODE_OPTIONS='--max-old-space-size=8192'` from the `build` script in `www/package.json`. Pointless now, and an oversized limit makes V8 lazier about GC than it needs to be on a small machine.
3. Watch the first standard-machine deploy. Expect a slower wall clock (4 cores vs 8, ~1–3 min) but comfortable memory.
4. Separately (not needed for the machine switch): fix the `typeLinks` payload bomb in the reference generator — details below. It's the real "API references" problem today, but it's a page-weight problem, not a build-memory one.

## Where the memory went in January

Pipeline anatomy: `pnpm build:references` (manual, ts-morph) emits 183 JSONs into `www/src/modules/references/generated/` (5.8MB pretty-printed, 2.8MB compact). At MDX compile time, `rehype-transform.ts` inlines into each compiled page module: the transformed reference as a `JSON.parse("…")` string literal per `<Reference>` (129 across 60 pages), two shiki-highlighted HAST trees per `<Demo>`/`<Example>` (413 total), and serialized controls per `<InteractiveDemo>` (44).

On Vite 7, every one of those megabyte-scale string literals lived inside JS Rollup module ASTs, held simultaneously across three build environments (client, SSR, nitro) in one Node heap — that's the OOM. On Vite 8/Rolldown the parse/bundle work is native and streamed; the measurements above confirm the JS heap no longer carries it.

Build phases measured (local M-series, for the record): client env 4.3s (11,542 modules), SSR 3.0s (7,508), nitro 8.9s (5,772), prerender 67 pages at concurrency 12. Peak RSS lands during prerender, still under 2.7GB.

## The actual API-references problem today: `typeLinks`

The user-visible cost of the inline-JSON design is page weight, and it's dominated by one field. Of the 2.8MB compact reference data, **1.5MB is `typeLinks`**, and **0.9MB of that is fully serialized TypeScript stdlib interfaces** (`lib.dom.d.ts` / `lib.es*.d.ts`):

| File | Compact size | typeLinks | Single largest entry |
|---|---|---|---|
| color-field.json | 302KB | 283KB (94%) | `HTMLInputElement` — 270KB |
| number-field.json | 284KB | 266KB | `HTMLInputElement` — 264KB |
| context-menu.json | 238KB | 236KB | `HTMLDivElement` — 236KB |

This flows straight into chunk sizes: the color-field docs page ships a **361KB client chunk** (415KB SSR twin) that is mostly one `JSON.parse` literal containing a recursive dump of `HTMLInputElement`.

Why it happens: `scripts/api-docs-builder/src/config.ts` has `SKIP_RESOLVE_TYPES` with `HTMLElement`, `Element`, etc. — but concrete element interfaces (`HTMLInputElement`, `HTMLDivElement`, `HTMLTextAreaElement`, …) and Intl types (`NumberFormatOptions`) aren't on the list, so the resolver serializes the entire interface graph into `typeLinks`.

Why the fix is safe: in `type-renderer.tsx`, `LinkType` degrades gracefully when an id is missing from `links` (renders a plain styled span), and the renderer already has curated `DOC_LINKS` + a `globals-docs` MDN fallback for exactly these types. An MDN link is strictly better UX than an inline 270KB interface dump. The right skip predicate is **path-based** (`lib.dom.d.ts` / `lib.es*.d.ts` source files), not name-based, so the allowlist stops playing whack-a-mole.

Adjacent bug worth fixing in the same PR: `typeLinks` ids embed absolute machine paths (`/Users/mehdibenhadjali/Desktop/dotUI/node_modules/.pnpm/typescript@6.0.3/...`). That leaks local paths into shipped JS and makes `build:references` output machine-dependent — likely a contributor to the known "generator drift rewrites ~121 files" problem (CLAUDE.md). Ids should be package-relative (`react-aria-components/ColorField.d.ts:ColorFieldRenderProps`).

Smaller free win: `transformReference` emits `type` and `typeHighlighted` per prop, but `reference.tsx` renders only `shortTypeHighlighted`, `defaultHighlighted`, and `typeAst`. Two dead fields serialized into every page chunk (minor next to typeLinks, but it's a two-line deletion).

Estimated effect of the generator fix alone: worst docs chunks shrink ~3–4x (color-field 361KB → ~90KB), `build:references` output drops ~1MB, and every page parses far less JSON at hydration.

## Architecture options considered (the "better approach" question)

**1. Keep the inline design, fix the data (recommended now).** The generator skip + dead-field removal solve the observed problem with no moving parts. The MDX module stays self-contained, prerendering and the `DocsCopyPage`/llms pipeline are untouched.

**2. Move reference data out of MDX modules into the route loader.** The docs route already uses `createServerFn` + `staticFunctionMiddleware`, so loader payloads are prerendered to immutable static JSON under `__tsr/staticServerFnCache/` (cached 1y via `vercel.ts`). `<Reference name>` would become a thin component reading from context the route provides; the rehype plugin stops inlining data and just records which references a page needs. Page chunks drop to component-only code; reference data arrives as a separately-cached static asset instead of being parsed out of a JS string literal. Worth doing only if page weight still bothers after (1) — it's a medium refactor across rehype-transform, the docs route, and `mdx-components`.

**3. RSC — the question that prompted this research.** TanStack Start shipped experimental RSC support around April 2026 ([announcement](https://tanstack.com/blog/react-server-components)): "RSC as data" — `renderToReadableStream` Flight streams returned from server functions, cached like any loader data, compatible with prerendering, plus `createCompositeComponent` for server-rendered UI with client slots. For these docs it buys little over option 2: pages are already fully prerendered static HTML; the reference table needs client interactivity anyway (disclosure rows with state); and the page's heavy hydration cost is the interactive demos, which must ship as client code regardless. The distinctive RSC win — shipping zero reference data and zero table-rendering JS — is real but small once typeLinks is fixed, and it costs adopting an experimental API surface for the site's core feature. **Verdict: not now. Re-evaluate when Start's RSC goes stable**, at which point `<Reference>` (server component) + a tiny client disclosure island would be the natural shape.

**4. fumadocs dynamic/runtime compile mode.** Compiles MDX on demand at runtime instead of build time. Solves a build problem we no longer have by creating a runtime one (compile chain + shiki in the serverless function, slower TTFB). No.

## Side findings (not memory, logged for later)

- The nitro server output bundles the full shiki language set (`_libs/shikijs__langs.mjs`, **8MB**, plus 1.5MB themes) as lazily-imported chunks, and the client build emits every shiki grammar as its own chunk (`emacs-lisp` 780KB, `cpp` 626KB, …). Nothing in `www/src` imports shiki at runtime (only build-time in the rehype plugin), so the import likely comes through a fumadocs-core runtime module. Lazy, so no cold-start hit, but ~10MB of dead deploy weight and hundreds of junk chunks — worth tracing and pinning to a fine-grained bundle (`shiki/bundle/web` or `createHighlighterCore`).
- Vercel build logs show a Turborepo warning: it can't parse `pnpm-lock.yaml` (`patchedDependencies.tailwindcss-react-aria-components@2.1.1: invalid type: string` — turbo's lockfile parser doesn't understand pnpm 11's hash-string patch format). Harmless today (turbo still runs) but it disables turbo's lockfile-aware hashing; goes away when turbo updates or the patch format changes.
- Prerender scope is 67 pages and `prerender.filter` already excludes querystring URLs, so `/og` (satori) is never prerendered — no hidden memory there.

## Measurement method

Clean worktree, `pnpm install` (shared store), `pnpm build:registry`, then `/usr/bin/time -l ./node_modules/.bin/vite build` with `NODE_OPTIONS` as per table; peak = `maximum resident set size`, cross-checked with a 2s `ps` sampler summing RSS across all node processes (peak 2.5GB total, during prerender). Vercel production deployment `dpl_25jm3tVQQUs1msedGYCMgLuuwxue` (2026-06-11) confirmed via build logs: "Enhanced Build Machine — 8 cores, 16 GB". Caveat: local is macOS/arm64; Vercel standard is 4-core/8GB Linux/x64. Rolldown's native allocations are included in the RSS numbers, and prerender concurrency scales down with cores, so the Linux peak should be at or below the measured one; the ~3x margin absorbs the difference.
