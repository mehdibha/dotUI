/* Style — the material every surface and control is cut from. Twelve keys
   default to the "style" follow and read their column below; Flat's column
   is each key's own default, so Origin is untouched. An option another style
   owns (Bevel buttons outside Tactile) is excluded, falling back to the
   column. Radius, density and type stay their own rows. */

import { defineChapter } from "./core/types"
import type { Follow, Rule } from "./core/types"
import type { Effective, Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const STYLE_VALUES = ["flat", "soft", "tonal", "tactile"] as const

export type Style = (typeof STYLE_VALUES)[number]

export const STYLE_DEFAULTS = {
  style: "flat" as Style,
}

export const STYLE_SCHEMA: ChapterSchema<typeof STYLE_DEFAULTS> = {
  style: oneOf(STYLE_VALUES),
}

/* A column value may be another follow id of its key ("auto"): it resolves
   one more hop. */
export const COLUMNS = {
  surfaceLayers: {
    flat: "same",
    soft: "same",
    tonal: "tonal",
    tactile: "same",
  },
  surfaceEdge: { flat: "line", soft: "line", tonal: "none", tactile: "bevel" },
  surfaceShadow: { flat: "flat", soft: "low", tonal: "low", tactile: "flat" },
  controlEdge: { flat: "firm", soft: "firm", tonal: "strong", tactile: "firm" },
  buttonStyle: { flat: "flat", soft: "flat", tonal: "flat", tactile: "bevel" },
  buttonSecondary: {
    flat: "as-style",
    soft: "raised",
    tonal: "tonal",
    tactile: "as-style",
  },
  segmentedSelected: {
    flat: "auto",
    soft: "raised",
    tonal: "inverse",
    tactile: "auto",
  },
  toggleSelected: {
    flat: "tone",
    soft: "tone",
    tonal: "solid",
    tactile: "tone",
  },
  inputStyle: {
    flat: "auto",
    soft: "auto",
    tonal: "indicator",
    tactile: "auto",
  },
  menuSelectedRow: {
    flat: "none",
    soft: "none",
    tonal: "tint",
    tactile: "tint",
  },
  menuInset: {
    flat: "inset",
    soft: "inset",
    tonal: "full-bleed",
    tactile: "inset",
  },
  toastStyle: {
    flat: "surface",
    soft: "surface",
    tonal: "inverse",
    tactile: "surface",
  },
} satisfies Record<string, Record<Style, string>>

export type StyleKey = keyof typeof COLUMNS

export const STYLE_KEYS = Object.keys(COLUMNS) as StyleKey[]

/** The styles an option belongs to; outside them it is excluded. */
export const ALLOWED: Partial<
  Record<StyleKey, Readonly<Record<string, readonly Style[]>>>
> = {
  buttonStyle: {
    hairline: ["flat", "soft"],
    "rim-light": ["soft", "tactile"],
    gloss: ["soft", "tactile"],
    bevel: ["tactile"],
    ledge: ["tactile"],
  },
  surfaceEdge: { bevel: ["tactile"], ledge: ["tactile"] },
  surfaceLayers: { tonal: ["tonal"] },
  inputStyle: { well: ["tactile"] },
}

/** The options of `key` that `style` excludes. */
export const excludedUnder = (key: string, style: string): string[] =>
  Object.entries(ALLOWED[key as StyleKey] ?? {})
    .filter(([, styles]) => !styles.includes(style as Style))
    .map(([option]) => option)

export const FOLLOWS = Object.fromEntries(
  STYLE_KEYS.map((key): [StyleKey, Follow] => [
    key,
    { kind: "auto", id: "style", from: "style", table: COLUMNS[key] },
  ]),
) as Record<StyleKey, Follow>

/* One rule per key and excluded set, so at most one acts at a time. The
   fallback is the follow id: an excluded pick lands on the style's column. */
export const RULES: Rule[] = Object.keys(ALLOWED).flatMap((key) => {
  const byOptions = new Map<string, Style[]>()
  for (const style of STYLE_VALUES) {
    const options = excludedUnder(key, style).join(" ")
    if (options)
      byOptions.set(options, [...(byOptions.get(options) ?? []), style])
  }
  return [...byOptions].map(
    ([options, styles]): Rule => ({
      id: `style/${key}-${styles.join("-")}`,
      target: key,
      when: { key: "style", in: styles },
      effect: {
        kind: "exclude",
        options: options.split(" "),
        fallback: "style",
      },
      cause: "style",
    }),
  )
})

/** `style` picked: a saved key the new style excludes goes back to it;
 *  every other explicit pick is kept. */
export function pickStyle(state: StudioState, style: Style): StudioState {
  const next: Record<string, unknown> = { ...state, style }
  for (const key of STYLE_KEYS)
    if (excludedUnder(key, style).includes(state[key])) next[key] = "style"
  return next as StudioState
}

/** Every Style key back on its column. */
export const resetToStyle = (state: StudioState): StudioState =>
  ({
    ...state,
    ...Object.fromEntries(STYLE_KEYS.map((key) => [key, "style"])),
  }) as StudioState

export const chapter = defineChapter({
  id: "style",
  defaults: STYLE_DEFAULTS,
  schema: STYLE_SCHEMA,
  resolve: (_state: Effective): Resolved => ({}),
})
