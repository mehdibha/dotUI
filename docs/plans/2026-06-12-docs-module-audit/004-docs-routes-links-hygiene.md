# Plan 004: Docs route & link hygiene — .md caching, header sanitization, external-link rel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `docs/plans/2026-06-12-docs-module-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat e0ca5b16..HEAD -- "www/src/routes/_app/docs/{\$}[.]md.tsx" www/src/modules/docs/mdx-components.tsx www/src/hooks/use-copy-to-clipboard.ts`
> On any drift, compare excerpts below against live code; mismatch = STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf + security (low-severity) + bug
- **Planned at**: commit `e0ca5b16`, 2026-06-12

## Why this matters

Three small, verified gaps in the docs request/link surface:

1. The per-page markdown endpoint (`/docs/<page>.md`, the AI-agent surface advertised via `<link rel="alternate">` on every docs page) sends **no Cache-Control header**, while the equivalent HTML route is CDN-cached for a year. Agents re-fetching docs markdown hit the serverless function every time.
2. The same route interpolates the URL splat into a quoted `Content-Disposition` filename without sanitization — a `%22` in the path produces a malformed header (header injection of the low-severity, spec-violation kind; newlines are blocked by the runtime, quotes are not).
3. External links in MDX prose render with `target="_blank"` and no `rel` — modern browsers imply `noopener`, but `noreferrer` is absent (referrer leakage to external sites) and legacy browsers get no opener protection.

Plus one optional micro-fix: the copy-to-clipboard hook swallows failures (`console.error`), so a failed copy looks like nothing happened.

## Current state

