/**
 * TEMPORARY (PR #587): generates the dataset for /internal/highlight-lab.
 *
 * Reuses the parity methodology (see highlight-parity.mjs): highlights the
 * docs corpus with shiki (github-light/dark), refined @tanstack/highlight,
 * and raw @tanstack/highlight, compares per character, and emits the
 * mismatching blocks as pre-segmented render data for the lab page.
 *
 * Run: node www/scripts/highlight-lab-data.mjs
 * Output: www/src/modules/dev/highlight-lab/data.json
 */
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const WWW = fileURLToPath(new URL("..", import.meta.url))
const requireWww = createRequire(path.join(WWW, "package.json"))
const requireFuma = createRequire(
  requireWww.resolve("fumadocs-core/package.json"),
)

const { createHighlighter: createShiki } = await import(
  requireFuma.resolve("shiki")
)
const { createHighlighter: createTs } = await import(
  requireWww.resolve("@tanstack/highlight/core")
)
const { refineTokens } = await import(
  path.join(WWW, "src/modules/docs/highlight-refine.ts")
)

const TS_LANGS = ["ts", "tsx", "js", "jsx", "json", "shell", "css", "html"]
const tsLangDefs = []
for (const l of TS_LANGS) {
  const m = await import(
    requireWww.resolve(`@tanstack/highlight/languages/${l}`)
  )
  tsLangDefs.push(m[l])
}
const tsHl = createTs({ languages: tsLangDefs })
const shiki = await createShiki({
  themes: ["github-light", "github-dark"],
  langs: ["ts", "tsx", "js", "jsx", "json", "bash", "css", "html"],
})

// Mirror of highlight.css (light|dark per class); 'plain' = unclassed text.
const PALETTE = {
  plain: "#24292E|#E1E4E8",
  attr: "#6F42C1|#B392F0",
  "code-inline": "#005CC5|#79B8FF",
  command: "#6F42C1|#B392F0",
  comment: "#6A737D|#6A737D",
  deleted: "#B31D28|#FDAEB7",
  function: "#6F42C1|#B392F0",
  heading: "#005CC5|#79B8FF",
  inserted: "#22863A|#85E89D",
  keyword: "#D73A49|#F97583",
  link: "#032F62|#9ECBFF",
  literal: "#005CC5|#79B8FF",
  meta: "#6A737D|#6A737D",
  number: "#005CC5|#79B8FF",
  operator: "#D73A49|#F97583",
  property: "#005CC5|#79B8FF",
  selector: "#22863A|#85E89D",
  string: "#032F62|#9ECBFF",
  tag: "#005CC5|#79B8FF",
  type: "#005CC5|#79B8FF",
  variable: "#E36209|#FFAB70",
}

// ---------------------------------------------------------------------------
// Corpus (same three sources as highlight-parity.mjs)
// ---------------------------------------------------------------------------
const corpus = []

const walk = (dir, ext, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, ext, out)
    else if (e.name.endsWith(ext)) out.push(p)
  }
  return out
}

