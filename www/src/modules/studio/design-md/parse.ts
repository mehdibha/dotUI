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
  section?: SectionName
}

export interface ParsedDesignMd {
  tokens?: Record<string, unknown>
  // The frontmatter as written, for which token a reference names.
  raw?: Record<string, unknown>
  title?: string
  sections: Partial<Record<Exclude<SectionName, "ignored">, string>>
  // The body without its ignored sections.
  prose: string
  headings: Heading[]
  warnings: string[]
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

function hash(text: string) {
  let h = 0x811c9dc5
  for (const ch of text) h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 0x01000193)
  return (h >>> 0).toString(36)
}

export function kebab(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  // Non-ASCII names keep a hash, so distinct names keep distinct ids.
  return /[^ -~]/.test(name)
    ? [base, hash(name)].filter(Boolean).join("-")
    : base
}

export const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const LENGTH = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em)?$/i

// rem and em count 16px; a bare number is px.
export function dim(value: unknown): number | undefined {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : undefined
  if (typeof value !== "string") return
  const match = LENGTH.exec(value.trim())
  if (!match) return
  const n = Number(match[1])
  if (!Number.isFinite(n)) return
  const unit = match[2]?.toLowerCase()
  return unit === "rem" || unit === "em" ? n * 16 : n
}

export interface Box {
  top: number
  right: number
  bottom: number
  left: number
}

export function box(value: unknown): Box | undefined {
  if (typeof value === "number") return box(String(value))
  if (typeof value !== "string") return
  const parts = value.trim().split(/\s+/).map(dim)
  if (parts.length > 4 || !parts.every((p): p is number => p !== undefined))
    return
  const [top = 0, right = top, bottom = top, left = right] = parts
  return { top, right, bottom, left }
}

export interface ParsedColor {
  oklch?: Oklch
  alpha: number
  hex?: string
}

const fraction = (text: string) =>
  text.endsWith("%") ? Number(text.slice(0, -1)) / 100 : Number(text)

