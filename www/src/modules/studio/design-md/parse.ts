/* A DESIGN.md (Google Stitch's format) read into plain data: the frontmatter
   with its references resolved, the body split into canonical sections, and
   the unit parsers the mapper shares. Lenient by design: real files break
   the spec, so a bad block is skipped with a warning, never fatal. */

import { toHex, toOklch } from "@dotui/colors"
import type { Oklch } from "@dotui/colors"

export const MAX_BYTES = 512 * 1024

export type SectionName =
  | "overview"
  | "colors"
  | "typography"
  | "layout"
  | "elevation"
  | "shapes"
  | "components"
  | "responsive"
  | "ignored"

const SECTION_ALIASES: Record<string, SectionName> = {
  overview: "overview",
  "brand & style": "overview",
  "visual theme & atmosphere": "overview",
  colors: "colors",
  colours: "colors",
  "color palette": "colors",
  "color palette & roles": "colors",
  typography: "typography",
  "typography rules": "typography",
  type: "typography",
  layout: "layout",
  "layout & spacing": "layout",
  "layout principles": "layout",
  spacing: "layout",
  "elevation & depth": "elevation",
  elevation: "elevation",
  "depth & elevation": "elevation",
  depth: "elevation",
  shadows: "elevation",
  shapes: "shapes",
  shape: "shapes",
  components: "components",
  "component stylings": "components",
  "responsive behavior": "responsive",
  "do's and don'ts": "ignored",
  "iteration guide": "ignored",
  "known gaps": "ignored",
  "agent prompt guide": "ignored",
}

export interface Heading {
  level: 2 | 3
  text: string
  /** The canonical section it sits in, if any. */
  section?: SectionName
}

export interface ParsedDesignMd {
  /** The frontmatter, references resolved. */
  tokens?: Record<string, unknown>
  /** The frontmatter as written, for which token a reference names. */
  raw?: Record<string, unknown>
  /** Frontmatter `name`, else the H1. */
  title?: string
  /** Each canonical section's text, first occurrence only. */
  sections: Partial<Record<Exclude<SectionName, "ignored">, string>>
  /** The body without its ignored sections. */
  prose: string
  headings: Heading[]
  warnings: string[]
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const kebab = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

/* ------------------------------- primitives ------------------------------- */

const LENGTH = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em)?$/i

/** A length in px: rem and em count 16px, a bare number is px. */
export function dim(value: unknown): number | undefined {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : undefined
  if (typeof value !== "string") return
  const match = LENGTH.exec(value.trim())
  if (!match) return
  const n = Number(match[1])
  const unit = match[2]?.toLowerCase()
  return unit === "rem" || unit === "em" ? n * 16 : n
}

export interface Box {
  top: number
  right: number
  bottom: number
  left: number
}

/** A CSS 1–4 value shorthand. */
export function box(value: unknown): Box | undefined {
  if (typeof value === "number") return box(String(value))
  if (typeof value !== "string") return
  const parts = value.trim().split(/\s+/).map(dim)
  if (parts.length < 1 || parts.length > 4) return
  if (parts.some((part) => part === undefined)) return
  const [top, right = top, bottom = top, left = right] = parts as number[]
  return { top: top!, right: right!, bottom: bottom!, left: left! }
}

export interface ParsedColor {
  /** Absent only on `transparent`. */
  oklch?: Oklch
  alpha: number
  /** Lowercase `#rrggbb`. */
  hex?: string
}

const fraction = (text: string) =>
  text.endsWith("%") ? Number(text.slice(0, -1)) / 100 : Number(text)

function alphaOf(css: string): number {
  const hex = /^#([0-9a-f]{4}|[0-9a-f]{8})$/i.exec(css)
  if (hex) {
    const digits = hex[1]!
    const a = digits.length === 4 ? digits[3]!.repeat(2) : digits.slice(6)
    return parseInt(a, 16) / 255
  }
  const slash = /\/\s*([\d.]+%?)\s*\)$/.exec(css)
  if (slash) return fraction(slash[1]!)
  const legacy = /^(?:rgba?|hsla?)\(([^)]*)\)$/i.exec(css)
  const parts = legacy?.[1]!.split(",")
  if (parts?.length === 4) return fraction(parts[3]!.trim())
  return 1
}

