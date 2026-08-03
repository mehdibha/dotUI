import {
  createHighlighter,
  renderNodesToHtml,
  renderTokens,
  type Highlighter,
  type HighlightToken,
  type HighlightTokenClass,
} from "@tanstack/highlight/core"

/**
 * Contextual refinement over @tanstack/highlight's token stream so output
 * matches what shiki's github themes rendered before the migration. The
 * tokenizer alone is coarser than a TextMate grammar in ways that read as
 * regressions (verified against shiki over the full docs corpus by
 * scripts/highlight-parity.mjs):
 *
 * - every Capitalized identifier is classed `type`, even imports and JSX text
 * - function calls, JSX expression attributes, and assignment `=` stay plain
 * - member reads and object keys are classed `property` (shiki: plain)
 * - lowercase JSX tags share the component color (shiki: green vs blue)
 * - `const` binding names, parameter names, and type operators stay plain
 * - keywords/numbers/apostrophes inside JSX text get code colors
 *
 * Rules run only for script languages (+ a string rule for shell); other
 * languages pass through untouched. Class names are reused for their color:
 * `function` = purple, `literal`/`type`/`tag` = blue, `variable` = orange,
 * `selector` = green (see highlight.css).
 */

const SCRIPT_LANGS = new Set(["ts", "tsx", "js", "jsx"])

// Type-position keywords: an identifier right after one stays a type.
// (`typeof` is absent on purpose: its operand is a value and shiki leaves it
// plain.)
const TYPE_KEEP_WORDS = new Set([
  "as",
  "satisfies",
  "extends",
  "implements",
  "new",
  "keyof",
  "infer",
  "type",
  "interface",
  "is",
])

// Built-in types shiki keeps blue in type position (incl. `void`).
const PRIMITIVES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "symbol",
  "bigint",
  "any",
  "unknown",
  "never",
  "void",
])

// Globals shiki colors blue in value position. Only `Promise` has a support
// scope in the TS grammar — `Array`, `Object` etc. render plain.
const BUILTIN_GLOBALS = new Set(["Promise"])

const IDENT = /[A-Za-z_$][A-Za-z0-9_$]*/y
const OPERATOR = /\.\.\.|=>|\|\||&&|===|!==|==|!=|\?\?|>=|<=|[|&!?:=]/y

type Ctx = {
  code: string
  /** true for API-reference type strings (`ts`): type positions dominate. */
  typeBias: boolean
}

function prevNonWs(code: string, i: number): { ch: string; i: number } {
  let j = i - 1
  while (j >= 0 && /\s/.test(code[j]!)) j--
  return { ch: j >= 0 ? code[j]! : "", i: j }
}

function nextNonWs(code: string, i: number): { ch: string; i: number } {
  let j = i
  while (j < code.length && /\s/.test(code[j]!)) j++
  return { ch: j < code.length ? code[j]! : "", i: j }
}

function wordEndingAt(code: string, i: number): string {
  let s = i + 1
  while (s > 0 && /[A-Za-z]/.test(code[s - 1]!)) s--
  return code.slice(s, i + 1)
}

/** Line up to `at` (for cheap statement-shape checks). */
function lineBefore(code: string, at: number): string {
  return code.slice(code.lastIndexOf("\n", at - 1) + 1, at)
}

/** Inside an import clause (possibly multiline) — specifiers are values. */
function inImportClause(code: string, at: number): boolean {
  const from = code.lastIndexOf("import", at)
  if (from === -1 || at - from > 500) return false
  return !/[;=)]|\bfrom\s+['"]/.test(code.slice(from, at))
}

/**
 * True when position sits in JSX text: scanning back over prose characters,
 * the first structural character is a tag-closing `>`.
 */
