/* A Button variant's look, read off the registry's own classes: what it
   draws at rest. States, sizes and layout are left out; dark classes win
   in dark. */

import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import {
  BUTTON_SECONDARY,
  BUTTON_STYLES,
  BUTTON_VARIANTS,
  BUTTON_LINK_COLOR,
  BUTTON_LINK_UNDERLINE,
} from "@/registry/ui/button/styles"

import type { Variant } from "../axes/buttons"

export type Recipe = keyof typeof BUTTON_STYLES
export type SecondaryRecipe = keyof typeof BUTTON_SECONDARY

export interface LookProperty {
  label: string
  /** As the class writes it, `var(--color-x)` read as `x`. */
  value: string
  /** A CSS color for the swatch beside a color value. */
  color?: string
}

type Slice = { variants?: { variant?: Record<string, string> } }

const variantClasses = (slice: Slice | undefined, variant: string) =>
  slice?.variants?.variant?.[variant] ?? ""

/** Every class a variant draws with, under the recipes the system picks. */
export function classesOf(
  variant: Variant,
  params: Record<string, string>,
): string {
  const style = params.style as Recipe
  const secondary = params.secondary as SecondaryRecipe
  const own = BUTTON_VARIANTS[variant]
  switch (variant) {
    case "secondary":
      return `${own} ${variantClasses(BUTTON_SECONDARY[secondary], variant)}`
    case "link": {
      const color = BUTTON_LINK_COLOR[params.linkColor as "accent"] as Slice
      const line = BUTTON_LINK_UNDERLINE[params.linkUnderline as "always"]
      return `${own} ${variantClasses(color, variant)} ${variantClasses(line as Slice, variant)}`
    }
    case "quiet":
      return own
    default:
      return `${own} ${variantClasses(BUTTON_STYLES[style], variant)}`
  }
}

/** Splits `a:b:[x:y]` on the colons outside brackets. */
function parts(token: string) {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < token.length; i++) {
    const c = token[i]
    if (c === "[" || c === "(") depth++
    else if (c === "]" || c === ")") depth--
    else if (c === ":" && depth === 0) {
      out.push(token.slice(start, i))
      start = i + 1
    }
  }
  out.push(token.slice(start))
  return out
}

/** Splits on the commas outside parentheses. */
function layers(value: string) {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const c = value[i]
    if (c === "(") depth++
    else if (c === ")") depth--
    else if (c === "," && depth === 0) {
      out.push(value.slice(start, i))
      start = i + 1
    }
  }
  out.push(value.slice(start))
  return out.map((layer) => layer.trim())
}

const arbitrary = (raw: string) => raw.replaceAll("_", " ")

/** A color utility's value as CSS: a token, `token/alpha`, `(--var)` or `[css]`. */
function colorCss(value: string, vars: Map<string, string>): string {
  if (value.startsWith("[")) return arbitrary(value.slice(1, -1))
  if (value.startsWith("(")) {
    const name = value.slice(1, -1)
    return vars.get(name) ?? `var(${name})`
  }
  const [token = "", alpha] = value.split("/")
  const base =
    token === "white"
      ? "#fff"
      : token === "black"
        ? "#000"
        : `var(--color-${token})`
  return alpha ? `color-mix(in oklab, ${base} ${alpha}%, transparent)` : base
}