export function color(value: unknown): ParsedColor | undefined {
  if (typeof value !== "string") return
  const css = value.trim()
  if (/^transparent$/i.test(css)) return { alpha: 0 }
  try {
    const oklch = toOklch(css)
    const alpha = alphaOf(css)
    if (!Number.isFinite(alpha)) return
    return { oklch, alpha: Math.min(Math.max(alpha, 0), 1), hex: toHex(oklch) }
  } catch {
    return
  }
}

export interface ShadowLayer {
  x: number
  y: number
  blur: number
  spread: number
  inset: boolean
  alpha: number
  color?: Oklch
}

const COLOR_IN_SHADOW =
  /(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^)]*\)|#[0-9a-fA-F]{3,8}\b/

/** Splits on `separator` outside parentheses. */
function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === "(") depth++
    else if (ch === ")") depth = Math.max(0, depth - 1)
    else if (ch === separator && depth === 0) {
      parts.push(text.slice(start, i))
      start = i + 1
    }
  }
  parts.push(text.slice(start))
  return parts
}

/** A `box-shadow` value's layers; anything that isn't one is dropped. */
export function shadows(css: string): ShadowLayer[] {
  const value = css
    .trim()
    .replace(/^box-shadow\s*:\s*/i, "")
    .replace(/;\s*$/, "")
  const layers: ShadowLayer[] = []
  for (const part of splitTopLevel(value, ",")) {
    let rest = part
    const colorMatch = COLOR_IN_SHADOW.exec(rest)
    const parsed = colorMatch ? color(colorMatch[0]) : undefined
    if (colorMatch) {
      if (!parsed) continue
      rest = rest.replace(colorMatch[0], " ")
    }
    const words = rest.trim().split(/\s+/).filter(Boolean)
    const inset = words.some((word) => word.toLowerCase() === "inset")
    const lengths = words
      .filter((word) => word.toLowerCase() !== "inset")
      .map((word) => (LENGTH.test(word) ? dim(word) : undefined))
    if (lengths.length < 2 || lengths.length > 4) continue
    if (lengths.some((length) => length === undefined)) continue
    const [x, y, blur = 0, spread = 0] = lengths as number[]
    layers.push({
      x: x!,
      y: y!,
      blur,
      spread,
      inset,
      alpha: parsed?.alpha ?? 1,
      color: parsed?.oklch,
    })
  }
  return layers
}

export const shadowStrength = (layer: ShadowLayer) =>
  (Math.abs(layer.y) + layer.blur) * layer.alpha

/** Inline code spans when the text has any, else the text itself. */
export function codeOrText(text: string): string[] {
  const spans = [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1]!)
  return spans.length > 0 ? spans : [text]
}

export function median(values: number[]): number | undefined {
  if (values.length === 0) return
  const sorted = [...values].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1]! + sorted[mid]!) / 2
}