function inJsxText(code: string, at: number): boolean {
  for (let j = at - 1; j >= 0 && at - j < 400; j--) {
    const ch = code[j]!
    // A dot reads as prose punctuation only before whitespace (`word. Next`);
    // `state.setValue` is code.
    if (ch === "." && !/\s|^$/.test(code[j + 1] ?? "")) return false
    // JSX text nodes don't span blank lines.
    if (ch === "\n" && code[j - 1] === "\n") return false
    if (/[A-Za-z0-9\s,.'’!?"\-—:;]/.test(ch)) continue
    // `>` closes a tag — but not `/>` (self-closing) or `=>` (arrow).
    return ch === ">" && code[j - 1] !== "/" && code[j - 1] !== "="
  }
  return false
}

/** `const|let|var` binding position, incl. multiline destructuring. */
function inBindingPosition(code: string, at: number): boolean {
  const before = lineBefore(code, at)
  if (
    /^\s*(?:export\s+)?(?:const|let|var)\s/.test(before) &&
    !before.includes("=")
  ) {
    return true
  }
  // Multiline `const {\n  name,\n  …`: scan back over list characters to the
  // opening brace/bracket, then check the keyword right before it.
  let j = at - 1
  while (j >= 0 && at - j < 400 && /[\w\s,$]/.test(code[j]!)) j--
  if (code[j] === "{" || code[j] === "[") {
    const kw = prevNonWs(code, j)
    return (
      /[A-Za-z]/.test(kw.ch) &&
      /^(?:const|let|var)$/.test(wordEndingAt(code, kw.i))
    )
  }
  return false
}

/** After the next `=`: `(`, `async` or `function` means a function binding. */
function bindsFunction(code: string, from: number): boolean {
  const eq = code.indexOf("=", from)
  if (eq === -1) return false
  const { ch, i } = nextNonWs(code, eq + 1)
  if (ch === "(") return true
  return /^(?:async|function)\b/.test(code.slice(i, i + 9))
}

/** `useState<T>(…)`: identifier followed by a generic list then a call. */
function callsWithGenerics(code: string, at: number): boolean {
  if (code[at] !== "<") return false
  let depth = 0
  for (let j = at; j < code.length && j - at < 160; j++) {
    const ch = code[j]!
    if (ch === "<") depth++
    else if (ch === ">") {
      depth--
      if (depth === 0) return nextNonWs(code, j + 1).ch === "("
    } else if (ch === ";" || ch === "\n") return false
  }
  return false
}

/**
 * Arrow-function parameter position (shiki's orange): inside `( … )` or
 * `({ … })` whose closing paren is followed by `=>`. Call arguments stay
 * plain — shiki only colors declarations.
 */
function isArrowParam(code: string, at: number): boolean {
  // Back to an opening `(` over parameter-list characters.
  let j = at - 1
  let brace = 0
  for (; j >= 0 && at - j < 300; j--) {
    const ch = code[j]!
    if (ch === "}") brace++
    else if (ch === "{") {
      if (brace === 0) {
        // `({` destructured pattern — keep walking past it.
        if (prevNonWs(code, j).ch !== "(") return false
        j = prevNonWs(code, j).i
        break
      }
      brace--
    } else if (ch === "(") break
    else if (!/[\w\s,.$'"[\]:?=>!/@#*%+-]/.test(ch)) return false
  }
  if (code[j] !== "(") return false
  // `function name(` / `load(` method heads take params; `if (`/`for (` and
  // plain calls don't.
  const headWord = /[A-Za-z]/.test(code[j - 1] ?? "")
    ? wordEndingAt(code, j - 1)
    : ""
  if (/^(?:if|for|while|switch|catch|return)$/.test(headWord)) return false
  // Require `=>` (arrow) or `{` (function/method body) after the matching `)`.
  let depth = 0
  for (let k = j; k < code.length && k - j < 600; k++) {
    const ch = code[k]!
    if (ch === "(") depth++
    else if (ch === ")") {
      depth--
      if (depth === 0) {
        const m = nextNonWs(code, k + 1)
        if (m.ch === ":") {
          // Skip a return-type annotation up to `=>` on the same statement.
          const arrow = code.indexOf("=>", m.i)
          return arrow !== -1 && arrow - m.i < 200
        }
        if (code.slice(m.i, m.i + 2) === "=>") return true
        // A body brace right after: function declaration or object method —
        // but only when the head is a named function, not a call result.
        return m.ch === "{" && headWord !== ""
          ? isFunctionHead(code, j - headWord.length)
          : false
      }
    }
  }
  return false
}

/** `function name(` / `async name(` / `name(` as an object-method head. */
function isFunctionHead(code: string, nameStart: number): boolean {
  const before = prevNonWs(code, nameStart)
  if (/[A-Za-z]/.test(before.ch)) {
    const w = wordEndingAt(code, before.i)
    if (w === "function" || w === "async" || w === "get" || w === "set")
      return true
  }
  // Object-literal method shorthand: `{ load({ … }) { … } }`.
  return before.ch === "{" || before.ch === ","
}

/** Nearest unmatched `(` or `{` opener before `at` (up to a `;`). */
function nearestOpener(code: string, at: number): { ch: string; i: number } {
  let paren = 0
  let brace = 0
  for (let j = at - 1; j >= 0 && at - j < 600; j--) {
    const ch = code[j]!
    if (ch === ")") paren++
    else if (ch === "(") {
      if (paren === 0) return { ch, i: j }
      paren--
    } else if (ch === "}") brace++
    else if (ch === "{") {
      if (brace === 0) return { ch, i: j }
      brace--
    } else if (ch === ";") break
  }
  return { ch: "", i: -1 }
}

/**
 * `{` that opens a type literal: `type X = {`, `interface X {`, `key?: {`,
 * or the `> {` line closing a multiline interface heritage clause. A bare
 * `key: {` stays a value object — `chartConfig = { desktop: { … } }`.
 */
function isTypeLiteralOpener(code: string, at: number): boolean {
  // `}: {` / `): {` — a destructured-parameter type annotation — also opens
  // a type literal; a bare `key: {` after a word stays a value object.
  return /(?:\btype\s+[\w$]+\s*=|\binterface\s+[\w$]+[^{]*|\?:|[})]\s*:|^\s*>)\s*$/.test(
    lineBefore(code, at),
  )
}

/**
 * A `:` in annotation position — return type (`): T`), `const x: T`, or
 * enclosed by a parameter list / type-literal brace. Object-literal values
 * fail all of these.
 */
function annotationContext(code: string, at: number): boolean {
  if (prevNonWs(code, at).ch === ")") return true
  if (
    /^\s*(?:export\s+)?(?:const|let|var)\s+[\w$]+\s*$/.test(
      lineBefore(code, at),
    )
  ) {
    return true
  }
  const opener = nearestOpener(code, at)
  if (opener.ch === "(") return true
  return opener.ch === "{" && isTypeLiteralOpener(code, opener.i)
}

/**
 * Inside an open JSX tag (`<Tag …` with no closing `>` yet): a bare
 * identifier there is a boolean attribute.
 */
function inJsxTagAttrs(code: string, at: number): boolean {
  let brace = 0
  for (let j = at - 1; j >= 0 && at - j < 400; j--) {
    const ch = code[j]!
    if (ch === "}") brace++
    else if (ch === "{") {
      // An unmatched `{` means we're inside an expression value, not the tag.
      if (brace === 0) return false
      brace--
    } else if (ch === "<") {
      return (
        /[A-Za-z]/.test(code[j + 1] ?? "") && !/[\w$]/.test(code[j - 1] ?? "")
      )
    } else if (ch === ">" || ch === ";") return false
    else if (!/[\w\s"'=$[\]().,:?&|!/*#@%+~^-]/.test(ch)) return false
  }
  return false
}

function classifyIdentifier(
  id: string,
  s: number,
  e: number,
  ctx: Ctx,
): HighlightTokenClass | undefined {
  const { code } = ctx
  const nx = code[e] ?? ""
  const nnw = nextNonWs(code, e)
  const pnw = prevNonWs(code, s)

  // A JSX open the tokenizer missed (multiline tags): `<a\n  href=…`.
  if (pnw.ch === "<" && !/[\w$]/.test(code[pnw.i - 1] ?? "")) {
    return /[a-z]/.test(id[0] ?? "") ? "selector" : "tag"
  }
  // Class declaration name: `class TagSegmentList extends …` (the body/heritage
  // requirement keeps prose like “a border-t class applied” plain).
  if (
    /[A-Za-z]/.test(pnw.ch) &&
    wordEndingAt(code, pnw.i) === "class" &&
    (nnw.ch === "{" ||
      /^(?:extends|implements)\b/.test(code.slice(nnw.i, nnw.i + 10)))
  ) {
    return "function"
  }
  // JSX attribute written as `name={…}` / `name="…"` (no space before `=`).
  if (
    nx === "=" &&
    code[e + 1] !== "=" &&
    ['"', "'", "{"].includes(code[e + 1] ?? "")
  ) {
    return "attr"
  }
  // Optional member of a type literal: `title?: string` — shiki's orange.
  if (nx === "?" && code[e + 1] === ":") return "variable"
  // Prose inside JSX text never gets code colors.
  if (!ctx.typeBias && inJsxText(code, s)) return undefined
  // Function call / declaration name (incl. generic calls `useState<T>(`).
  if (nnw.ch === "(" || callsWithGenerics(code, nnw.i)) return "function"
  // Parameter name in a type signature: `(values: T) => …`, `(a: X, b: Y)`.
  if (ctx.typeBias && nnw.ch === ":" && (pnw.ch === "(" || pnw.ch === ",")) {
    return "variable"
  }
  // `const name =` — blue, or purple when it binds a function.
  if (inBindingPosition(code, s)) {
    return bindsFunction(code, e) ? "function" : "literal"
  }
  // Names before `:` — annotated parameters and type-literal members get
  // shiki's orange, function-valued keys (`onClick: () => …`) get method
  // purple, plain object-literal keys stay plain.
  if (!ctx.typeBias && nnw.ch === ":") {
    if (/ \? /.test(lineBefore(code, s))) return undefined // ternary branch
    const after = code.slice(nnw.i + 1, nnw.i + 40)
    if (/^\s*(?:async\s*)?\(/.test(after) && after.includes("=>"))
      return "function"
    return annotationContext(code, s) ? "variable" : undefined
  }
  // Destructured/plain arrow parameters: shiki's orange. Member-access bases
  // (`date.toDate`) and call arguments stay plain.
  if (!ctx.typeBias && nx !== "." && isArrowParam(code, s)) return "variable"
  // Valueless boolean JSX attribute: `<BarChart accessibilityLayer …>`.
  if (!ctx.typeBias && nx !== ":" && inJsxTagAttrs(code, s)) return "attr"
  if (BUILTIN_GLOBALS.has(id)) return "type"
  return undefined
}

function classifyOperator(
  op: string,
  s: number,
  ctx: Ctx,
): HighlightTokenClass | undefined {
  if (op === ":") {
    // Annotation colons read red; object-literal colons stay plain. In tsx,
    // only the unambiguous `}: Type` / `): Type` / `?: Type` shapes are
    // treated as annotations.
    if (ctx.typeBias) return "operator"
    const pnw = prevNonWs(ctx.code, s)
    if (["}", ")", "?"].includes(pnw.ch)) return "operator"
    // Ternary branch separator: a ` ? ` earlier on the same line.
    if (/ \? /.test(lineBefore(ctx.code, s))) return "operator"
    // Parameter/type-member annotation: `(text: string)`, `{ id: string }`.
    return annotationContext(ctx.code, s) ? "operator" : undefined
  }
  if (op === "?") {
    // Optional (`?:`), ternary (` ? `), optional chain (`?.`) — but not
    // question marks in JSX prose.
    if (ctx.typeBias) return "operator"
    const nx = ctx.code[s + 1] ?? ""
    const isTernary = ctx.code[s - 1] === " " && nx === " "
    return nx === ":" || nx === "." || isTernary ? "operator" : undefined
  }
  return "operator"
}

function refineTypeToken(
  value: string,
  s: number,
  e: number,
  ctx: Ctx,
): HighlightTokenClass | undefined {
  const { code, typeBias } = ctx
  const pnw = prevNonWs(code, s)
  // Import clauses reference values, not types: `import { type ChartConfig }`.
  if (!typeBias && inImportClause(code, s)) {
    return classifyIdentifier(value, s, e, ctx)
  }
  // `.` keeps a type only when directly adjacent (`React.Ref`), not across a
  // sentence period in JSX prose (`source. You`).
  const dotQualified = code[s - 1] === "."
  const keepChars = typeBias ? ["<", "|", "&", "(", ",", ">"] : ["<", "|", "&"]
  let keep =
    (typeBias && pnw.i === -1) ||
    dotQualified ||
    keepChars.includes(pnw.ch) ||
    // After a `:` only in annotation position (`d: DateValue`), not after an
    // object key (`icon: MonitorIcon` references a value).
    (pnw.ch === ":" && (typeBias || annotationContext(code, pnw.i))) ||
    (/[A-Za-z]/.test(pnw.ch) && TYPE_KEEP_WORDS.has(wordEndingAt(code, pnw.i)))
  // In tsx, `>` before an identifier is JSX text unless it closes an arrow.
  if (!typeBias && pnw.ch === ">" && code[pnw.i - 1] === "=") keep = true

  if (!keep) return classifyIdentifier(value, s, e, ctx)
  // A JSX open (`<` not preceded by an identifier) is a component tag: blue.
  if (pnw.ch === "<" && !/[\w$]/.test(code[pnw.i - 1] ?? "")) return "tag"
  if (PRIMITIVES.has(value)) return "type"
  // Named types: shiki's entity purple.
  return /[A-Z]/.test(value[0] ?? "") ? "function" : "type"
}

/** Split a plain run into identifier/operator/other pieces and classify. */
function splitPlain(value: string, start: number, ctx: Ctx): HighlightToken[] {
  const out: HighlightToken[] = []
  let plainFrom = 0
  const flush = (to: number) => {
    if (to > plainFrom) out.push({ value: value.slice(plainFrom, to) })
  }
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]!
    const prev = value[i - 1] ?? ctx.code[start + i - 1] ?? ""
    let match: string | undefined
    let className: HighlightTokenClass | undefined
    if (/[A-Za-z_$]/.test(ch)) {
      IDENT.lastIndex = i
      match = IDENT.exec(value)?.[0]
      // `aria-label=` / bare `data-control-target` — dashed attribute names
      // classify as one unit (only adopted when they classify as attributes).
      const dashed = /^[A-Za-z_$][\w$]*(?:-[\w$]+)+/.exec(value.slice(i))?.[0]
      if (
        dashed &&
        classifyIdentifier(
          dashed,
          start + i,
          start + i + dashed.length,
          ctx,
        ) === "attr"
      ) {
        match = dashed
        className = "attr"
      } else if (match) {
        className = classifyIdentifier(
          match,
          start + i,
          start + i + match.length,
          ctx,
        )
      }
    } else if (/\d/.test(ch) && !/[\w$.]/.test(prev)) {
      match = /^\d[\d_]*(?:\.\d+)?/.exec(value.slice(i))?.[0]
      if (match && !/[\w$]/.test(value[i + match.length] ?? "")) {
        className = inJsxText(ctx.code, start + i) ? undefined : "number"
      } else {
        match = undefined
      }
    } else if (
      (ch === "-" || ch === "+") &&
      value[i - 1] === " " &&
      value[i + 1] === " " &&
      !inJsxText(ctx.code, start + i)
    ) {
      // Spaced binary arithmetic (`page - 1`) — red, unless it's JSX prose.
      match = ch
      className = "operator"
    } else if (
      ch === "'" &&
      ["(", ",", "[", "{", "<", "=", ":"].includes(
        prevNonWs(ctx.code, start + i).ch,
      )
    ) {
      // A quoted literal the tokenizer missed (mis-parsed regions).
      match = /^'[^'\n]*'/.exec(value.slice(i))?.[0]
      if (match) className = "string"
    } else if (ch === "*" && inImportClause(ctx.code, start + i)) {
      // Namespace import star: `import * as X` — shiki's blue.
      match = "*"
      className = "type"
    } else if (/[|&!?:=.<>]/.test(ch)) {
      OPERATOR.lastIndex = i
      match = OPERATOR.exec(value)?.[0]
      if (match) className = classifyOperator(match, start + i, ctx)
    }
    if (match) {
      if (className) {
        flush(i)
        out.push({ className, value: match })
        plainFrom = i + match.length
      }
      i += match.length - 1
    }
  }
  flush(value.length)
  return out
}

export function refineTokens(
  tokens: ReadonlyArray<HighlightToken>,
  code: string,
  lang: string,
): HighlightToken[] {
  if (lang === "shell") {
    // Shiki paints every bash argument as a string; keep that look.
    const out: HighlightToken[] = []
    for (const token of tokens) {
      if (token.className) {
        out.push(token)
        continue
      }
      for (const piece of token.value.split(/(\s+)/)) {
        if (!piece) continue
        out.push(
          /\S/.test(piece)
            ? { className: "string", value: piece }
            : { value: piece },
        )
      }
    }
    return out
  }
  if (!SCRIPT_LANGS.has(lang)) return [...tokens]

  const ctx: Ctx = { code, typeBias: lang === "ts" }
  const out: HighlightToken[] = []
  let offset = 0
  for (const token of tokens) {
    const start = offset
    offset += token.value.length
    if (!token.className) {
      out.push(...splitPlain(token.value, start, ctx))
      continue
    }
    switch (token.className) {
      case "type":
        out.push({
          ...token,
          className: refineTypeToken(token.value, start, offset, ctx),
        })
        continue
      case "property": {
        // Method calls purple; destructured params/bindings keep their
        // identifier colors; member reads and object keys plain, like shiki.
        out.push({
          ...token,
          className: classifyIdentifier(token.value, start, offset, ctx),
        })
        continue
      }
      case "tag":
        // Lowercase elements get shiki's green; components keep blue.
        if (/[a-z]/.test(token.value[0] ?? "")) {
          out.push({ ...token, className: "selector" })
          continue
        }
        break
      case "keyword": {
        // `Array.from(…)` — a keyword right after `.` is a method call.
        if (code[start - 1] === ".") {
          const isCall = nextNonWs(code, offset).ch === "("
          out.push({ ...token, className: isCall ? "function" : undefined })
          continue
        }
        // `{ type: 'text' }` — a keyword used as an object key stays plain.
        if (!ctx.typeBias && code[offset] === ":") {
          out.push({ value: token.value })
          continue
        }
        // Prose in JSX text: “How do I get started?”
        if (!ctx.typeBias && inJsxText(code, start)) {
          out.push({ value: token.value })
          continue
        }
        break
      }
      case "number":
        if (!ctx.typeBias && inJsxText(code, start)) {
          out.push({ value: token.value })
          continue
        }
        break
      case "string":
        // An apostrophe in JSX text (“We'll…”) is not a string opener.
        if (!ctx.typeBias && token.value[0] === "'" && inJsxText(code, start)) {
          out.push({ value: token.value })
          continue
        }
        break
    }
    out.push(token)
  }
  return out
}

/**
 * A Highlighter whose tokenize applies refineTokens; the other methods mirror
 * @tanstack/highlight core exactly, over the refined tokens.
 */
export function createRefinedHighlighter(
  options: Parameters<typeof createHighlighter>[0],
): Highlighter {
  const base = createHighlighter(options)
  const escapeAttribute = (v: string) =>
    v
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

  const tokenize: Highlighter["tokenize"] = (code, opts = {}) => {
    const result = base.tokenize(code, opts)
    return {
      ...result,
      tokens: refineTokens(result.tokens, result.code, result.lang),
    }
  }
  const highlight: Highlighter["highlight"] = (code, opts = {}) => {
    const result = tokenize(code, opts)
    const innerHtml = renderNodesToHtml(renderTokens(result.tokens, opts))
    return {
      ...result,
      html: `<pre class="th-code th-code--${escapeAttribute(result.lang)}${opts.lineNumbers ? " th-code--line-numbers" : ""}" data-language="${escapeAttribute(result.lang)}"><code>${innerHtml}</code></pre>`,
    }
  }
  return {
    highlight,
    highlightToHtml: (code, opts = {}) => highlight(code, opts).html,
    listLanguages: base.listLanguages,
    normalizeLanguage: base.normalizeLanguage,
    renderCodeBlockData: ({ code, decorations, lang, lineNumbers, title }) => {
      const copyText = code.trimEnd()
      const result = highlight(copyText, { decorations, lang, lineNumbers })
      return {
        copyText,
        htmlMarkup: result.html,
        lang: result.lang,
        title,
        tokens: result.tokens,
      }
    },
    tokenize,
  }
}