/** CSS shown to a person: `var(--color-x)` reads as `x`. */
const readable = (css: string) =>
  css
    .replace(/var\(--color-([\w-]+)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()

const NOT_COLORS =
  /^(xs|sm|base|lg|xl|\d?xl|left|center|right|clip-padding|none|clip|linear|radial)/

/** A token's prefixes and utility, when it draws at rest: no prefix, or
 *  `after:` for the overlay. `dark:` is dropped; the caller orders it. */
function atRest(token: string) {
  const all = parts(token)
  const utility = all.pop() ?? ""
  const prefixes = all.filter((p) => p !== "dark")
  if (prefixes.length === 0) return { utility, overlay: false }
  if (prefixes.length === 1 && prefixes[0] === "after")
    return { utility, overlay: true }
}

const ORDER = [
  "Background",
  "Gradient",
  "Text",
  "Underline",
  "Border",
  "Shadow",
  "Fade",
]

/** The look's properties, in the panel's mode. `tokens` are the design
 *  system's: a builder var reads as the value it ships. */
export function lookOf(
  classes: string,
  mode: "light" | "dark",
  tokens: Record<string, string> = {},
) {
  const words = classes.split(/\s+/).filter(Boolean)
  // Dark classes come last in dark, so they win; in light they never draw.
  const ordered = [
    ...words.filter((t) => !t.startsWith("dark:")),
    ...(mode === "dark" ? words.filter((t) => t.startsWith("dark:")) : []),
  ].flatMap((token) => atRest(token) ?? [])
  const vars = new Map<string, string>()
  for (const { utility } of ordered) {
    const decl = utility.match(/^\[(--[\w-]+):(.+)\]$/)
    if (decl?.[1] && decl[2]) vars.set(decl[1], arbitrary(decl[2]))
  }
  // Last write per property wins.
  const slots = new Map<string, LookProperty[]>()
  for (const { utility, overlay } of ordered) {
    const name = (label: string) =>
      overlay ? `Overlay ${label.toLowerCase()}` : label
    const put = (key: string, items: LookProperty[]) =>
      slots.set((overlay ? "~" : "") + key, items)
    // Tokens read as written (`white/14`); vars and arbitrary values as CSS.
    const color = (key: string, label: string, value: string) => {
      const css = colorCss(value, vars)
      const shown = /^[\w-]+(\/\d+)?$/.test(value) ? value : readable(css)
      put(key, [{ label: name(label), value: shown, color: css }])
    }
    let m: RegExpMatchArray | null
    if ((m = utility.match(/^bg-linear-to-(\w+)$/)))
      put("Gradient", [{ label: name("Gradient"), value: `to ${m[1]}` }])
    else if ((m = utility.match(/^(from|via|to)-(.+)$/)) && m[1] && m[2]) {
      if (!/^\d+%$/.test(m[2]))
        color(`Gradient ${m[1]}`, `Gradient ${m[1]}`, m[2])
    } else if (
      (m = utility.match(/^bg-(.+)$/)) &&
      m[1] &&
      !NOT_COLORS.test(m[1])
    )
      color("Background", "Background", m[1])
    else if (
      (m = utility.match(/^text-(.+)$/)) &&
      m[1] &&
      !NOT_COLORS.test(m[1])
    )
      color("Text", "Text", m[1])
    else if (utility === "border")
      put("Border width", [{ label: name("Border"), value: "1px" }])
    else if ((m = utility.match(/^border-\(length:([\w-]+)\)$/)) && m[1])
      put("Border width", [
        {
          label: name("Border"),
          value:
            tokens[m[1]] ??
            STYLE_VAR_DEFAULTS[m[1]] ??
            readable(`var(${m[1]})`),
        },
      ])
    else if ((m = utility.match(/^border-(.+)$/)) && m[1])
      color("Border color", "Border", m[1])
    else if ((m = utility.match(/^shadow-\[(.+)\]$/)) && m[1])
      put(
        "Shadow",
        layers(arbitrary(m[1])).map((layer) => {
          const inner = layer.startsWith("inset")
          return {
            label: name(inner ? "Inner shadow" : "Drop shadow"),
            value: readable(inner ? layer.slice(5) : layer),
          }
        }),
      )
    else if ((m = utility.match(/^shadow-(xs|sm|md|lg|xl|none)$/)) && m[1])
      put(
        "Shadow",
        m[1] === "none" ? [] : [{ label: name("Drop shadow"), value: m[1] }],
      )
    else if (utility === "underline")
      put("Underline", [{ label: name("Underline"), value: "Always" }])
    else if ((m = utility.match(/^mask-b-from-(.+)$/)))
      put("Fade", [{ label: name("Fade"), value: `to bottom from ${m[1]}` }])
  }
  // One Border row: its width, then its color.
  for (const at of ["", "~"]) {
    const [width] = slots.get(`${at}Border width`) ?? []
    const [tint] = slots.get(`${at}Border color`) ?? []
    if (!width || !tint) continue
    slots.delete(`${at}Border width`)
    slots.set(`${at}Border color`, [
      { ...tint, value: `${width.value} ${tint.value}` },
    ])
  }
  // Fills, then text, edges and effects; the overlay after.
  const rank = (key: string) => {
    const i = ORDER.findIndex((name) => key.replace("~", "").startsWith(name))
    return (key.startsWith("~") ? 100 : 0) + (i < 0 ? 50 : i)
  }
  return [...slots.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .flatMap(([, items]) => items)
}
