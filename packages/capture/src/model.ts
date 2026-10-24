/* The system behind a product, inferred from its census: radius rungs, type
   styles, control heights, the spacing grid, the neutral ramp and accent
   steps in OKLCH, which custom properties feed which roles, and the looks
   per role. `refs/<id>/model.json` keeps it; `summarize` reads it as a
   DESIGN.md-style page, and `diffModels` says what moved between two runs
   (drift). */

import { toOklch } from "@dotui/colors"

import {
  type Extra,
  type Inventory,
  type Look,
  lookKeys,
  sameLook,
  type Values,
} from "./census"
import type { Prop } from "./probe"

type Mode = "light" | "dark"

export interface Count {
  px: number
  count: number
}

export interface Swatch {
  color: string
  l: number
  c: number
  h: number
  count: number
  /** "<group> <prop>", most used first. */
  uses: string[]
}

export interface TypeStyle {
  fontSize: string
  fontWeight: string
  lineHeight?: string
  letterSpacing?: string
  fontFamily?: string
  textTransform?: string
  count: number
  groups: string[]
}

export interface ModelLook {
  id: string
  count: number
  /** Indexes into the model's pages. */
  pages: number[]
  light?: Values
  dark?: Values
  states?: Look["states"]
}

export interface Model {
  probe: string
  pages: { key: string; modes: Mode[] }[]
  /** Drawn corner radii apart from pills, most used first. */
  radius: (Count & { groups: string[] })[]
  /** Groups whose looks round the whole end of their box. */
  pills: string[]
  type: TypeStyle[]
  /** Control heights per group. */
  heights: Record<string, Count[]>
  spacing: { grid: number; steps: Count[] }
  colors: Partial<
    Record<
      Mode,
      {
        neutrals: Swatch[]
        accents: { hue: number; count: number; steps: Swatch[] }[]
        neutralHue?: number
      }
    >
  >
  /** Custom properties by how many elements they feed. */
  tokens: {
    name: string
    count: number
    feeds: string[]
    light?: string
    dark?: string
  }[]
  /** The looks of each group, most used first. */
  inventory: Record<string, ModelLook[]>
}

const px = (value: string | undefined) => {
  const n = Number.parseFloat(value ?? "")
  return Number.isFinite(n) ? n : undefined
}
const roleOf = (group: string) => group.split(/[.@]/)[0] ?? group
const BOXLESS = new Set([
  "text",
  "heading",
  "paragraph",
  "label",
  "code",
  "time",
  "blockquote",
  "icon",
  "img",
])
const CONTROL_GROUPS = new Set([
  "button",
  "link",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "textbox",
  "searchbox",
  "combobox",
  "switch",
  "checkbox",
  "radio",
  "spinbutton",
  "badge",
  "kbd",
  "avatar",
  "row",
])

/** Values within `within` of each other merge into their count-weighted
 *  mean, to the half pixel; most used first. */
function clusterCounts(values: Count[], within = 1): Count[] {
  const sorted = [...values].sort((a, b) => a.px - b.px)
  const merged: { sum: number; count: number; max: number }[] = []
  for (const { px, count } of sorted) {
    const last = merged.at(-1)
    if (last && px - last.max <= within) {
      last.sum += px * count
      last.count += count
      last.max = px
    } else merged.push({ sum: px * count, count, max: px })
  }
  return merged
    .map(({ sum, count }) => ({ px: Math.round((sum / count) * 2) / 2, count }))
    .sort((a, b) => b.count - a.count || a.px - b.px)
}

const top = <T>(map: Map<T, number>, n: number) =>
  [...map]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key)

const add = <T>(map: Map<T, number>, key: T, count: number) =>
  map.set(key, (map.get(key) ?? 0) + count)

