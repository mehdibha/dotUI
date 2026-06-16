# Plan 004: Harden the public edge — dep-resolver race, preset size cap, OG fallbacks, security headers

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-repo-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0da0afa3..HEAD -- www/src/publisher/publish.ts www/src/publisher/publish.test.ts www/src/routes/r/$name.tsx www/src/modules/create/preset/codec.ts www/src/routes/og.tsx www/vercel.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (touches `publish.test.ts`, which plan 002's sweep also imports — land this before or after 002, then reconcile the import as noted in 002 Step 3)
- **Category**: security
- **Planned at**: commit `0da0afa3`, 2026-06-11

## Why this matters

Four small, verified gaps on the public-facing edge:

1. **Cross-request race**: `GET /r/$name` configures the publisher's dependency rewriter via module-level mutable state, then `await`s before using it. Two concurrent requests can interleave, so request A's response can carry request B's origin/preset in its `registryDependencies` URLs — wrong theme delivered to a `shadcn add` consumer.
2. **Unbounded decompression**: `decodePreset` inflates attacker-controlled base64url with no input cap. Deflate expands up to ~1000×; a URL-sized payload can force tens of MB of allocation per request on the server routes that decode presets.
3. **OG image params**: `/og` renders `title`/`description` query params with no fallback and no length cap — missing params yield a blank card; megabyte-long params make satori chew CPU.
4. **No security headers**: responses carry no `X-Content-Type-Options`, `Referrer-Policy`, or frame policy.

Each fix is a few lines; together they close the obvious holes without touching the publisher's planned-rewrite internals.

## Current state

- `www/src/publisher/publish.ts:38-44` — the module-level state:

```ts
let knownDotuiNames: Set<string> | undefined
/** Origin used to construct absolute dep URLs, e.g. `https://dotui.com`. */
let dotuiOrigin: string | undefined
/** Query string (including leading `?`) appended to dep URLs, e.g. `?preset=…`. */
let dotuiDepQuery = ''
```

`setDotuiDepResolver(origin, depQuery)` (lines 73–76) writes the last two; `rewriteDeps` (lines 78–106) reads them at publish time (line 98–100: `out.push(\`${dotuiOrigin}/r/${dep}${dotuiDepQuery}\`)`). `setKnownDotuiNames` (line 60) is set once at route-module load (`$name.tsx:29`) — static, NOT part of the race. `publish({ publishable, preset })` is the entry (line 120).

- `www/src/routes/r/$name.tsx:59-66` — the racy window (`await loader()` sits between the global write and the read inside `publish`):

```ts
const origin = `${url.protocol}//${url.host}`
const depQuery = encodedPreset ? `?preset=${encodedPreset}` : ''
setDotuiDepResolver(origin, depQuery)

const mod = await loader()
const publishable = selectPublishable(mod, preset)

const { item, rawContent } = publish({ publishable, preset })
```

- Callers of `setDotuiDepResolver` (verified by grep): `www/src/routes/r/$name.tsx` (import line 23, call line 61) and `www/src/publisher/publish.test.ts` (lines 18, 32, 233). `r/init.tsx` and `r/showcase-bundle.tsx` do NOT call it.
- `www/src/modules/create/preset/codec.ts:127-145` — `decodePreset` (full body): base64url-decodes, `inflateRaw(bytes, { to: 'string' })`, `JSON.parse`, merges over `DEFAULTS`, falls back to `DEFAULTS` on any throw. There is no length check on `encoded`. Note: pako has **no** `maxOutputSize` option — the honest guard is capping the input length before inflating. Real presets are small (diff-encoded, deflate level 9); even a maximal hand-built preset is far under 4 KB encoded.
- `www/src/routes/og.tsx:50-51` — `const title = searchParams.get('title')` / `description` (nullable), rendered at lines 99 and 110; the only use besides rendering is `title.length > 20` for font size (line 94). React renders `null` as empty — so the failure mode is a blank card, not the string "null".
- `www/vercel.ts` — header config today (Cache-Control for static fn cache + an RFC 8288 `Link` discovery header on `/(.*)`), using `routes.header(...)` / `routes.cacheControl(...)` from `@vercel/config/v1`. Pattern to extend:

```ts
// www/vercel.ts:12-20
headers: [
  routes.cacheControl('/__tsr/staticServerFnCache/(.*)', { ... }),
  // Advertise agent-discovery resources on every response.
  routes.header('/(.*)', [{ key: 'Link', value: DISCOVERY_LINK }]),
],
```

- Note: `/create` embeds `/preview/$slug` in an **iframe on the same origin** (`www/src/routes/_app/create.tsx:52-56`), so the frame policy must allow same-origin framing — use `frame-ancestors 'self'` via CSP or `X-Frame-Options: SAMEORIGIN`, never `DENY`.
- Existing spec to extend: `www/src/modules/create/preset/codec.test.ts` (5 tests) and `www/src/publisher/publish.test.ts` (19 tests).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Tests | `pnpm test` | all pass |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` | exit 0 |

## Scope

**In scope**:

- `www/src/publisher/publish.ts` (thread the dep resolver through `publish()`; delete the module-level origin/query state)
- `www/src/publisher/publish.test.ts` (update to the new signature)
- `www/src/routes/r/$name.tsx` (pass resolver as argument)
- `www/src/modules/create/preset/codec.ts` + `codec.test.ts` (input length cap)
- `www/src/routes/og.tsx` (fallbacks + caps)
- `www/vercel.ts` (three headers)

**Out of scope**:

- A full Content-Security-Policy — the app injects dynamic `<style>` elements and inline styles by design (theming engine); a CSP is a project of its own. Note it as deferred, don't attempt it.
- `setKnownDotuiNames` — static module state set once at load; not racy; leave it.
- `r/init.tsx`, `r/showcase-bundle.tsx` — they don't use the dep resolver.
- Rate limiting, `lib/github.ts` token wiring, or any infra-level mitigation.

## Git workflow

- Branch: `advisor/004-edge-hardening`
- Commit style: `fix(publisher): pass dep resolver per publish call` / `fix(www): cap preset decode input and og params` / `chore(www): add baseline security headers`. One commit per concern is ideal.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Thread the dep resolver through `publish()`

In `www/src/publisher/publish.ts`:

- Extend the input (lines 115–118): `export interface PublishInput { publishable: Publishable; preset: PublishPreset; depResolver?: { origin: string; query?: string } }`.
- Pass it down to `rewriteDeps` (make `rewriteDeps(deps, depResolver?)` take it as a parameter; replace reads of `dotuiOrigin`/`dotuiDepQuery` with the parameter, preserving the existing trailing-slash trim from `setDotuiDepResolver` line 74).
- Delete `dotuiOrigin`, `dotuiDepQuery`, and `setDotuiDepResolver` entirely.

In `www/src/routes/r/$name.tsx`: remove the `setDotuiDepResolver` import and call; pass `depResolver: { origin, query: depQuery }` in the `publish({ ... })` call at line 66.

In `www/src/publisher/publish.test.ts`: replace `setDotuiDepResolver(...)` setup calls (lines 18/32/233 area) with `depResolver` arguments on the relevant `publish(...)` invocations. The spec at line 32 calls `setDotuiDepResolver('')` to reset state between tests — with the parameter approach that reset becomes unnecessary; delete it.

**Verify**: `grep -rn "setDotuiDepResolver" www/src` → no matches. `pnpm test -- publish` → all pass. `pnpm typecheck` → exit 0.

### Step 2: Cap preset decode input

In `www/src/modules/create/preset/codec.ts`, at the top of `decodePreset` (line 127), before decoding:

```ts
// Hard cap on attacker-controlled input: real presets are diff-encoded and tiny;
// deflate expands ~1000x, so bound the input instead of the (unboundable) output.
if (encoded.length > 4096) return DEFAULTS
```

Add a `MAX_ENCODED_PRESET_LENGTH` const if you prefer a named bound — keep the value 4096.

**Verify**: `pnpm test -- codec` → existing 5 tests still pass.

### Step 3: Spec the cap

In `www/src/modules/create/preset/codec.test.ts`, add: (a) a 5000-char string → `decodePreset` returns `DEFAULTS` (deep-equal); (b) sanity: a legitimate `encodePreset` output of a maximally-tweaked design system stays under 4096 (construct one config with several componentParams/tokens/color overrides; assert `encoded.length < 4096` — this guards the cap against ever rejecting real presets).

**Verify**: `pnpm test -- codec` → all pass including 2 new tests.

### Step 4: OG fallbacks and caps

In `www/src/routes/og.tsx:50-51`:

```ts
const title = (searchParams.get('title') ?? 'dotUI').slice(0, 140)
const description = (searchParams.get('description') ?? '').slice(0, 300)
```

The existing `title && title.length > 20` check at line 94 keeps working (title is now always a string; simplify to `title.length > 20` if oxlint flags the redundant truthiness).

**Verify**: `pnpm typecheck` → exit 0.

### Step 5: Baseline security headers

In `www/vercel.ts`, extend the existing `routes.header('/(.*)', [...])` entry (or add a second one if the API prefers one key per call — read `@vercel/config`'s `routes.header` signature in `node_modules/@vercel/config` first) with:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN` (NOT `DENY` — `/create` iframes `/preview/$slug` same-origin)

**Verify**: `pnpm typecheck` → exit 0 (vercel.ts is type-checked TS). `pnpm check` → exit 0.

### Step 6: Full suite

**Verify**: `pnpm test`, `pnpm typecheck`, `pnpm check` → all exit 0. `pnpm build:registry` → exit 0 with no new skips (publisher signature change must not affect build-time paths — `build-publishables.ts` doesn't call `publish()`).

## Test plan

- `publish.test.ts` updated in place: the dep-rewrite test (around line 233) now passes `depResolver` explicitly and still asserts absolute-URL rewriting with preset query; the bare-name test (line ~223) asserts pass-through when `depResolver` is absent.
- `codec.test.ts`: oversized-input rejection + real-preset-fits-under-cap (Step 3).
- No new test file needed for og.tsx/vercel.ts (config-level; verified by typecheck and review).

## Done criteria

- [ ] `grep -rn "setDotuiDepResolver\|dotuiOrigin\|dotuiDepQuery" www/src` → no matches
- [ ] `publish()` accepts `depResolver` and `$name.tsx` passes it per request
- [ ] `decodePreset` rejects >4096-char input (test exists and passes)
- [ ] og.tsx has fallback + slice caps on both params
- [ ] `www/vercel.ts` sets the three headers
- [ ] `pnpm test`, `pnpm typecheck`, `pnpm check`, `pnpm build:registry` all exit 0
- [ ] `docs/plans/2026-06-11-repo-audit/README.md` status row updated

## STOP conditions

Stop and report back if:

- `rewriteDeps` turns out to be called from anywhere besides `publish()`'s pipeline (grep first) — the parameter threading would miss a path.
- `@vercel/config`'s `routes.header` cannot express multiple headers for one matcher and the alternative would restructure `vercel.ts` — report the API shape you found instead of improvising a workaround.
- Any existing `publish.test.ts` assertion depends on the module-level resolver persisting across calls (i.e. a test relies on the race-prone behavior) — that's a semantic question, report it.

## Maintenance notes

- The publisher rewrite (planned) should keep "no per-request module state" as an invariant — this plan establishes it; the rewrite must not regress it.
- Plan 002's sweep spec imports from `publish.ts` — whichever lands second reconciles the import (one-line change).
- Deferred follow-ups recorded for the operator: CSP (needs a nonce/inline-style strategy), `GITHUB_TOKEN` for `www/src/lib/github.ts` contributor fetches (currently unauthenticated, 60 req/h/IP, graceful fallback), and validating `ColorConfig.seeds` value shapes in `sanitizeColor` (`codec.ts:114-121`).
