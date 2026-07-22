/**
 * Post-deploy registry probe.
 *
 * Verifies what a DEPLOYED dotui.org actually serves at /r/* — the one gap the
 * CI guard suite can't cover. `www/src/registry/__generated__/publishables` is
 * gitignored and rebuilt per deploy, so production depends on the deploy-time
 * build: CI can be green while production drifts. That's how #477's /r/input
 * 404 stayed invisible for months (see issue #496). This probe hits the live
 * app so a bad deploy fails loudly.
 *
 * Steps, against --origin (default https://dotui.org):
 *   1. GET /r/registry.json to learn the deployed component list. Never
 *      hardcoded — the probe tracks whatever the deploy actually shipped.
 *   2. GET /r/<name> for every item plus /r/init. Fail on any non-200 or
 *      non-JSON response.
 *   3. Assert no BARE registryDependencies in any served item: every entry must
 *      be an absolute URL or an "@namespace/…" id. A bare name means the dep
 *      rewriter didn't recognize it and shadcn would resolve it against its
 *      default registry — exactly the #477 failure mode.
 *   4. Shape spot-check on /r/field: every slot the code destructures from
 *      fieldVariants() must be declared in the tv() slots:{} block. Cheap,
 *      regex-level — catches a publish that emits code referencing a slot the
 *      styles no longer define.
 *
 * Cache-awareness: /r/$name is served with
 * `s-maxage=3600, stale-while-revalidate=86400` (see routes/r/$name.tsx), so a
 * probe run right after a deploy can read STALE cached JSON built by the PREVIOUS
 * deployment. Every request carries a unique cache-busting query param so we
 * always hit the fresh deployment, not the CDN's copy.
 *
 * Usage:  tsx scripts/registry-probe.ts [--origin https://dotui.org]
 * Exit 0 if everything passes; non-zero with a per-failure report otherwise.
 */

const DEFAULT_ORIGIN = 'https://dotui.org'
const CONCURRENCY = 6
// Extra names to probe that don't appear in registry.json's items list.
const EXTRA_NAMES = ['init']

interface Failure {
  name: string
  url: string
  reason: string
}

function parseOrigin(argv: string[]): string {
  const i = argv.indexOf('--origin')
  const raw =
    i !== -1 ? argv[i + 1] : (process.env.PROBE_ORIGIN ?? DEFAULT_ORIGIN)
  if (!raw) {
    console.error('error: --origin given without a value')
    process.exit(2)
  }
  // Strip a trailing slash so `${origin}/r/x` never doubles up.
  return raw.replace(/\/+$/, '')
}