function radii(looks: Look[]) {
  const counts = new Map<number, number>()
  const groups = new Map<number, Map<string, number>>()
  const pills = new Map<string, number>()
  for (const look of looks) {
    if (BOXLESS.has(roleOf(look.group))) continue
    for (const values of [look.light, look.dark]) {
      const radius = px(values?.borderRadius)
      if (!values || !radius) continue
      // A percentage has no px to rank: 50% rounds any box into a pill.
      if (values.borderRadius?.endsWith("%")) {
        if (radius >= 50) add(pills, look.group, look.count)
        continue
      }
      const height = px(values.height)
      if (
        radius >= 999 ||
        (height !== undefined && radius >= height / 2 - 0.5)
      ) {
        add(pills, look.group, look.count)
        continue
      }
      add(counts, radius, look.count)
      const byGroup = groups.get(radius) ?? new Map<string, number>()
      add(byGroup, look.group, look.count)
      groups.set(radius, byGroup)
      break
    }
  }
  const rungs = clusterCounts([...counts].map(([px, count]) => ({ px, count })))
  return {
    radius: rungs.slice(0, 10).map((rung) => {
      const near = new Map<string, number>()
      for (const [radius, byGroup] of groups)
        if (Math.abs(radius - rung.px) <= 1)
          for (const [group, n] of byGroup) add(near, group, n)
      return { ...rung, groups: top(near, 6) }
    }),
    pills: top(pills, 12),
  }
}

function typeStyles(looks: Look[]): TypeStyle[] {
  const styles = new Map<string, TypeStyle & { byGroup: Map<string, number> }>()
  for (const look of looks) {
    const values = look.light ?? look.dark
    if (!values?.fontSize || !values.fontWeight) continue
    if (
      ["icon", "img", "page", "separator", "avatar"].includes(
        roleOf(look.group),
      )
    )
      continue
    const style = {
      fontSize: values.fontSize,
      fontWeight: values.fontWeight,
      ...(values.lineHeight ? { lineHeight: values.lineHeight } : {}),
      ...(values.letterSpacing && values.letterSpacing !== "normal"
        ? { letterSpacing: values.letterSpacing }
        : {}),
      ...(values.fontFamily
        ? { fontFamily: values.fontFamily.replace(/["']/g, "") }
        : {}),
      ...(values.textTransform ? { textTransform: values.textTransform } : {}),
    }
    const key = JSON.stringify(style)
    const entry = styles.get(key) ?? {
      ...style,
      count: 0,
      groups: [],
      byGroup: new Map(),
    }
    entry.count += look.count
    add(entry.byGroup, look.group, look.count)
    styles.set(key, entry)
  }
  return [...styles.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 24)
    .map(({ byGroup, ...style }) => ({ ...style, groups: top(byGroup, 6) }))
}

function heights(looks: Look[]) {
  const byGroup = new Map<string, Count[]>()
  for (const look of looks) {
    if (!CONTROL_GROUPS.has(look.group)) continue
    const height = px((look.light ?? look.dark)?.height)
    if (height)
      byGroup.set(look.group, [
        ...(byGroup.get(look.group) ?? []),
        { px: height, count: look.count },
      ])
  }
  return Object.fromEntries(
    [...byGroup]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, counts]) => [group, clusterCounts(counts).slice(0, 6)]),
  )
}

const SPACING: (Prop | Extra)[] = [
  "paddingInline",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "gap",
]

function spacing(looks: Look[]) {
  const counts = new Map<number, number>()
  for (const look of looks) {
    const values = look.light ?? look.dark
    for (const key of SPACING)
      for (const part of (values?.[key] ?? "").split(" ")) {
        const value = Math.round((px(part) ?? 0) * 2) / 2
        if (value > 0 && value <= 96) add(counts, value, look.count)
      }
  }
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0)
  const share = (grid: number) =>
    [...counts]
      .filter(
        ([value]) =>
          Math.abs(value / grid - Math.round(value / grid)) * grid <= 0.5,
      )
      .reduce((sum, [, n]) => sum + n, 0) / (total || 1)
  const grid = [8, 6, 5, 4, 3, 2].find((g) => share(g) >= 0.8) ?? 1
  return {
    grid,
    steps: [...counts]
      .map(([px, count]) => ({ px, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16)
      .sort((a, b) => a.px - b.px),
  }
}

const COLOR_PROPS: (Prop | Extra)[] = [
  "backgroundColor",
  "color",
  "edge",
  "ring",
]

const colorOf = (prop: string, value: string) =>
  prop === "edge" || prop === "ring"
    ? /(?:rgba?|oklch|oklab|lab|lch|color|hsla?)\([^)]*\)|#[0-9a-f]{3,8}/i.exec(
        value,
      )?.[0]
    : value

