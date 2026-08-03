/**
 * TEMPORARY (PR #587): shiki vs @tanstack/highlight parity report.
 *
 * Highlights the full docs corpus — every mdx code fence, every registry demo
 * source, every API-reference type string — with both engines and compares the
 * color of every non-whitespace character. Differences are grouped into
 * patterns (shiki color pair -> tanstack class) so tokenizer bugs stand out
 * from one-off noise. Run: node www/scripts/highlight-parity.mjs [--examples N]
 *
 * shiki is not a www dependency anymore; it is resolved through fumadocs-core
 * (which still depends on it) — acceptable for a throwaway diagnostic.
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WWW = fileURLToPath(new URL('..', import.meta.url))
const requireWww = createRequire(path.join(WWW, 'package.json'))
const requireFuma = createRequire(
  requireWww.resolve('fumadocs-core/package.json'),
)

const { createHighlighter: createShiki } = await import(
  requireFuma.resolve('shiki')
)
const { createHighlighter: createTs } = await import(
  requireWww.resolve('@tanstack/highlight/core')
)
// Node 23.6+ strips types, so the real refinement pass runs here.
const { refineTokens } = await import(
  path.join(WWW, 'src/modules/docs/highlight-refine.ts')
)

const TS_LANGS = ['ts', 'tsx', 'js', 'jsx', 'json', 'shell', 'css', 'html']
const tsLangDefs = []
for (const l of TS_LANGS) {
  const m = await import(
    requireWww.resolve(`@tanstack/highlight/languages/${l}`)
  )
  tsLangDefs.push(m[l])
}
const tsHl = createTs({ languages: tsLangDefs })
const shiki = await createShiki({
  themes: ['github-light', 'github-dark'],
  langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'css', 'html'],
})

// Mirror of highlight.css (light|dark per class); 'plain' = unclassed text.
const PALETTE = {
  plain: '#24292E|#E1E4E8',
  attr: '#6F42C1|#B392F0',
  'code-inline': '#005CC5|#79B8FF',
  command: '#6F42C1|#B392F0',
  comment: '#6A737D|#6A737D',
  deleted: '#B31D28|#FDAEB7',
  function: '#6F42C1|#B392F0',
  heading: '#005CC5|#79B8FF',
  inserted: '#22863A|#85E89D',
  keyword: '#D73A49|#F97583',
  link: '#032F62|#9ECBFF',
  literal: '#005CC5|#79B8FF',
  meta: '#6A737D|#6A737D',
  number: '#005CC5|#79B8FF',
  operator: '#D73A49|#F97583',
  property: '#005CC5|#79B8FF',
  selector: '#22863A|#85E89D',
  string: '#032F62|#9ECBFF',
  tag: '#005CC5|#79B8FF',
  type: '#005CC5|#79B8FF',
  variable: '#E36209|#FFAB70',
}

// ---------------------------------------------------------------------------
// Corpus
// ---------------------------------------------------------------------------
const corpus = [] // { id, lang, code }

const walk = (dir, ext, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, ext, out)
    else if (e.name.endsWith(ext)) out.push(p)
  }
  return out
}

// 1. All mdx code fences
for (const file of walk(path.join(WWW, 'content/docs'), '.mdx')) {
  const src = fs.readFileSync(file, 'utf8')
  let i = 0
  for (const m of src.matchAll(/```(\w+)?[^\n]*\n([\s\S]*?)```/g)) {
    const lang = m[1] === 'npm' ? 'shell' : (m[1] ?? 'plaintext')
    corpus.push({
      id: `${path.relative(WWW, file)}#fence${i++}`,
      lang,
      code: m[2].replace(/\n$/, ''),
    })
  }
}

// 2. All registry demo sources (what rehype-transform highlights)
for (const file of walk(path.join(WWW, 'src/registry/ui'), '.tsx')) {
  if (!file.includes('/demos/')) continue
  corpus.push({
    id: path.relative(WWW, file),
    lang: 'tsx',
    code: fs.readFileSync(file, 'utf8').replace(/\n$/, ''),
  })
}

// 3. API-reference type strings + defaults (highlighted as ts)
const refsDir = path.join(WWW, 'src/modules/docs/references/generated')
for (const file of fs.readdirSync(refsDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(refsDir, file), 'utf8'))
  for (const [name, prop] of Object.entries(data.props ?? {})) {
    for (const [kind, code] of [
      ['type', prop.detailedType ?? prop.type],
      ['default', prop.default],
    ]) {
      if (code) {
        corpus.push({
          id: `ref:${data.name}.${name}.${kind}`,
          lang: 'ts',
          code,
          // The old pipeline highlighted type strings behind a `type _ =`
          // prefix so shiki tokenized them in type position — mirror that.
          typePosition: kind === 'type',
        })
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Compare
// ---------------------------------------------------------------------------
const TYPE_PREFIX = 'type _ =\n'
const shikiColorsAt = (code, lang, typePosition) => {
  const input = typePosition ? TYPE_PREFIX + code : code
  const skip = typePosition ? TYPE_PREFIX.length : 0
  const arr = new Array(code.length).fill(PALETTE.plain)
  for (const theme of ['github-light', 'github-dark']) {
    const { tokens } = shiki.codeToTokens(input, {
      lang: lang === 'shell' ? 'bash' : lang,
      theme,
    })
    const idx = theme === 'github-light' ? 0 : 1
    for (const line of tokens) {
      for (const t of line) {
        for (let i = 0; i < t.content.length; i++) {
          const at = t.offset + i - skip
          if (at < 0) continue
          const prev = arr[at].split('|')
          prev[idx] = (t.color ?? '').toUpperCase()
          arr[at] = prev.join('|')
        }
      }
    }
  }
  return arr
}

const tsClassesAt = (code, lang) => {
  const arr = new Array(code.length).fill('plain')
  const result = tsHl.tokenize(code, { lang })
  const tokens = refineTokens(result.tokens, code, result.lang)
  let off = 0
  for (const t of tokens) {
    if (t.className)
      for (let i = 0; i < t.value.length; i++) arr[off + i] = t.className
    off += t.value.length
  }
  return arr
}

const examplesFlag = process.argv.indexOf('--examples')
const MAX_EXAMPLES =
  examplesFlag === -1 ? 4 : Number(process.argv[examplesFlag + 1]) || 4
const groups = new Map() // key -> { count, blocks:Set, examples:Set }
let total = 0
let mismatched = 0
const skipped = new Set()

for (const { id, lang, code, typePosition } of corpus) {
  if (lang === 'plaintext') continue
  if (!TS_LANGS.includes(lang)) {
    skipped.add(lang)
    continue
  }
  let sk
  try {
    sk = shikiColorsAt(code, lang, typePosition)
  } catch {
    skipped.add(lang)
    continue
  }
  const tc = tsClassesAt(code, lang)
  for (let i = 0; i < code.length; i++) {
    if (/\s/.test(code[i])) continue
    total++
    const expected = PALETTE[tc[i]] ?? tc[i]
    if (sk[i] === expected) continue
    // extend to the full run of the same mismatch for a readable example
    let j = i
    while (
      j < code.length &&
      code[j] !== '\n' &&
      tc[j] === tc[i] &&
      sk[j] === sk[i]
    ) {
      j++
    }
    const runChars = code.slice(i, j).replace(/\s/g, '').length
    total += runChars - 1
    mismatched += runChars
    const snippet =
      code.slice(Math.max(0, i - 18), i) +
      '⟦' +
      code.slice(i, j) +
      '⟧' +
      code.slice(j, Math.min(code.length, j + 14))
    const key = `${lang}  shiki ${sk[i]}  ->  th-${tc[i]} (${PALETTE[tc[i]] ?? '?'})`
    const g = groups.get(key) ?? {
      count: 0,
      blocks: new Set(),
      examples: new Set(),
    }
    g.count += runChars
    g.blocks.add(id)
    if (g.examples.size < MAX_EXAMPLES)
      g.examples.add(snippet.replace(/\n/g, '⏎'))
    groups.set(key, g)
    i = j - 1
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`corpus: ${corpus.length} blocks; compared ${total} chars`)
console.log(
  `mismatched: ${mismatched} chars (${((mismatched / total) * 100).toFixed(2)}%)`,
)
if (skipped.size) console.log(`skipped langs: ${[...skipped].join(', ')}`)
console.log('')
const sorted = [...groups.entries()].sort((a, b) => b[1].count - a[1].count)
for (const [key, g] of sorted) {
  console.log(`■ ${key}`)
  console.log(`  chars: ${g.count}  blocks: ${g.blocks.size}`)
  for (const ex of [...g.examples].slice(0, MAX_EXAMPLES)) {
    console.log(`    ${ex}`)
  }
  console.log('')
}