function alphaOf(css: string): number {
  const hex = /^#(?:[0-9a-f]{3}([0-9a-f])|[0-9a-f]{6}([0-9a-f]{2}))$/i.exec(css)
  if (hex) return parseInt(hex[1]?.repeat(2) ?? hex[2] ?? "ff", 16) / 255
  const slash = /\/\s*([\d.]+%?)\s*\)$/.exec(css)?.[1]
  if (slash) return fraction(slash)
  const parts = /^(?:rgba?|hsla?)\(([^)]*)\)$/i.exec(css)?.[1]?.split(",")
  const legacy = parts?.length === 4 ? parts[3] : undefined
  return legacy ? fraction(legacy.trim()) : 1
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
    if (!lengths.every((l): l is number => l !== undefined)) continue
    const [x = 0, y = 0, blur = 0, spread = 0] = lengths
    layers.push({
      x,
      y,
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

export function codeOrText(text: string): string[] {
  const spans = [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1] ?? "")
  return spans.length > 0 ? spans : [text]
}

export function median(values: number[]): number | undefined {
  if (values.length === 0) return
  const sorted = [...values].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  const upper = sorted[mid] ?? 0
  return sorted.length % 2 ? upper : ((sorted[mid - 1] ?? upper) + upper) / 2
}

// Table rows stay whole.
export function sentences(text: string): string[] {
  return text
    .split("\n")
    .flatMap((line) =>
      line.trim().startsWith("|") ? [line] : line.split(/(?<=[.!?])\s+/),
    )
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

const YAML_OPTIONS = {
  uniqueKeys: false,
  strict: false,
  logLevel: "error",
} as const

function topLevelBlocks(source: string) {
  const blocks: { key: string; text: string }[] = []
  for (const line of source.split("\n")) {
    const opens = /^[^\s#][^:]*:/.exec(line)
    const last = blocks.at(-1)
    if (opens) blocks.push({ key: opens[0].slice(0, -1), text: line })
    else if (last) last.text += `\n${line}`
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

// YAML reads an unquoted `#hex` as a comment; take it from the line.
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

const PATH = "[A-Za-z][\\w-]*(?:\\.[\\w-]+)+"
const WHOLE_REF = new RegExp(`^\\{(${PATH})\\}$`)
const EMBEDDED_REF = new RegExp(`\\{(${PATH})\\}`, "g")
const BARE_PATH = new RegExp(`^${PATH}$`)
const MAX_DEPTH = 8
// Fan-out refs copy subtrees; past this many nodes the rest stays literal.
const MAX_NODES = 50_000
export const REF_BUDGET_WARNING =
  "references expand too far — the rest left unresolved"

// `{colors.primary}` left unquoted parses as a one-key flow map.
function flowRef(value: Record<string, unknown>): string | undefined {
  const [key, ...rest] = Object.keys(value)
  if (key === undefined || rest.length > 0 || value[key] !== null) return
  return BARE_PATH.test(key) ? key : undefined
}

function resolver(root: Record<string, unknown>, warnings: Set<string>) {
  let nodes = 0
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
    if (++nodes > MAX_NODES) {
      warnings.add(REF_BUDGET_WARNING)
      return value
    }
    if (typeof value === "string") {
      const whole = WHOLE_REF.exec(value.trim())?.[1]
      if (whole) return follow(whole, value, stack)
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
    const h2: string | undefined = fenced
      ? undefined
      : /^## (.+)$/.exec(line)?.[1]?.trim()
    if (h2) {
      close()
      const canonical = SECTION_ALIASES[normalizeHeading(h2)]
      currentLines = undefined
      current = canonical
      if (canonical && canonical !== "ignored") {
        if (sections[canonical] !== undefined) {
          warnings.push(`duplicate section '${h2}' — used the first`)
          current = undefined
        } else currentLines = []
      }
      headings.push({ level: 2, text: h2, section: canonical })
      if (canonical !== "ignored") prose.push(line)
      continue
    }
    const h3 = fenced ? undefined : /^### (.+)$/.exec(line)?.[1]?.trim()
    if (h3) headings.push({ level: 3, text: h3, section: current })
    const title = fenced ? undefined : /^# (.+)$/.exec(line)?.[1]?.trim()
    if (title && h1 === undefined) h1 = title
    currentLines?.push(line)
    if (current !== "ignored") prose.push(line)
  }
  close()
  return { sections, headings, prose: prose.join("\n"), h1 }
}

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
    const resolved = resolver(raw, unresolved)(raw)
    tokens = isRecord(resolved) ? resolved : {}
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

const PROSE_COLOR =
  /^\s*[-*]\s+\*\*(.+?)\*\*\s*\(\s*`?(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|oklch\([^)]*\))`?[^)]*\)\s*[:—–-]\s*(.*)$/

export function proseColors(
  section: string,
): { name: string; value: string; note: string }[] {
  const found: { name: string; value: string; note: string }[] = []
  for (const line of section.split("\n")) {
    const [, label = "", value = "", note = ""] = PROSE_COLOR.exec(line) ?? []
    const name = kebab(label)
    if (name && !found.some((entry) => entry.name === name))
      found.push({ name, value, note })
  }
  return found
}

// What each `{colors.x}` bullet says about its token.
export function colorNotes(section: string): Map<string, string> {
  const notes = new Map<string, string>()
  for (const line of section.split("\n")) {
    const [, token, note = ""] =
      /^\s*[-*]\s+.*?\{colors\.([\w-]+)\}[^)]*\)\s*[:—–-]?\s*(.*)$/.exec(
        line,
      ) ?? []
    if (token && !notes.has(token.toLowerCase()))
      notes.set(token.toLowerCase(), note)
  }
  return notes
}

export type FontRole = "body" | "heading" | "mono"

// `**Label**: stack` lines, or `**Family** — description` in a list.
const FONT_LINE = /^\s*(?:(?:[-*]|\d+\.)\s+)?\*\*([^*]+?)\*\*:?\s*(.*)$/
const LABEL_ROLES: [FontRole, RegExp][] = [
  ["mono", /\b(mono(space)?|code|technical)\b/i],
  ["heading", /\b(display|headings?|headlines?|titles?|hero)\b/i],
  ["body", /\b(body|text|ui|primary|universal|paragraph|copy)\b/i],
]
const DESCRIPTION_ROLES: [FontRole, RegExp][] = [
  ["mono", /\bmono(space|spaced)?\b|\bcode\b/i],
  ["heading", /\b(display|headlines?|headings?)\b/i],
  ["body", /\b(body|UI)\b/],
]
const NOT_A_ROLE = /fallback|loading|cjk|script|icon|weight/i
const FALLBACK_PREFIX = /^(?:with )?fallbacks?\s*:\s*/i

const rolesIn = (text: string, table: [FontRole, RegExp][]) =>
  table.filter(([, re]) => re.test(text)).map(([role]) => role)

const looksLikeFamily = (entry: string) =>
  entry.length > 0 && entry.length <= 40 && entry.split(/\s+/).length <= 4

function stackOf(text: string): string[] {
  const head = text.split(/\s*[—–]\s|\.\s|\s-\s/)[0] ?? ""
  return head
    .replace(/`/g, "")
    .split(",")
    .map((entry) => entry.trim().replace(FALLBACK_PREFIX, "").trim())
    .filter(looksLikeFamily)
}

export function proseFonts(section: string): Partial<Record<FontRole, string>> {
  const fonts: Partial<Record<FontRole, string>> = {}
  for (const line of section.split("\n")) {
    const [, rawLabel = "", rest = ""] = FONT_LINE.exec(line) ?? []
    const label = rawLabel.replace(/:$/, "").trim()
    if (!label || NOT_A_ROLE.test(label) || !looksLikeFamily(label)) continue
    let roles = rolesIn(label, LABEL_ROLES)
    let stack: string[]
    if (roles.length > 0) {
      // A role label names its stack in code: **Body**: `Inter`.
      if (!rest.includes("`")) continue
      stack = stackOf(rest.replace(/^:\s*/, ""))
    } else {
      if (/[.!?]$/.test(label) || !/^\s*[(—–,-]/.test(rest)) continue
      roles = rolesIn(rest, DESCRIPTION_ROLES)
      const fallbacks = /fallbacks?\s*:\s*([^.—–]+)/i.exec(rest)?.[1] ?? ""
      stack = [label, ...stackOf(fallbacks)]
    }
    if (stack.length === 0) continue
    for (const role of roles) fonts[role] ??= stack.join(", ")
  }
  return fonts
}
