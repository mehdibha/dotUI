/**
 * Fails on comments in registry source, which ships to users. Allowed:
 * `// MARK:` labels, JSDoc in types.ts (the API reference source), lint and
 * ts directives, pure annotations, "Synced with" notes, and the entries in
 * registry-comments-allowlist.txt (`path: first line`, one per comment that
 * predates this check). Pass --write to regenerate it after removing comments.
 */
import fs from "node:fs"
import path from "node:path"
import { ts } from "ts-morph"

const root = path.resolve(import.meta.dirname, "..")
const registry = path.join(root, "src/registry")
const allowlistPath = path.join(
  import.meta.dirname,
  "registry-comments-allowlist.txt",
)

const ALLOWED = [
  /^\/\/ MARK: /,
  /^\/\/ (oxlint|eslint)-disable/,
  /^\/\/ @ts-(expect-error|ignore)/,
  /^\/\/ Synced with /,
  /^\/\* [#@]__PURE__ \*\/$/,
]

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory())
      return entry.name === "__generated__" ? [] : files(full)
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : []
  })
}

// Skips quoted strings, so `content: "/* x */"` isn't read as a comment.
function cssComments(text: string): string[] {
  const found: string[] = []
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === "\\") i += 2
    else if (ch === '"' || ch === "'") {
      i++
      while (i < text.length && text[i] !== ch) i += text[i] === "\\" ? 2 : 1
      i++
    } else if (ch === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2)
      const stop = end === -1 ? text.length : end + 2
      found.push(text.slice(i, stop))
      i = stop
    } else i++
  }
  return found
}

function comments(file: string, text: string): string[] {
  if (file.endsWith(".css")) return cssComments(text)
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  const found = new Map<number, string>()
  // `//` inside JSX text (a URL, a "//" separator) is text, not a comment.
  const jsxText: [number, number][] = []
  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.JsxText) {
      jsxText.push([node.pos, node.end])
      return
    }
    for (const range of [
      ...(ts.getLeadingCommentRanges(text, node.pos) ?? []),
      ...(ts.getTrailingCommentRanges(text, node.end) ?? []),
    ]) {
      found.set(range.pos, text.slice(range.pos, range.end))
    }
    node.getChildren(source).forEach(visit)
  }
  visit(source)
  return [...found]
    .filter(
      ([pos]) => !jsxText.some(([start, end]) => pos >= start && pos < end),
    )
    .sort(([a], [b]) => a - b)
    .map(([, comment]) => comment)
}

function isAllowed(file: string, comment: string) {
  if (ALLOWED.some((re) => re.test(comment))) return true
  return path.basename(file) === "types.ts" && comment.startsWith("/**")
}

const violations: string[] = []
for (const file of files(registry)) {
  const rel = path.relative(root, file)
  for (const comment of comments(file, fs.readFileSync(file, "utf8"))) {
    if (isAllowed(file, comment)) continue
    violations.push(`${rel}: ${comment.split("\n")[0]!.trim()}`)
  }
}

if (process.argv.includes("--write")) {
  fs.writeFileSync(allowlistPath, violations.sort().join("\n") + "\n")
  console.log(
    `Wrote ${violations.length} entries to ${path.relative(root, allowlistPath)}`,
  )
  process.exit(0)
}

// A multiset: a line listed twice allows two comments with that first line.
const allowed = new Map<string, number>()
for (const line of fs.readFileSync(allowlistPath, "utf8").split("\n")) {
  allowed.set(line, (allowed.get(line) ?? 0) + 1)
}
const fresh = violations.filter((v) => {
  const left = allowed.get(v) ?? 0
  allowed.set(v, left - 1)
  return left <= 0
})
if (fresh.length > 0) {
  console.error(
    `New comments in registry source, which ships to users. Only \`// MARK:\` labels and types.ts JSDoc are allowed:\n${fresh.join("\n")}`,
  )
  process.exit(1)
}