/** Prose split into sentences, table rows kept whole. */
export function sentences(text: string): string[] {
  return text
    .split("\n")
    .flatMap((line) =>
      line.trim().startsWith("|") ? [line] : line.split(/(?<=[.!?])\s+/),
    )
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/* ------------------------------- frontmatter ------------------------------ */

const YAML_OPTIONS = {
  uniqueKeys: false,
  strict: false,
  logLevel: "error",
} as const

function topLevelBlocks(source: string) {
  const blocks: { key: string; text: string }[] = []
  for (const line of source.split("\n")) {
    const opens = /^[^\s#][^:]*:/.exec(line)
    if (opens) blocks.push({ key: opens[0].slice(0, -1), text: line })
    else if (blocks.length > 0) blocks[blocks.length - 1]!.text += `\n${line}`
  }
  return blocks
}

async function parseYaml(
  source: string,
  warnings: string[],
): Promise<Record<string, unknown>> {
  const { parse } = await import("yaml")
  try {
    const value: unknown = parse(source, YAML_OPTIONS)
    return isRecord(value) ? value : {}
  } catch {
    const merged: Record<string, unknown> = {}
    for (const block of topLevelBlocks(source)) {
      try {
        const value: unknown = parse(block.text, YAML_OPTIONS)
        if (isRecord(value)) Object.assign(merged, value)
      } catch {
        warnings.push(
          `frontmatter block '${block.key}' is invalid YAML — skipped`,
        )
      }
    }
    return merged
  }
}

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** YAML reads an unquoted `#hex` as a comment; take it from the line. */
function recoverHexes(colors: unknown, source: string) {
  if (!isRecord(colors)) return
  for (const [key, value] of Object.entries(colors)) {
    if (value !== null) continue
    const match = new RegExp(
      `^\\s*${escapeRegExp(key)}:\\s*(#[0-9a-fA-F]{3,8})\\b`,
      "m",
    ).exec(source)
    if (match) colors[key] = match[1]
  }
}

/* ------------------------------- references ------------------------------- */

const PATH = "[A-Za-z][\\w-]*(?:\\.[\\w-]+)+"
const WHOLE_REF = new RegExp(`^\\{(${PATH})\\}$`)
const EMBEDDED_REF = new RegExp(`\\{(${PATH})\\}`, "g")
const MAX_DEPTH = 8

/** `{colors.primary}` left unquoted parses as a one-key flow map. */
function flowRef(value: Record<string, unknown>): string | undefined {
  const keys = Object.keys(value)
  if (keys.length !== 1 || value[keys[0]!] !== null) return
  return new RegExp(`^${PATH}$`).test(keys[0]!) ? keys[0] : undefined
}

function resolver(root: Record<string, unknown>, warnings: Set<string>) {
  const lookup = (path: string) =>
    path
      .split(".")
      .reduce<unknown>(
        (node, key) =>
          isRecord(node) && Object.hasOwn(node, key) ? node[key] : undefined,
        root,
      )

  function follow(path: string, literal: string, stack: string[]): unknown {
    const node = lookup(path)
    if (
      node === undefined ||
      node === null ||
      stack.length >= MAX_DEPTH ||
      stack.includes(path)
    ) {
      warnings.add(`unresolved reference {${path}}`)
      return literal
    }
    return resolve(node, [...stack, path])
  }

  function resolve(value: unknown, stack: string[] = []): unknown {
    if (typeof value === "string") {
      const whole = WHOLE_REF.exec(value.trim())
      if (whole) return follow(whole[1]!, value, stack)
      return value.replace(EMBEDDED_REF, (literal, path: string) => {
        const resolved = follow(path, literal, stack)
        if (typeof resolved === "string" || typeof resolved === "number")
          return String(resolved)
        warnings.add(`unresolved reference {${path}}`)
        return literal
      })
    }
    if (Array.isArray(value)) return value.map((item) => resolve(item, stack))
    if (isRecord(value)) {
      const ref = flowRef(value)
      if (ref) return follow(ref, `{${ref}}`, stack)
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, resolve(item, stack)]),
      )
    }
    return value
  }

  return resolve
}

/* -------------------------------- sections -------------------------------- */

const normalizeHeading = (text: string) =>
  text
    .replace(/^\d+\.\s*/, "")
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .trim()

function splitBody(body: string, warnings: string[]) {
  const sections: ParsedDesignMd["sections"] = {}
  const headings: Heading[] = []
  const prose: string[] = []
  let h1: string | undefined
  let current: SectionName | undefined
  let currentLines: string[] | undefined
  let fenced = false

  const close = () => {
    if (current && current !== "ignored" && currentLines)
      sections[current] = currentLines.join("\n")
  }

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    const h2 = !fenced && /^## (.+)$/.exec(line)
    if (h2) {
      close()
      const name = normalizeHeading(h2[1]!)
      const canonical = SECTION_ALIASES[name]
      currentLines = undefined
      current = canonical
      if (canonical && canonical !== "ignored") {
        if (sections[canonical] !== undefined) {
          warnings.push(`duplicate section '${h2[1]!.trim()}' — used the first`)
          current = undefined
        } else currentLines = []
      }
      headings.push({ level: 2, text: h2[1]!.trim(), section: canonical })
      if (canonical !== "ignored") prose.push(line)
      continue
    }
    const h3 = !fenced && /^### (.+)$/.exec(line)
    if (h3) headings.push({ level: 3, text: h3[1]!.trim(), section: current })
    const title = !fenced && /^# (.+)$/.exec(line)
    if (title && h1 === undefined) h1 = title[1]!.trim()
    currentLines?.push(line)
    if (current !== "ignored") prose.push(line)
  }
  close()
  return { sections, headings, prose: prose.join("\n"), h1 }
}