/** Append a unique param so the CDN can't answer from a stale cached copy. */
function bust(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}_cb=${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function fetchJson(
  url: string,
): Promise<{ json?: unknown; error?: string }> {
  let res: Response
  try {
    res = await fetch(bust(url), { headers: { accept: 'application/json' } })
  } catch (err) {
    return { error: `network error: ${(err as Error).message}` }
  }
  if (res.status !== 200) {
    return { error: `HTTP ${res.status} ${res.statusText}` }
  }
  const contentType = res.headers.get('content-type') ?? ''
  const body = await res.text()
  if (!contentType.includes('application/json')) {
    return { error: `non-JSON content-type: ${contentType || '(none)'}` }
  }
  try {
    return { json: JSON.parse(body) }
  } catch {
    return { error: 'body did not parse as JSON' }
  }
}

/** A minimal cross-worker task pool — no dependencies, native promises. */
async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker(): Promise<void> {
    while (next < items.length) {
      const idx = next++
      results[idx] = await fn(items[idx]!)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  )
  return results
}

function isAbsoluteOrNamespaced(dep: string): boolean {
  return /^https?:\/\//.test(dep) || dep.startsWith('@')
}

/** Check one served item for bare registryDependencies. */
function checkDeps(name: string, url: string, item: unknown): Failure[] {
  const deps = (item as { registryDependencies?: unknown }).registryDependencies
  if (deps === undefined) return []
  if (!Array.isArray(deps)) {
    return [{ name, url, reason: 'registryDependencies is not an array' }]
  }
  const bare = deps.filter(
    (d): d is string => typeof d === 'string' && !isAbsoluteOrNamespaced(d),
  )
  if (bare.length === 0) return []
  return [
    {
      name,
      url,
      reason: `bare registryDependencies (dep rewriter didn't recognize): ${bare.join(', ')}`,
    },
  ]
}

/**
 * Shape spot-check on /r/field: every slot destructured from fieldVariants()
 * must be declared in the tv() slots:{} block of the emitted source.
 */
function checkFieldShape(origin: string, item: unknown): Failure[] {
  const url = `${origin}/r/field`
  const files = (item as { files?: Array<{ content?: string }> }).files
  const content = files?.map((f) => f.content ?? '').join('\n') ?? ''
  if (!content) {
    return [{ name: 'field', url, reason: 'no file content to spot-check' }]
  }

  const slotsBlock = content.match(/slots:\s*\{([\s\S]*?)\n\s*\}/)
  if (!slotsBlock) {
    return [
      {
        name: 'field',
        url,
        reason: 'no slots:{} block found in emitted source',
      },
    ]
  }
  const declared = new Set(
    [...slotsBlock[1]!.matchAll(/^\s*([A-Za-z][\w]*)\s*:/gm)].map((m) => m[1]!),
  )

  const destructured = [
    ...content.matchAll(/const\s*\{\s*([\w]+)\s*\}\s*=\s*fieldVariants\(/g),
  ].map((m) => m[1]!)

  if (destructured.length === 0) {
    return [
      { name: 'field', url, reason: 'no fieldVariants() slot usage found' },
    ]
  }

  const undeclared = destructured.filter((s) => !declared.has(s))
  if (undeclared.length === 0) return []
  return [
    {
      name: 'field',
      url,
      reason: `code destructures slots not declared in slots:{}: ${undeclared.join(', ')}`,
    },
  ]
}

async function main(): Promise<void> {
  const origin = parseOrigin(process.argv.slice(2))
  const started = Date.now()
  console.log(`probing registry at ${origin}`)

  // 1. Learn the component list from the deploy itself.
  const indexUrl = `${origin}/r/registry.json`
  const index = await fetchJson(indexUrl)
  if (index.error || !index.json) {
    console.error(`FAIL  ${indexUrl}  ${index.error ?? 'no body'}`)
    console.error('\ncannot determine component list; aborting')
    process.exit(1)
  }
  const items = (index.json as { items?: Array<{ name?: string }> }).items
  if (!Array.isArray(items) || items.length === 0) {
    console.error(`FAIL  ${indexUrl}  registry.json has no items array`)
    process.exit(1)
  }
  const names = [
    ...new Set(
      items
        .map((it) => it.name)
        .filter((n): n is string => typeof n === 'string' && n.length > 0),
    ),
    ...EXTRA_NAMES,
  ]
  console.log(
    `  ${items.length} items in registry.json; probing ${names.length} endpoints`,
  )

  // 2 + 3. GET every item and check its deps. Collect the field item for step 4.
  let fieldItem: unknown
  const failureLists = await mapPool(names, CONCURRENCY, async (name) => {
    const url = `${origin}/r/${name}`
    const res = await fetchJson(url)
    if (res.error || !res.json) {
      return [{ name, url, reason: res.error ?? 'no body' }]
    }
    if (name === 'field') fieldItem = res.json
    return checkDeps(name, url, res.json)
  })

  const failures: Failure[] = failureLists.flat()

  // 4. Shape spot-check (only if field was reachable — otherwise step 2 flagged it).
  if (fieldItem !== undefined) {
    failures.push(...checkFieldShape(origin, fieldItem))
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1)

  if (failures.length > 0) {
    console.error(`\n${failures.length} failure(s):`)
    for (const f of failures) {
      console.error(`  FAIL  ${f.name}  ${f.url}\n        ${f.reason}`)
    }
    console.error(`\nprobed ${names.length} endpoints in ${elapsed}s — FAILED`)
    process.exit(1)
  }

  console.log(
    `\nOK — probed ${names.length} endpoints in ${elapsed}s, all passed`,
  )
}

main().catch((err) => {
  console.error(`unexpected error: ${(err as Error).stack ?? err}`)
  process.exit(1)
})
