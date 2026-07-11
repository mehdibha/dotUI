#!/usr/bin/env node
// Fail the build when the production client bundle regresses past its budget.
//
// Guards the entry-graph perf wins — chiefly shiki staying off the entry chunk
// and the modulepreload storm staying tamed — by asserting, against the real
// production build (www/.output/public), that:
//   - the entry chunk stays under a gzip size cap (shiki/react-aria back in it
//     would blow this),
//   - key pages stay under a first-load JS gzip cap and a modulepreload count.
//
// Thresholds live in scripts/perf-budget.json. Run after `pnpm build`:
//   node scripts/perf-budget.mjs [outputPublicDir]
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const here = dirname(fileURLToPath(import.meta.url))
const budget = JSON.parse(readFileSync(join(here, 'perf-budget.json'), 'utf8'))
const PUB = process.argv[2] || join(here, '..', '.output', 'public')
const ASSETS = join(PUB, 'assets')

if (!existsSync(ASSETS)) {
  console.error(
    `perf-budget: no build at ${PUB} — run \`pnpm build\` first (or pass the output dir).`,
  )
  process.exit(2)
}

const gzCache = new Map()
function gzKB(file) {
  if (gzCache.has(file)) return gzCache.get(file)
  const p = join(ASSETS, file)
  const kb = existsSync(p) ? gzipSync(readFileSync(p)).length / 1024 : 0
  gzCache.set(file, kb)
  return kb
}

function jsRefs(html) {
  return [
    ...new Set([...html.matchAll(/\/assets\/([^"']+?\.js)/g)].map((m) => m[1])),
  ]
}

/** The entry chunk is what the inline bootstrap dynamically imports. */
function entryChunk(html) {
  const m = html.match(/import\(\s*["']\/assets\/([^"']+?\.js)["']\s*\)/)
  return m?.[1] ?? null
}

const round = (n) => Math.round(n * 10) / 10
const results = []
let failed = false
function check(label, actual, limit, unit) {
  const over = actual > limit
  if (over) failed = true
  results.push({ label, actual: round(actual), limit, unit, over })
}

// Entry chunk gz (shared across pages — read it from home).
const homeHtml = readFileSync(join(PUB, budget.pages.home.path), 'utf8')
const entry = entryChunk(homeHtml)
if (!entry) {
  console.error('perf-budget: could not find the entry chunk in home HTML.')
  process.exit(2)
}
check('entry chunk', gzKB(entry), budget.entryChunkGzKB, 'KB gz')

// Per-page first-load JS gz + modulepreload count.
for (const [name, page] of Object.entries(budget.pages)) {
  const f = join(PUB, page.path)
  if (!existsSync(f)) {
    console.error(`perf-budget: missing prerendered page ${page.path}`)
    process.exit(2)
  }
  const refs = jsRefs(readFileSync(f, 'utf8'))
  const gz = refs.reduce((sum, r) => sum + gzKB(r), 0)
  check(`${name} first-load JS`, gz, page.initialGzKB, 'KB gz')
  check(`${name} modulepreloads`, refs.length, page.preloads, 'chunks')
}

const pad = (s, n) => String(s).padEnd(n)
console.log(`\nperf budget — ${PUB}\n`)
console.log(pad('metric', 22), pad('actual', 12), pad('budget', 10), 'status')
for (const r of results) {
  console.log(
    pad(r.label, 22),
    pad(`${r.actual} ${r.unit}`, 12),
    pad(`${r.limit} ${r.unit}`, 10),
    r.over ? '❌ OVER' : '✅ ok',
  )
}

if (failed) {
  console.error(
    '\n::error::perf budget exceeded. A client-bundle perf win regressed. ' +
      'Investigate (shiki back in the entry chunk? preload storm returned?) ' +
      'or, if the growth is intended and reviewed, raise the threshold in www/scripts/perf-budget.json.',
  )
  process.exit(1)
}
console.log('\nperf budget: all metrics within budget ✅')
