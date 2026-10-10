/* What the chapters share: the report, the file's tokens and components,
   and the key families components are matched by. */

import { WHISPER_LINE } from "@dotui/colors"
import type { Oklch } from "@dotui/colors"

import type { StudioStateInput } from "../axes"
import type {
  DesignMdImport,
  ImportCategory,
  ImportItem,
  ImportStatus,
} from "./index"
import { color, colorNotes, isRecord, proseColors } from "./parse"
import type { ParsedColor, ParsedDesignMd } from "./parse"

export type Mode = "light" | "dark"
export type State = Partial<StudioStateInput>

/* --------------------------------- context -------------------------------- */

export interface Ctx {
  doc: ParsedDesignMd
  state: State
  report: DesignMdImport["report"]
  warnings: string[]
  seen: Set<string>
}

export function add(
  ctx: Ctx,
  status: ImportStatus,
  category: ImportCategory,
  item: Omit<ImportItem, "category">,
) {
  if (ctx.seen.has(item.id)) return
  ctx.seen.add(item.id)
  ctx.report[status].push({ category, ...item })
}

export const statusOf = (exact: boolean): ImportStatus =>
  exact ? "mapped" : "approximated"

export const round = (value: number, step: number) =>
  Math.round(value / step) * step
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
export const fmt = (value: number) => String(Number(value.toFixed(2)))
export const px = (value: number) => `${fmt(value)}px`

export const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/* ------------------------------ the file's data --------------------------- */

export interface ColorToken {
  name: string
  key: string
  value: unknown
  color?: ParsedColor
  note?: string
}

export interface Component {
  key: string
  props: Record<string, unknown>
  raw: Record<string, unknown>
}

export const STATE_SUFFIX =
  /-(hover|hovered|pressed|press|active|focus|focused|disabled|selected|visited|open|checked)$/
export const GRADIENT = /gradient/i

const INPUT_KEY = [
  /^(text-)?input$/,
  /^form-input/,
  /text-field/,
  /search-(input|field)/,
  /^select$/,
]
const CARD_KEY = /card|tile/
const NOT_CARD =
  /mockup|screenshot|illustration|hero|logo|image|avatar|badge|banner|band/
const SURFACE_KEY =
  /^(popover|menu|dropdown|tooltip|command|combobox-(list|popover)|select-(menu|content|popover))/
const PANEL_KEY = /modal|dialog|sheet|drawer/
export const SIZE_SUFFIX = /-(xs|sm|small|lg|large|xl)$/

const isInput = (key: string) => INPUT_KEY.some((re) => re.test(key))
const isCard = (key: string) => CARD_KEY.test(key) && !NOT_CARD.test(key)

function flatten(
  record: Record<string, unknown>,
  prefix = "",
): [string, unknown][] {
  return Object.entries(record).flatMap(([key, value]) =>
    isRecord(value)
      ? flatten(value, `${prefix}${key}-`)
      : [[`${prefix}${key}`, value] as [string, unknown]],
  )
}

export function readColors(ctx: Ctx): {
  tokens: ColorToken[]
  source: DesignMdImport["source"]
} {
  const { doc } = ctx
  const colors = doc.tokens?.colors
  if (isRecord(colors) && Object.keys(colors).length > 0) {
    const notes = colorNotes(doc.sections.colors ?? "")
    const tokens = flatten(colors).map(([name, value]) => {
      const parsed = color(value)
      const looksGradient =
        GRADIENT.test(name) ||
        (typeof value === "string" && GRADIENT.test(value))
      if (!parsed && !looksGradient) ctx.warnings.push(`invalid color ${name}`)
      return {
        name,
        key: name.toLowerCase(),
        value,
        color: parsed,
        note: notes.get(name.toLowerCase()),
      }
    })
    return { tokens, source: "frontmatter" }
  }
  const prose = proseColors(doc.sections.colors ?? doc.prose)
  if (prose.length === 0) return { tokens: [], source: "none" }
  ctx.warnings.push(
    "No frontmatter — read colors, fonts and elevation from prose only.",
  )
  return {
    tokens: prose.map(({ name, value, note }) => ({
      name,
      key: name,
      value,
      color: color(value),
      note,
    })),
    source: "prose",
  }
}

export function readComponents(doc: ParsedDesignMd): Component[] {
  const resolved = doc.tokens?.components
  const raw = doc.raw?.components
  if (!isRecord(resolved)) return []
  return Object.entries(resolved)
    .filter((entry): entry is [string, Record<string, unknown>] =>
      isRecord(entry[1]),
    )
    .map(([key, props]) => ({
      key: key.toLowerCase(),
      props,
      raw: isRecord(raw) && isRecord(raw[key]) ? raw[key] : {},
    }))
}

export const opaque = (
  c?: ParsedColor,
): c is ParsedColor & { oklch: Oklch; hex: string } =>
  !!c?.oklch && c.alpha >= 1
export const chromatic = (c?: ParsedColor) =>
  opaque(c) && c.oklch.c >= WHISPER_LINE

/** The primary button's key, by the naming the corpus uses. */
export function buttonKey(components: Component[]): string | undefined {
  const keys = components.map((c) => c.key).filter((k) => !STATE_SUFFIX.test(k))
  return (
    keys.find((k) =>
      /^(button|btn)(-primary)?(-(pill|md|default|base))?$/.test(k),
    ) ??
    keys.find((k) => /^button-primary/.test(k)) ??
    keys.find((k) => k === "primary-button") ??
    keys.find((k) => k === "cta-primary")
  )
}

export const refToken = (value: unknown) =>
  typeof value === "string"
    ? /^\{colors\.([\w-]+)\}$/.exec(value.trim())?.[1]?.toLowerCase()
    : undefined

export const hasBorder = (props: Record<string, unknown>) =>
  ["border", "borderColor"].some(
    (key) =>
      key in props && !/^(none|0|0px)$/i.test(String(props[key] ?? "").trim()),
  )

export interface Families {
  button: Component[]
  input: Component[]
  card: Component[]
  surface: Component[]
  panel: Component[]
}

export function families(components: Component[]): Families {
  const nonState = components.filter((c) => !STATE_SUFFIX.test(c.key))
  const btn = buttonKey(components)
  const sized = btn
    ? new RegExp(
        `^${btn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(xs|sm|small|md|lg|large|xl|pill|default|base)$`,
      )
    : undefined
  return {
    button: nonState.filter((c) => c.key === btn || sized?.test(c.key)),
    input: nonState.filter((c) => isInput(c.key)),
    card: nonState.filter((c) => isCard(c.key)),
    surface: nonState.filter((c) => SURFACE_KEY.test(c.key)),
    panel: nonState.filter((c) => PANEL_KEY.test(c.key)),
  }
}
