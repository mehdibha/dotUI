/* Style — the material, named by its light: how every surface and control
   draws depth. Flat has no light (lines), Polished lights controls from
   above, Chunky casts hard light onto solid ledges. Seven keys default to
   the "style" follow and read their column below; Flat's column is each
   key's own default, so Origin is untouched. An option that needs another
   light (Bevel buttons outside Polished) is excluded, falling back to the
   column. Color, type, radius, density and motion never change with it. */

import { defineChapter } from "./core/types"
import type { Follow, Rule } from "./core/types"
import type { Effective, Resolved, StudioState } from "./index"
import { oneOf } from "./schema"

export const STYLE_VALUES = ["flat", "polished", "chunky"] as const

export type Style = (typeof STYLE_VALUES)[number]

/* A column value may be another follow id of its key ("auto"): it resolves
   one more hop. */
export const COLUMNS = {
  surfaceLayers: {
    flat: "same",
    polished: "same",
    chunky: "same",
  },
  // Polished and Chunky draw the edge their button finish implies.
  surfaceEdge: {
    flat: "line",
    polished: "auto",
    chunky: "auto",
  },
  surfaceShadow: {
    flat: "flat",
    polished: "low",
    chunky: "flat",
  },
  buttonStyle: {
    flat: "flat",
    polished: "bevel",
    chunky: "ledge",
  },
  buttonSecondary: {
    flat: "as-style",
    polished: "as-style",
    chunky: "as-style",
  },
  segmentedSelected: {
    flat: "auto",
    polished: "auto",
    chunky: "auto",
  },
  inputStyle: {
    flat: "auto",
    polished: "auto",
    chunky: "auto",
  },
} satisfies Record<string, Record<Style, string>>

export type StyleKey = keyof typeof COLUMNS

export const STYLE_KEYS = Object.keys(COLUMNS) as StyleKey[]

/** The styles whose light an option needs; outside them it is excluded. */
export const ALLOWED: Partial<
  Record<StyleKey, Readonly<Record<string, readonly Style[]>>>
> = {
  buttonStyle: {
    hairline: ["flat"],
    "rim-light": ["polished"],
    gloss: ["polished"],
    bevel: ["polished"],
    ledge: ["chunky"],
  },
  surfaceEdge: { bevel: ["polished"], ledge: ["chunky"] },
  inputStyle: { well: ["polished", "chunky"] },
}

/** The key each Style's finish lives in: a variation of its own light. */
export const FINISH_KEYS: Partial<Record<Style, StyleKey>> = {
  polished: "buttonStyle",
  chunky: "buttonStyle",
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

/** `style` picked: the old Style's finish and any saved key the new style
 *  excludes go back to it; every other explicit pick is kept. */
export function pickStyle(state: StudioState, style: Style): StudioState {
  const next: Record<string, unknown> = { ...state, style }
  const finish = style === state.style ? undefined : FINISH_KEYS[state.style]
  for (const key of STYLE_KEYS)
    if (key === finish || excludedUnder(key, style).includes(state[key]))
      next[key] = "style"
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
  defaults: {
    style: "flat" as Style,
  },
  schema: {
    style: oneOf(STYLE_VALUES),
  },
  resolve: (_state: Effective): Resolved => ({}),
})