/** OKLab distance, as the diff measures colors. */
const deltaE = (
  a: { l: number; c: number; h: number },
  b: { l: number; c: number; h: number },
) => {
  const rad = (h: number) => (h * Math.PI) / 180
  return Math.hypot(
    a.l - b.l,
    a.c * Math.cos(rad(a.h)) - b.c * Math.cos(rad(b.h)),
    a.c * Math.sin(rad(a.h)) - b.c * Math.sin(rad(b.h)),
  )
}

function palette(looks: Look[], mode: Mode) {
  type Entry = {
    color: string
    l: number
    c: number
    h: number
    count: number
    uses: Map<string, number>
  }
  const entries: Entry[] = []
  for (const look of looks) {
    const values = look[mode]
    if (!values) continue
    for (const prop of COLOR_PROPS) {
      if (prop === "backgroundColor" && BOXLESS.has(roleOf(look.group)))
        continue
      const value = values[prop]
      const color = value && value !== "none" ? colorOf(prop, value) : undefined
      if (!color) continue
      let oklch: { l: number; c: number; h: number }
      try {
        oklch = toOklch(color)
      } catch {
        continue
      }
      const near = entries.find((entry) => deltaE(entry, oklch) <= 0.01)
      const entry = near ?? {
        color,
        ...oklch,
        h: Number.isFinite(oklch.h) ? oklch.h : 0,
        count: 0,
        uses: new Map(),
      }
      if (!near) entries.push(entry)
      entry.count += look.count
      add(entry.uses, `${look.group} ${prop}`, look.count)
    }
  }
  const swatch = ({ uses, ...entry }: Entry): Swatch => ({
    ...entry,
    l: Math.round(entry.l * 1000) / 1000,
    c: Math.round(entry.c * 1000) / 1000,
    h: Math.round(entry.h),
    uses: top(uses, 5),
  })
  // Grays tinted up to Primer's muted ink (C 0.022) count as neutral.
  const neutrals = entries
    .filter((entry) => entry.c < 0.03)
    .sort((a, b) => b.l - a.l)
  const tinted = neutrals.filter((entry) => entry.c > 0.004)
  const weight = tinted.reduce((sum, entry) => sum + entry.count, 0)
  const neutralHue = weight
    ? Math.round(
        (Math.atan2(
          tinted.reduce(
            (sum, e) => sum + Math.sin((e.h * Math.PI) / 180) * e.count,
            0,
          ),
          tinted.reduce(
            (sum, e) => sum + Math.cos((e.h * Math.PI) / 180) * e.count,
            0,
          ),
        ) *
          180) /
          Math.PI +
          360,
      ) % 360
    : undefined
  const hues: { hue: number; count: number; steps: Entry[] }[] = []
  for (const entry of entries
    .filter((e) => e.c >= 0.03)
    .sort((a, b) => b.count - a.count)) {
    const family = hues.find(
      (f) => Math.abs(((entry.h - f.hue + 540) % 360) - 180) <= 20,
    )
    if (family) {
      family.steps.push(entry)
      family.count += entry.count
    } else
      hues.push({
        hue: Math.round(entry.h),
        count: entry.count,
        steps: [entry],
      })
  }
  return {
    neutrals: neutrals.slice(0, 16).map(swatch),
    accents: hues
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((family) => ({
        ...family,
        steps: family.steps
          .sort((a, b) => b.l - a.l)
          .slice(0, 10)
          .map(swatch),
      })),
    ...(neutralHue !== undefined ? { neutralHue } : {}),
  }
}

