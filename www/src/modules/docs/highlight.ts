import type { Root } from "hast"
import { parse, type ParsedToken, type TokenType } from "sugar-high/core"
import * as typescript from "sugar-high/lang/typescript"

/**
 * Synchronous TSX highlighter for code the client generates at runtime
 * (playground output, exported source). Static docs code is highlighted at
 * build time by shiki in the rehype pipeline; this runs sugar-high (~4 KB)
 * instead of shipping shiki's grammar and engine to the browser, and paints
 * its tokens with the same github-light / github-dark colors so both look alike.
 */

type Colors = [light: string, dark: string]

const FG: Colors = ["#24292E", "#E1E4E8"]
const KEYWORD: Colors = ["#D73A49", "#F97583"]
const STRING: Colors = ["#032F62", "#9ECBFF"]
const COMMENT: Colors = ["#6A737D", "#6A737D"]
const ENTITY: Colors = ["#6F42C1", "#B392F0"]
const CONSTANT: Colors = ["#005CC5", "#79B8FF"]
const TAG: Colors = ["#22863A", "#85E89D"]
const PARAM: Colors = ["#E36209", "#FFAB70"]

const COLORS: Record<TokenType, Colors> = {
  identifier: FG,
  sign: FG,
  space: FG,
  break: FG,
  jsxliterals: FG,
  keyword: KEYWORD,
  string: STRING,
  comment: COMMENT,
  class: FG,
  entity: ENTITY,
  property: FG,
}

const LITERALS = new Set(["true", "false", "null", "undefined"])
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
const TYPE_PREFIX = new Set([
  ":",
  "<",
  "|",
  "&",
  "as",
  "extends",
  "keyof",
  "satisfies",
])
const OPERATOR = /^[=&|?!+\-*/%]+$/

interface State {
  /** Paren depth inside a `function` parameter list; 0 when outside one. */
  params: number
  /** Brace depth inside an `interface` body; 0 when outside one. */
  members: number
  /** Seen `function` / `interface`, waiting for its `(` / `{`. */
  awaiting: "(" | "{" | null
}

function significant(
  tokens: readonly ParsedToken[],
  from: number,
  step: 1 | -1,
) {
  for (let i = from + step; i >= 0 && i < tokens.length; i += step) {
    const token = tokens[i]
    if (token && token.type !== "space") return token
  }
  return undefined
}

/** `(a, b) =>` — the identifier at `index` sits in an arrow function's parameter list. */
function isArrowParam(tokens: readonly ParsedToken[], index: number): boolean {
  let depth = 0
  for (let i = index + 1; i < tokens.length; i++) {
    const value = tokens[i]?.value
    if (value === "(" || value === "{" || value === "[") depth++
    else if (value === ")" || value === "}" || value === "]") {
      if (depth > 0) depth--
      else
        return (
          value === ")" &&
          tokens[i + 1]?.value === " " &&
          tokens[i + 2]?.value === "=" &&
          tokens[i + 3]?.value === ">"
        )
    }
  }
  return false
}

// sugar-high's token types are coarser than a TextMate grammar; the lookarounds
// recover the distinctions github's theme paints (types, tags, params, operators).
function colorsOf(
  tokens: readonly ParsedToken[],
  index: number,
  state: State,
): Colors {
  const token = tokens[index]
  if (!token) return FG
  const { type, value } = token
  const prev = significant(tokens, index, -1)
  const next = significant(tokens, index, 1)
  switch (type) {
    case "keyword":
      if (LITERALS.has(value) || PRIMITIVES.has(value)) return CONSTANT
      if (next?.value === ":") return FG
      return KEYWORD
    case "identifier": {
      const opensName =
        !prev || prev.value === "(" || prev.value === "{" || prev.value === ","
      if (
        opensName &&
        (state.params > 0 || state.members > 0 || isArrowParam(tokens, index))
      )
        return PARAM
      return FG
    }
    case "class":
      if (/^\d/.test(value)) return CONSTANT
      if (prev?.value === "type") return next?.value === "=" ? ENTITY : FG
      if (
        prev?.value === "function" ||
        prev?.value === "interface" ||
        (prev && TYPE_PREFIX.has(prev.value))
      )
        return ENTITY
      return FG
    case "entity":
      if (prev?.value === "<" || prev?.value === "</") {
        return /^[A-Z]/.test(value) ? CONSTANT : TAG
      }
      return ENTITY
    case "property":
      if (next?.value === ":") return FG
      if (prev?.value === "." && next?.value !== "(") return FG
      return ENTITY
    case "sign":
      if (OPERATOR.test(value)) return KEYWORD
      if (value === ">" && prev?.value === "=") return KEYWORD
      if (value === ":" && next) {
        if (next.type === "class" || PRIMITIVES.has(next.value)) return KEYWORD
        if (next.value === "{" && state.params > 0) return KEYWORD
      }
      return FG
    default:
      return COLORS[type]
  }
}

function advance(token: ParsedToken, state: State) {
  const { type, value } = token
  if (type === "space") return
  if (value === "function") state.awaiting = "("
  else if (value === "interface") state.awaiting = "{"
  else if (value === "(") {
    if (state.awaiting === "(") state.params = 1
    else if (state.params > 0) state.params++
    state.awaiting = null
  } else if (value === ")") {
    if (state.params > 0) state.params--
  } else if (value === "{") {
    if (state.awaiting === "{") state.members = 1
    else if (state.members > 0) state.members++
    state.awaiting = null
  } else if (value === "}") {
    if (state.members > 0) state.members--
  } else if (type !== "class" && type !== "identifier") {
    state.awaiting = null
  }
}

export interface Token {
  content: string
  /** Start offset in the source, 0-indexed. */
  offset: number
  light: string
  dark: string
}

/** Tokenize TSX into lines of colored tokens (no newline tokens). */
export function tokenizeTsx(code: string): Token[][] {
  const state: State = { params: 0, members: 0, awaiting: null }
  let offset = 0
  return parse(code, typescript).lines.map((line) => {
    const tokens: Token[] = []
    let cursor = offset
    line.tokens.forEach((token, index) => {
      if (!token.value) return
      const [light, dark] = colorsOf(line.tokens, index, state)
      advance(token, state)
      tokens.push({ content: token.value, offset: cursor, light, dark })
      cursor += token.value.length
    })
    offset += line.value.length + 1
    return tokens
  })
}

/**
 * Highlight TSX to HAST in the shape shiki emits (`pre > code > span.line`,
 * `--shiki-light` / `--shiki-dark` on every token), so the same <Pre> styles
 * render both.
 */
export function highlightTsx(code: string): Root {
  const lines = tokenizeTsx(code).flatMap((tokens, index) => {
    const line = {
      type: "element" as const,
      tagName: "span",
      properties: { className: ["line"] },
      children: tokens.map((token) => ({
        type: "element" as const,
        tagName: "span",
        properties: {
          style: `--shiki-light:${token.light};--shiki-dark:${token.dark}`,
        },
        children: [{ type: "text" as const, value: token.content }],
      })),
    }
    return index === 0 ? [line] : [{ type: "text" as const, value: "\n" }, line]
  })
  return {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: { tabIndex: 0 },
        children: [
          { type: "element", tagName: "code", properties: {}, children: lines },
        ],
      },
    ],
  }
}
