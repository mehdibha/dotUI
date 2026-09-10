// Fails when the production client bundle regresses past scripts/perf-budget.json:
// the entry chunk's gzip size, and for every prerendered page the modulepreload
// count and first-load JS gzip size — every chunk the page's HTML references plus
// their transitive static imports, since the browser fetches those before it can
// run the page. The first rule whose glob matches a page sets its caps; a page
// matching none falls to `default`.
//   node scripts/perf-budget.mjs [outputPublicDir]
import { existsSync, globSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

const here = dirname(fileURLToPath(import.meta.url))
const budget = JSON.parse(readFileSync(join(here, "perf-budget.json"), "utf8"))
const pub = process.argv[2] ?? join(here, "..", ".output", "public")

if (!existsSync(join(pub, "assets"))) {
  console.error(`perf-budget: no build at ${pub} — run \`pnpm build\` first.`)
  process.exit(2)
}

const cache = new Map()
function chunk(file) {
  if (!cache.has(file)) {
    const source = readFileSync(join(pub, "assets", file))
    cache.set(file, {
      gzKB: gzipSync(source).length / 1024,
      imports: [
        ...source
          .toString("utf8")
          .matchAll(/(?:from|import)\s*["']\.\/([^"']+?\.js)["']/g),
      ].map((m) => m[1]),
    })
  }
  return cache.get(file)
}

const routeOf = (file) =>
  "/" +
  file
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "")

const matches = (pattern, route) =>
  pattern.endsWith("/**")
    ? route === pattern.slice(0, -3) || route.startsWith(pattern.slice(0, -2))
    : route === pattern

// The chunks the HTML names, then everything they statically import.
function firstLoad(html) {
  const refs = [
    ...new Set([...html.matchAll(/\/assets\/([^"']+?\.js)/g)].map((m) => m[1])),
  ]
  const seen = new Set(refs)
  const stack = [...refs]
  while (stack.length) {
    for (const dep of chunk(stack.pop()).imports) {
      if (!seen.has(dep)) {
        seen.add(dep)
        stack.push(dep)
      }
    }
  }
  let gzKB = 0
  for (const file of seen) gzKB += chunk(file).gzKB
  return { gzKB, preloads: refs.length }
}

const pages = globSync("**/*.html", { cwd: pub }).map((file) => ({
  route: routeOf(file),
  html: readFileSync(join(pub, file), "utf8"),
}))
if (pages.length === 0) {
  console.error(`perf-budget: no prerendered pages in ${pub}.`)
  process.exit(2)
}

const home = pages.find((page) => page.route === "/")
// The entry chunk is what the inline bootstrap dynamically imports.
const entry = home?.html.match(
  /import\(\s*["']\/assets\/([^"']+?\.js)["']\s*\)/,
)
if (!entry) {
  console.error("perf-budget: could not find the entry chunk in the home HTML.")
  process.exit(2)
}

const excluded = []
const scopes = [...budget.rules, { ...budget.default, match: "(default)" }].map(
  (rule) => ({ rule, worst: null, worstPreloads: 0, count: 0 }),
)

for (const page of pages) {
  if (budget.exclude.some((pattern) => matches(pattern, page.route))) {
    excluded.push(page.route)
    continue
  }
  const scope =
    scopes.find((s) => matches(s.rule.match, page.route)) ?? scopes.at(-1)
  const measured = { route: page.route, ...firstLoad(page.html) }
  scope.count++
  if (!scope.worst || measured.gzKB > scope.worst.gzKB) scope.worst = measured
  scope.worstPreloads = Math.max(scope.worstPreloads, measured.preloads)
}

const over = []
const rows = []
function row(label, detail, actual, limit, unit) {
  const failed = actual > limit
  if (failed) over.push(label)
  rows.push({
    label,
    detail,
    actual: `${Math.round(actual * 10) / 10} / ${limit} ${unit}`,
    failed,
  })
}

row("entry chunk", "", chunk(entry[1]).gzKB, budget.entryChunkGzKB, "KB gz")
for (const scope of scopes) {
  if (!scope.worst) continue
  const count = `${scope.count} page${scope.count === 1 ? "" : "s"}`
  const detail =
    scope.count === 1 ? count : `${count}, worst ${scope.worst.route}`
  row(
    scope.rule.match,
    detail,
    scope.worst.gzKB,
    scope.rule.firstLoadGzKB,
    "KB gz",
  )
  row(
    scope.rule.match,
    detail,
    scope.worstPreloads,
    scope.rule.preloads,
    "preloads",
  )
}

console.log(
  `\nperf budget — ${pub} (${pages.length - excluded.length} pages, ${excluded.length} excluded)\n`,
)
for (const r of rows) {
  console.log(
    `${r.label.padEnd(14)} ${r.detail.padEnd(38)} ${r.actual.padEnd(20)} ${r.failed ? "❌ over" : "✅ ok"}`,
  )
}

if (over.length > 0) {
  console.error(
    "\n::error::perf budget exceeded. Find what grew the client bundle, or raise the threshold in www/scripts/perf-budget.json with a reviewed reason.",
  )
  process.exit(1)
}