function tokens(inventory: Inventory) {
  const counts = new Map<string, number>()
  const feeds = new Map<string, Map<string, number>>()
  for (const look of inventory.looks)
    for (const [prop, name] of Object.entries(look.vars ?? {})) {
      if (!name) continue
      add(counts, name, look.count)
      const byUse = feeds.get(name) ?? new Map<string, number>()
      add(byUse, `${look.group} ${prop}`, look.count)
      feeds.set(name, byUse)
    }
  return top(counts, 60).map((name) => ({
    name,
    count: counts.get(name) ?? 0,
    feeds: top(feeds.get(name) ?? new Map(), 8),
    ...(inventory.tokens.light?.[name]
      ? { light: inventory.tokens.light[name] }
      : {}),
    ...(inventory.tokens.dark?.[name]
      ? { dark: inventory.tokens.dark[name] }
      : {}),
  }))
}

/* The values a look is told apart by, plus its spacing. */
const keyValues = (group: string, values: Values | undefined) =>
  values &&
  (Object.fromEntries(
    [...lookKeys(roleOf(group)), ...SPACING].flatMap((key) =>
      values[key] ? [[key, values[key]]] : [],
    ),
  ) as Values)

function inventoryOf(looks: Look[], pages: string[]) {
  const groups = new Map<string, Look[]>()
  for (const look of looks)
    groups.set(look.group, [...(groups.get(look.group) ?? []), look])
  return Object.fromEntries(
    [...groups]
      .filter(
        ([, list]) => list.reduce((sum, look) => sum + look.count, 0) >= 2,
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, list]) => [
        group,
        list
          .slice(0, 8)
          .filter((look, i) => i === 0 || look.count >= 2)
          .map((look): ModelLook => {
            const light = keyValues(group, look.light)
            const dark = keyValues(group, look.dark)
            return {
              id: look.id,
              count: look.count,
              pages: look.pages.map((key) => pages.indexOf(key)),
              ...(light ? { light } : {}),
              ...(dark ? { dark } : {}),
              ...(look.states ? { states: look.states } : {}),
            }
          }),
      ]),
  )
}

export function buildModel(inventory: Inventory): Model {
  const { looks } = inventory
  const modes = [...new Set(inventory.pages.flatMap((page) => page.modes))]
  return {
    probe: inventory.probe,
    pages: inventory.pages.map(({ key, modes }) => ({ key, modes })),
    ...radii(looks),
    type: typeStyles(looks),
    heights: heights(looks),
    spacing: spacing(looks),
    colors: Object.fromEntries(
      modes.map((mode) => [mode, palette(looks, mode)]),
    ),
    tokens: tokens(inventory),
    inventory: inventoryOf(
      looks,
      inventory.pages.map((page) => page.key),
    ),
  }
}

/** JSON with one entry per line down to `depth` levels and every deeper
 *  value on one line: model.json keeps one look per line, so drift reads as
 *  a diff of looks. */
export function jsonLines(value: unknown, depth = 3, indent = ""): string {
  if (depth === 0 || value === null || typeof value !== "object")
    return JSON.stringify(value)
  const entries: [string | undefined, unknown][] = Array.isArray(value)
    ? value.map((item) => [undefined, item])
    : Object.entries(value)
  if (
    !entries.length ||
    entries.every(([, item]) => item === null || typeof item !== "object")
  )
    return JSON.stringify(value)
  const inner = `${indent}  `
  const body = entries
    .map(
      ([key, item]) =>
        `${inner}${key === undefined ? "" : `${JSON.stringify(key)}: `}${jsonLines(item, depth - 1, inner)}`,
    )
    .join(",\n")
  return Array.isArray(value)
    ? `[\n${body}\n${indent}]`
    : `{\n${body}\n${indent}}`
}

const list = (counts: Count[]) =>
  counts.map((c) => `${c.px}px (${c.count})`).join(", ")

/** The model as a page to read: the system first, then the looks of every
 *  control. */
