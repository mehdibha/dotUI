// Reports Tailwind classes that have a shorter canonical spelling — the same
// check as IntelliSense's `suggestCanonicalClasses`. `--fix` rewrites them in
// place; `pnpm check:fix` runs it that way.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads"
import { __unstable__loadDesignSystem } from "@tailwindcss/node"
import { Scanner } from "@tailwindcss/oxide"

const root = path.resolve(import.meta.dirname, "..")
const cssPath = path.join(root, "src/styles.css")

async function loadDesignSystem() {
  return __unstable__loadDesignSystem(fs.readFileSync(cssPath, "utf8"), {
    base: path.dirname(cssPath),
  })
}

if (!isMainThread) {
  const design = await loadDesignSystem()
  const canonical = (workerData as string[]).map(
    (candidate) => design.canonicalizeCandidates([candidate])[0] ?? candidate,
  )
  parentPort!.postMessage(canonical)
  process.exit(0)
}

// Canonicalizing is ~1ms per class and there are ~15k unique ones: shard across threads.
async function canonicalize(candidates: string[]) {
  const threads = Math.max(
    1,
    Math.min(os.availableParallelism(), Math.ceil(candidates.length / 500)),
  )
  const shards = Array.from({ length: threads }, (_, i) =>
    candidates.filter((_, j) => j % threads === i),
  )
  const results = await Promise.all(
    shards.map(
      (shard) =>
        new Promise<string[]>((resolve, reject) => {
          const worker = new Worker(fileURLToPath(import.meta.url), {
            workerData: shard,
          })
          worker.once("message", resolve)
          worker.once("error", reject)
        }),
    ),
  )
  return new Map(
    shards.flatMap((shard, i) =>
      shard.map((c, j) => [c, results[i]?.[j] ?? c] as const),
    ),
  )
}

// The scanner also picks candidates out of code (`!block ||` reads as the legacy
// important prefix), so only classes inside a string literal count.
function insideString(content: string, position: number) {
  const line = content.slice(
    content.lastIndexOf("\n", position - 1) + 1,
    position,
  )
  const count = (text: string, char: string) => text.split(char).length - 1
  if (['"', "'", "`"].some((quote) => count(line, quote) % 2 === 1)) return true
  return count(content.slice(0, position), "`") % 2 === 1
}

// Tailwind canonicalizes `0px` to `0`, which is invalid arithmetic inside calc()
// (`calc(100svh - 0)`), so a `0px` kept there counts as canonical.
function isCanonical(candidate: string, canonical: string) {
  if (candidate === canonical) return true
  return (
    candidate.includes("calc(") &&
    candidate.replaceAll("0px", "0") === canonical
  )
}

const fix = process.argv.includes("--fix")
const scanner = new Scanner({
  sources: [
    { base: path.join(root, "src"), pattern: "**/*.{ts,tsx}", negated: false },
    { base: path.join(root, "content"), pattern: "**/*.mdx", negated: false },
  ],
})
scanner.scan()
const files = scanner.files
  .filter(
    (file) =>
      !file.includes("/__generated__/") && !file.endsWith("routeTree.gen.ts"),
  )
  .map((file) => {
    const content = fs.readFileSync(file, "utf8")
    const found = scanner.getCandidatesWithPositions({
      file,
      content,
      extension: path.extname(file).slice(1),
    })
    return { file, content, found }
  })

const canonical = await canonicalize([
  ...new Set(files.flatMap(({ found }) => found.map((f) => f.candidate))),
])

let count = 0
for (const { file, content, found } of files) {
  const edits: { position: number; from: string; to: string }[] = []
  for (const { candidate, position } of found) {
    const to = canonical.get(candidate)!
    if (isCanonical(candidate, to) || !insideString(content, position)) continue
    if (!content.startsWith(candidate, position)) {
      throw new Error(
        `${file}: scanner position ${position} does not hold "${candidate}"`,
      )
    }
    const line = content.slice(0, position).split("\n").length
    console.log(`${path.relative(root, file)}:${line}  ${candidate}  →  ${to}`)
    edits.push({ position, from: candidate, to })
    count++
  }
  if (fix && edits.length) {
    let out = content
    for (const edit of edits.sort((a, b) => b.position - a.position)) {
      out =
        out.slice(0, edit.position) +
        edit.to +
        out.slice(edit.position + edit.from.length)
    }
    fs.writeFileSync(file, out)
  }
}

if (count)
  console.log(
    `\n${count} non-canonical class${count === 1 ? "" : "es"}${fix ? " fixed" : ""}`,
  )
process.exit(count && !fix ? 1 : 0)