/* --------------------------------- parse --------------------------------- */

export async function parseDesignMd(input: string): Promise<ParsedDesignMd> {
  const warnings: string[] = []
  const text = input.replace(/^﻿/, "").replace(/\r\n?/g, "\n")
  if (new TextEncoder().encode(text).length > MAX_BYTES)
    return {
      sections: {},
      prose: "",
      headings: [],
      warnings: ["File too large"],
    }

  let body = text
  let raw: Record<string, unknown> | undefined
  let source = ""
  if (text.startsWith("---\n")) {
    const lines = text.split("\n")
    const end = lines.indexOf("---", 1)
    if (end > 0) {
      source = lines.slice(1, end).join("\n")
      body = lines.slice(end + 1).join("\n")
      raw = await parseYaml(source, warnings)
    }
  }

  let tokens: Record<string, unknown> | undefined
  if (raw) {
    recoverHexes(raw.colors, source)
    const unresolved = new Set<string>()
    tokens = resolver(raw, unresolved)(raw) as Record<string, unknown>
    warnings.push(...unresolved)
  }

  const { sections, headings, prose, h1 } = splitBody(body, warnings)
  const name = tokens?.name
  return {
    tokens,
    raw,
    title: typeof name === "string" && name.trim() ? name : h1,
    sections,
    prose,
    headings,
    warnings,
  }
}

/* ------------------------------ prose fallback ---------------------------- */

const PROSE_COLOR =
  /^\s*[-*]\s+\*\*(.+?)\*\*\s*\(\s*`?(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|oklch\([^)]*\))`?[^)]*\)\s*[:—–-]\s*(.*)$/

/** `- **Cream** (`#f7f4ed`): Page background…` bullets, by kebab name. */
export function proseColors(
  section: string,
): { name: string; value: string; note: string }[] {
  const found: { name: string; value: string; note: string }[] = []
  for (const line of section.split("\n")) {
    const match = PROSE_COLOR.exec(line)
    if (!match) continue
    const name = kebab(match[1]!)
    if (name && !found.some((entry) => entry.name === name))
      found.push({ name, value: match[2]!, note: match[3]! })
  }
  return found
}

/** What each `{colors.x}` bullet says about its token. */
export function colorNotes(section: string): Map<string, string> {
  const notes = new Map<string, string>()
  for (const line of section.split("\n")) {
    const match =
      /^\s*[-*]\s+.*?\{colors\.([\w-]+)\}[^)]*\)\s*[:—–-]?\s*(.*)$/.exec(line)
    if (match && !notes.has(match[1]!.toLowerCase()))
      notes.set(match[1]!.toLowerCase(), match[2]!)
  }
  return notes
}

export type FontRole = "body" | "heading" | "mono"

const PROSE_FONT =
  /\*\*(Primary|Display|Heading|Headline|Body|Text|Mono(?:space)?|Code)\*\*\s*:\s*`([^`]+)`/g

const FONT_ROLE: Record<string, FontRole> = {
  primary: "body",
  body: "body",
  text: "body",
  display: "heading",
  heading: "heading",
  headline: "heading",
  mono: "mono",
  monospace: "mono",
  code: "mono",
}

/** `**Primary**: `Inter`` lines, first per role. */
export function proseFonts(section: string): Partial<Record<FontRole, string>> {
  const fonts: Partial<Record<FontRole, string>> = {}
  for (const match of section.matchAll(PROSE_FONT)) {
    const role = FONT_ROLE[match[1]!.toLowerCase()]!
    fonts[role] ??= match[2]!
  }
  return fonts
}