export function summarize(model: Model): string {
  const lines = [
    `# Model (${model.pages.length} pages, probe ${model.probe})`,
    "",
    `**Radius rungs:** ${model.radius.map((r) => `${r.px}px ×${r.count} (${r.groups.slice(0, 3).join(", ")})`).join("; ") || "none"}. Pills: ${model.pills.join(", ") || "none"}.`,
    "",
    `**Spacing:** a ${model.spacing.grid}px grid; ${list(model.spacing.steps)}.`,
    "",
    "**Control heights:**",
    ...Object.entries(model.heights).map(
      ([group, counts]) => `- ${group}: ${list(counts)}`,
    ),
    "",
    "**Type styles:**",
    "",
    "| size | weight | line | tracking | family | case | count | used by |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...model.type
      .slice(0, 14)
      .map(
        (t) =>
          `| ${t.fontSize} | ${t.fontWeight} | ${t.lineHeight ?? ""} | ${t.letterSpacing ?? ""} | ${t.fontFamily ?? ""} | ${t.textTransform ?? ""} | ${t.count} | ${t.groups.join(", ")} |`,
      ),
  ]
  for (const [mode, colors] of Object.entries(model.colors)) {
    lines.push(
      "",
      `**Neutrals, ${mode}${colors.neutralHue !== undefined ? ` (tint hue ${colors.neutralHue})` : ""}:** ${colors.neutrals.map((s) => `L${s.l} ×${s.count}`).join(", ")}`,
      "",
      `**Accents, ${mode}:** ${colors.accents.map((a) => `hue ${a.hue} ×${a.count} (${a.steps.map((s) => `L${s.l} C${s.c}`).join(", ")})`).join("; ") || "none"}`,
    )
  }
  if (model.tokens.length)
    lines.push(
      "",
      "**Custom properties, most used:**",
      ...model.tokens
        .slice(0, 15)
        .map(
          (t) =>
            `- \`${t.name}\` ×${t.count}: ${t.feeds.slice(0, 4).join(", ")}`,
        ),
    )
  lines.push("", "**Looks per control:**")
  for (const [group, looks] of Object.entries(model.inventory)) {
    if (!CONTROL_GROUPS.has(group)) continue
    lines.push(
      `- ${group}: ${looks.length} look${looks.length === 1 ? "" : "s"}, used ${looks.map((l) => l.count).join(", ")} times`,
    )
  }
  return lines.join("\n")
}

const describe = (values: Values | undefined) =>
  Object.entries(values ?? {})
    .map(([key, value]) => `${key} ${value}`)
    .join(", ")

/** What moved between two models, on the pages both read: looks gone or
 *  new, by group and mode. Pages only one side read are left out, so a
 *  headless re-run compares fairly against a model that also holds
 *  signed-in pages. */
export function diffModels(before: Model, after: Model): string[] {
  const shared = new Set(
    before.pages
      .map((p) => p.key)
      .filter((key) => after.pages.some((p) => p.key === key)),
  )
  if (!shared.size) return ["No page in common: nothing to compare."]
  const onShared = (model: Model) => (look: ModelLook) =>
    look.pages.some((i) => shared.has(model.pages[i]?.key ?? ""))
  const changes: string[] = []
  const groups = new Set([
    ...Object.keys(before.inventory),
    ...Object.keys(after.inventory),
  ])
  for (const group of [...groups].sort()) {
    const keys = lookKeys(roleOf(group))
    for (const mode of ["light", "dark"] as const) {
      const was = (before.inventory[group] ?? []).filter(
        (l) => l[mode] && onShared(before)(l),
      )
      const now = (after.inventory[group] ?? []).filter(
        (l) => l[mode] && onShared(after)(l),
      )
      const match = (a: ModelLook, list: ModelLook[]) =>
        list.some((b) => sameLook(keys, a[mode] ?? {}, b[mode] ?? {}))
      for (const look of was)
        if (!match(look, now))
          changes.push(`${mode} ${group}: gone, ${describe(look[mode])}`)
      for (const look of now)
        if (!match(look, was))
          changes.push(
            `${mode} ${group}: new (×${look.count}), ${describe(look[mode])}`,
          )
    }
  }
  return changes
}
