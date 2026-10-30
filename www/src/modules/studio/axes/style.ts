/* Style — the look, one record per system it is copied from: the button
   recipe and the four keys that draw the rest of the look around it (card
   edge, card shadow, field shell, segmented chip). Those keys default to
   the "style" follow and read the record; Flat's record is each key's own
   default, so Origin is untouched. Picking a Style puts the whole look back
   on its record. An option another look's light needs (a bevelled card
   under Flat) is excluded, falling back to the record. Color, type, radius,
   density, layers and motion never change with it. */

import type { STYLE_VALUES as BUTTON_STYLES } from "./buttons"
import { defineChapter } from "./core/types"
import type { Follow, Rule } from "./core/types"
import type { Effective, Resolved, StudioState } from "./index"
import type { STYLE_VALUES as INPUT_STYLES } from "./inputs"
import { oneOf } from "./schema"
import type { SELECTED_VALUES } from "./segmented-control"
import type { EDGE_VALUES, SHADOW_VALUES } from "./surfaces"

export const STYLE_VALUES = [
  "flat",
  "hairline",
  "rim",
  "gloss",
  "bevel",
  "chunky",
] as const

export type Style = (typeof STYLE_VALUES)[number]

interface Look {
  /** The button recipe (`registry/ui/button/styles.ts`): its primary,
   *  secondary and press. */
  button: (typeof BUTTON_STYLES)[number]
  surfaceEdge: (typeof EDGE_VALUES)[number]
  surfaceShadow: (typeof SHADOW_VALUES)[number]
  inputStyle: (typeof INPUT_STYLES)[number]
  segmentedSelected: (typeof SELECTED_VALUES)[number]
}

export const LOOKS: Readonly<Record<Style, Look>> = {
  // shadcn: solid fills, hairline cards, outline fields.
  flat: {
    button: "flat",
    surfaceEdge: "line",
    surfaceShadow: "flat",
    inputStyle: "outline",
    segmentedSelected: "tone",
  },
  // Primer: a translucent rim on every fill, inset fields, a ringed chip.
  hairline: {
    button: "hairline",
    surfaceEdge: "line",
    surfaceShadow: "flat",
    inputStyle: "inset",
    segmentedSelected: "ring",
  },
  // Untitled UI: rim-lit buttons, raised fields and chips, low cards.
  rim: {
    button: "rim-light",
    surfaceEdge: "line",
    surfaceShadow: "low",
    inputStyle: "raised",
    segmentedSelected: "raised",
  },
  // Clerk: a top sheen on buttons, outline fields, raised chips.
  gloss: {
    button: "gloss",
    surfaceEdge: "line",
    surfaceShadow: "low",
    inputStyle: "outline",
    segmentedSelected: "raised",
  },
  // Polaris: bevelled buttons and cards that sink when pressed.
  bevel: {
    button: "bevel",
    surfaceEdge: "bevel",
    surfaceShadow: "low",
    inputStyle: "inset",
    segmentedSelected: "raised",
  },
  // Duolingo: solid ledges under buttons and cards, well fields.
  chunky: {
    button: "ledge",
    surfaceEdge: "ledge",
    surfaceShadow: "flat",
    inputStyle: "well",
    segmentedSelected: "tone",
  },
}

/** The keys that follow the Style's record. */
export const STYLE_KEYS = [
  "surfaceEdge",
  "surfaceShadow",
  "inputStyle",
  "segmentedSelected",
] as const

export type StyleKey = (typeof STYLE_KEYS)[number]

/** The lit looks: their light draws a bevelled card or a well field. */
const LIT: readonly Style[] = ["rim", "gloss", "bevel"]

/** The looks whose light an option needs; outside them it is excluded. */
export const ALLOWED: Partial<
  Record<StyleKey, Readonly<Record<string, readonly Style[]>>>
> = {
  surfaceEdge: { bevel: LIT, ledge: ["chunky"] },
  inputStyle: { well: [...LIT, "chunky"] },
}

/** The options of `key` that `style` excludes. */
export const excludedUnder = (key: string, style: string): string[] =>
  Object.entries(ALLOWED[key as StyleKey] ?? {})
    .filter(([, styles]) => !styles.includes(style as Style))
    .map(([option]) => option)

export const FOLLOWS = Object.fromEntries(
  STYLE_KEYS.map((key): [StyleKey, Follow] => [
    key,
    {
      kind: "auto",
      id: "style",
      from: "style",
      table: Object.fromEntries(
        STYLE_VALUES.map((style) => [style, LOOKS[style][key]]),
      ),
    },
  ]),
) as Record<StyleKey, Follow>

/* One rule per key and excluded set, so at most one acts at a time. The
   fallback is the follow id: an excluded pick lands on the record. */
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

/* What a Style pick resets: every record key, and the button's secondary
   and press back on the look's own. */
const LOOK_RESET = {
  ...Object.fromEntries(STYLE_KEYS.map((key) => [key, "style"])),
  buttonSecondary: "as-style",
  buttonPress: "as-style",
}

/** `style` picked: the whole look is the Style's again. */
export const pickStyle = (state: StudioState, style: Style): StudioState =>
  ({ ...state, ...LOOK_RESET, style }) as StudioState

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