for (const file of walk(path.join(WWW, "content/docs"), ".mdx")) {
  const src = fs.readFileSync(file, "utf8")
  let i = 0
  for (const m of src.matchAll(/```(\w+)?[^\n]*\n([\s\S]*?)```/g)) {
    const lang = m[1] === "npm" ? "shell" : (m[1] ?? "plaintext")
    corpus.push({
      id: `${path.relative(WWW, file)}#${i++}`,
      lang,
      code: m[2].replace(/\n$/, ""),
    })
  }
}
for (const file of walk(path.join(WWW, "src/registry/ui"), ".tsx")) {
  if (!file.includes("/demos/")) continue
  corpus.push({
    id: path.relative(WWW, file),
    lang: "tsx",
    code: fs.readFileSync(file, "utf8").replace(/\n$/, ""),
  })
}
const refsDir = path.join(WWW, "src/modules/docs/references/generated")
for (const file of fs.readdirSync(refsDir).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(fs.readFileSync(path.join(refsDir, file), "utf8"))
  for (const [name, prop] of Object.entries(data.props ?? {})) {
    for (const [kind, code] of [
      ["type", prop.detailedType ?? prop.type],
      ["default", prop.default],
    ]) {
      if (code) {
        corpus.push({
          id: `ref:${data.name}.${name}.${kind}`,
          lang: "ts",
          code,
          typePosition: kind === "type",
        })
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Per-char color pairs for each engine
// ---------------------------------------------------------------------------
const TYPE_PREFIX = "type _ =\n"
const shikiColorsAt = (code, lang, typePosition) => {
  const input = typePosition ? TYPE_PREFIX + code : code
  const skip = typePosition ? TYPE_PREFIX.length : 0
  const arr = new Array(code.length).fill(PALETTE.plain)
  for (const theme of ["github-light", "github-dark"]) {
    const { tokens } = shiki.codeToTokens(input, {
      lang: lang === "shell" ? "bash" : lang,
      theme,
    })
    const idx = theme === "github-light" ? 0 : 1
    for (const line of tokens) {
      for (const t of line) {
        for (let i = 0; i < t.content.length; i++) {
          const at = t.offset + i - skip
          if (at < 0) continue
          const prev = arr[at].split("|")
          prev[idx] = (t.color ?? "").toUpperCase()
          arr[at] = prev.join("|")
        }
      }
    }
  }
  return arr
}

const tanstackColorsAt = (code, lang, refined) => {
  const arr = new Array(code.length).fill(PALETTE.plain)
  const result = tsHl.tokenize(code, { lang })
  const tokens = refined
    ? refineTokens(result.tokens, code, result.lang)
    : result.tokens
  let off = 0
  for (const t of tokens) {
    const pair = t.className
      ? (PALETTE[t.className] ?? PALETTE.plain)
      : PALETTE.plain
    for (let i = 0; i < t.value.length; i++) arr[off + i] = pair
    off += t.value.length
  }
  return arr
}

/** Group per-char pairs into [text, light, dark, diffFlag] segments. */
const toSegments = (code, colors, diffAt) => {
  const segments = []
  let from = 0
  for (let i = 1; i <= code.length; i++) {
    if (
      i === code.length ||
      colors[i] !== colors[from] ||
      diffAt[i] !== diffAt[from]
    ) {
      const [light, dark] = colors[from].split("|")
      segments.push([code.slice(from, i), light, dark, diffAt[from] ? 1 : 0])
      from = i
    }
  }
  return segments
}

// ---------------------------------------------------------------------------
// Build blocks
// ---------------------------------------------------------------------------
const bucketIndex = new Map() // label -> index
const buckets = []
const blocks = []
let comparedChars = 0
let refinedMismatch = 0
let rawMismatch = 0

for (const { id, lang, code, typePosition } of corpus) {
  if (!TS_LANGS.includes(lang) || lang === "plaintext") continue
  let sk
  try {
    sk = shikiColorsAt(code, lang, typePosition)
  } catch {
    continue
  }
  const refined = tanstackColorsAt(code, lang, true)
  const raw = tanstackColorsAt(code, lang, false)

  const diffRefined = new Array(code.length).fill(0)
  const diffRaw = new Array(code.length).fill(0)
  const blockBuckets = new Set()
  let blockMismatch = 0
  for (let i = 0; i < code.length; i++) {
    if (/\s/.test(code[i])) continue
    comparedChars++
    if (raw[i] !== sk[i]) {
      diffRaw[i] = 1
      rawMismatch++
    }
    if (refined[i] !== sk[i]) {
      diffRefined[i] = 1
      refinedMismatch++
      blockMismatch++
      const label = `shiki ${sk[i]} → tanstack ${refined[i]}`
      if (!bucketIndex.has(label)) {
        bucketIndex.set(label, buckets.length)
        buckets.push({ label, count: 0, blocks: 0 })
      }
      const b = buckets[bucketIndex.get(label)]
      b.count++
      if (!blockBuckets.has(label)) {
        blockBuckets.add(label)
        b.blocks++
      }
    }
  }
  if (blockMismatch === 0) continue

  // Clip to the lines containing refined-vs-shiki diffs (±2 context lines):
  // most blocks are long demo files with a couple of differing characters.
  const lineStarts = [0]
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "\n") lineStarts.push(i + 1)
  }
  const lineOf = (i) => {
    let lo = 0
    let hi = lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (lineStarts[mid] <= i) lo = mid
      else hi = mid - 1
    }
    return lo
  }
  const diffLines = new Set()
  for (let i = 0; i < code.length; i++) {
    if (diffRefined[i]) diffLines.add(lineOf(i))
  }
  const keepLine = new Set()
  for (const l of diffLines) {
    for (let d = -2; d <= 2; d++) {
      if (l + d >= 0 && l + d < lineStarts.length) keepLine.add(l + d)
    }
  }
  const ranges = []
  for (let l = 0; l < lineStarts.length; l++) {
    if (!keepLine.has(l)) continue
    const from = lineStarts[l]
    const to = l + 1 < lineStarts.length ? lineStarts[l + 1] - 1 : code.length
    const last = ranges[ranges.length - 1]
    if (last && last.toLine === l - 1) {
      last.to = to
      last.toLine = l
    } else {
      ranges.push({ from, to, fromLine: l, toLine: l })
    }
  }
  const snippets = ranges.map((r) => ({
    line: r.fromLine + 1,
    shiki: toSegments(
      code.slice(r.from, r.to),
      sk.slice(r.from, r.to),
      diffRefined.slice(r.from, r.to),
    ),
    refined: toSegments(
      code.slice(r.from, r.to),
      refined.slice(r.from, r.to),
      diffRefined.slice(r.from, r.to),
    ),
    raw: toSegments(
      code.slice(r.from, r.to),
      raw.slice(r.from, r.to),
      diffRaw.slice(r.from, r.to),
    ),
  }))

  blocks.push({
    id,
    lang,
    mismatchChars: blockMismatch,
    totalLines: lineStarts.length,
    buckets: [...blockBuckets].map((l) => bucketIndex.get(l)),
    snippets,
  })
}

blocks.sort((a, b) => b.mismatchChars - a.mismatchChars)
const CAP = 250
const dropped = Math.max(0, blocks.length - CAP)
const kept = blocks.slice(0, CAP)

const out = {
  stats: {
    corpusBlocks: corpus.length,
    comparedChars,
    refinedMismatch,
    rawMismatch,
    refinedPct: +((refinedMismatch / comparedChars) * 100).toFixed(2),
    rawPct: +((rawMismatch / comparedChars) * 100).toFixed(2),
    mismatchingBlocks: blocks.length,
    shownBlocks: kept.length,
    droppedBlocks: dropped,
  },
  buckets,
  blocks: kept,
}

const outPath = path.join(WWW, "src/modules/dev/highlight-lab/data.json")
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(out))
console.log(
  `wrote ${outPath} — ${kept.length}/${blocks.length} mismatching blocks (${dropped} dropped), ` +
    `${buckets.length} buckets, refined ${out.stats.refinedPct}% vs raw ${out.stats.rawPct}%, ` +
    `${(fs.statSync(outPath).size / 1024).toFixed(0)} KB`,
)