- `www/src/routes/_app/docs/{$}[.]md.tsx` (36 lines, full handler):

  ```ts
  // lines 24-32
  const markdown = await page.data.getText('processed')
  const filename = (params._splat || 'docs').split('/').join('-')

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}.md"`,
    },
  })
  ```

  No Cache-Control on success or on the 404 path (line 18: `return new Response('Not found', { status: 404 })`).

- The HTML docs route's caching convention to copy — `www/src/routes/_app/docs/$.tsx:84-88`:

  ```ts
  // Success path only (don't cache not-found responses): content is baked
  // into the build, so let Vercel's CDN cache it until the next deploy purge.
  setResponseHeader(
    'Cache-Control',
    'public, max-age=0, must-revalidate, s-maxage=31536000',
  )
  ```

  (For comparison: `www/src/routes/llms[.]txt.tsx` uses `s-maxage=3600, stale-while-revalidate=86400`; the .md content, like the HTML, only changes on deploy — use the HTML route's value.)

- `www/src/modules/docs/mdx-components.tsx:84-100` — the `a` mapping:

  ```tsx
  a: ({ className, children, href, ...props }): React.ComponentProps<'a'> => {
    const isInternal = href.startsWith('/')
    return (
      <Link
        href={href}
        target={isInternal ? '_self' : '_blank'}
        className={cn('inline', className)}
        {...props}
      >
  ```

  No `rel` for the external case. `Link` here is the registry Link (React Aria) — it forwards anchor props; it does not add `rel` automatically.

- `www/src/hooks/use-copy-to-clipboard.ts` (28 lines):

  ```ts
  navigator.clipboard.writeText(value).then(() => {
    setIsCopied(true)
    onCopy?.()
    if (timeout !== 0) {
      setTimeout(() => setIsCopied(false), timeout)
    }
  }, console.error)
  ```

  Consumers: `www/src/modules/docs/docs-copy-page.tsx`, `www/src/modules/docs/code-block.tsx` (copy buttons in docs).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` | exit 0 |
| Tests | `pnpm test` | all pass |
| Dev server | `pnpm dev:www` (after `pnpm build:registry` in a fresh worktree) | serves localhost |
| Probe headers | `curl -sI http://localhost:<port>/docs/components/button.md` | shows response headers |

## Scope

**In scope**:
- `www/src/routes/_app/docs/{$}[.]md.tsx`
- `www/src/modules/docs/mdx-components.tsx` (the `a` mapping only)
- `www/src/hooks/use-copy-to-clipboard.ts` + its two docs consumers (optional Step 4 only)

**Out of scope**:
- `www/src/routes/llms[.]txt.tsx`, `llms-full[.]txt.tsx` — already correctly cached.
- `www/src/routes/og.tsx` — covered by repo-audit plan 004.
- `www/src/routes/_app/docs/$.tsx` — already correct; it is the reference, not a target.
- Any registry component (`www/src/registry/**`) — the Link component itself must not gain auto-`rel` behavior; the fix is local to the MDX mapping.

## Git workflow

- Branch: `advisor/004-docs-route-hygiene`.
- Conventional commits, e.g. `fix(www): cache and sanitize the docs markdown route`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Cache-Control + filename sanitization on the .md route

In `{$}[.]md.tsx`:

```ts
const filename =
  (params._splat || 'docs').split('/').join('-').replace(/[^\w.-]/g, '') ||
  'docs'

return new Response(markdown, {
  headers: {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Content-Disposition': `inline; filename="${filename}.md"`,
    // Mirrors the HTML docs route: content only changes on deploy; Vercel
    // purges the CDN cache on deploy.
    'Cache-Control': 'public, max-age=0, must-revalidate, s-maxage=31536000',
  },
})
```

Leave the 404 path header-less (matching the HTML route's "don't cache not-found" comment).

**Verify**: `pnpm dev:www`, then
`curl -sI http://localhost:<port>/docs/components/button.md` → `200`, `Cache-Control: public, max-age=0, must-revalidate, s-maxage=31536000`, `Content-Disposition: inline; filename="components-button.md"`.
`curl -sI 'http://localhost:<port>/docs/a%22b.md'` → `404` (page doesn't exist) — and for the sanitizer itself: `curl -sI 'http://localhost:<port>/docs/components/button%22x.md'` should be a 404 too (no such page); the sanitizer is defense-in-depth for any future page whose computed name could carry specials. Confirm no header parse error in either case.

### Step 2: rel on external MDX links

In `mdx-components.tsx`'s `a` mapping:

```tsx
target={isInternal ? '_self' : '_blank'}
rel={isInternal ? undefined : 'noopener noreferrer'}
```

**Verify**: `pnpm dev:www`, load `/docs/components/tooltip` (its frontmatter `links` and prose contain external react-spectrum links — any docs page with an external link works). Inspect an external anchor in the DOM: `rel="noopener noreferrer"` present; internal sidebar/prose links unchanged (no `rel`).

### Step 3: Gates

```sh
pnpm typecheck && pnpm test && pnpm check
```

**Verify**: all exit 0.

### Step 4 (optional, skip on any friction): surface clipboard failures

In `use-copy-to-clipboard.ts`, replace the `console.error` rejection handler: keep the log, but expose failure to consumers — minimal shape:

```ts
const [error, setError] = useState<Error | null>(null)
// in the rejection handler: setError(err as Error)
// on success: setError(null)
return { isCopied, error, copyToClipboard }
```

Do not change the two consumers' visuals beyond what's already there (they may ignore `error` for now — the point is the hook stops swallowing it; visual treatment is a product call). If either consumer's types break, fix the destructuring only.

**Verify**: `pnpm typecheck` exit 0.

## Test plan

No new automated tests — these are header/attribute one-liners verified by curl/DOM inspection above (route-level test infrastructure doesn't exist in this repo yet; repo-audit plan 002 introduces the CI build job). State in your report which curl outputs you observed.

## Done criteria

- [ ] `curl -sI` on a real `.md` page shows the Cache-Control and a sanitized filename
- [ ] External MDX links carry `rel="noopener noreferrer"`; internal links don't
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm check` exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] Status row updated in this audit's `README.md`

## STOP conditions

- The `{$}[.]md.tsx` handler shape differs from the excerpt (route API drifted).
- The `a` mapping's `Link` turns out to inject its own `rel` (check rendered DOM first — if `rel` is already present, report and drop Step 2).
- Step 4 requires changes beyond the hook + two consumers' destructuring.

## Maintenance notes

- If docs ever become user-revalidatable (CMS-style), the 1-year s-maxage must drop — the value is tied to "content changes only on deploy + Vercel purges on deploy" (comment in `$.tsx`).
- The filename sanitizer intentionally allows only `[\w.-]`; if localized page slugs arrive later, revisit with RFC 5987 (`filename*=`) encoding instead of widening the allowlist.
