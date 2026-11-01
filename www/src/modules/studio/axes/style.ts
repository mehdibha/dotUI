/* Style — the look, one record per system it is copied from: the button
   recipe, its secondary, and the keys that draw the rest of the look around
   it (card layers, edge and shadow, field shell, segmented chip). Those keys
   default to the "style" follow and read the record; Flat's record is each
   key's own default, so Origin is untouched. Picking a Style puts the whole
   look back on its record. An option another look's light needs (a
   bevelled card under Flat) is excluded, falling back to the record. Color,
   type, radius, density and motion never change with it. */

import type { STYLE_VALUES as BUTTON_STYLES, SECONDARY_VALUES } from "./buttons"
import { defineChapter } from "./core/types"
import type { Follow, Rule } from "./core/types"
import type { Effective, Resolved, StudioState } from "./index"
import type { STYLE_VALUES as INPUT_STYLES } from "./inputs"
import { oneOf } from "./schema"
import type { SELECTED_VALUES } from "./segmented-control"
import type { EDGE_VALUES, LAYERS_VALUES, SHADOW_VALUES } from "./surfaces"

export const STYLE_VALUES = [
  "flat",
  "rim",
  "gloss",
  "bevel",
  "chunky",
  "borderless",
  "brutalist",
] as const

export type Style = (typeof STYLE_VALUES)[number]

interface Look {
  /** The button recipe (`registry/ui/button/styles.ts`): its primary and
   *  press. */
  button: (typeof BUTTON_STYLES)[number]
  /** The secondary As style draws: the recipe's own, or one swapped in. */
  secondary:
    | (typeof BUTTON_STYLES)[number]
    | Exclude<(typeof SECONDARY_VALUES)[number], "as-style">
  surfaceLayers: (typeof LAYERS_VALUES)[number]
  surfaceEdge: (typeof EDGE_VALUES)[number]
  surfaceShadow: (typeof SHADOW_VALUES)[number]
  inputStyle: (typeof INPUT_STYLES)[number]
  segmentedSelected: (typeof SELECTED_VALUES)[number]
}

export const LOOKS: Readonly<Record<Style, Look>> = {
  // shadcn: solid fills, hairline cards, outline fields.
  flat: {
    button: "flat",
    secondary: "flat",
    surfaceLayers: "same",
    surfaceEdge: "line",
    surfaceShadow: "flat",
    inputStyle: "outline",
    segmentedSelected: "tone",
  },
  // Untitled UI, polished: rim-lit buttons (a dark ring, a white top rim, a
  // bottom shade) that sink when pressed, raised fields and chips, low
  // cards.
  rim: {
    button: "rim-light",
    secondary: "rim-light",
    surfaceLayers: "same",
    surfaceEdge: "line",
    surfaceShadow: "low",
    inputStyle: "raised",
    segmentedSelected: "raised",
  },
  // Clerk: a top sheen on buttons, outline fields, raised chips.
  gloss: {
    button: "gloss",
    secondary: "gloss",
    surfaceLayers: "same",
    surfaceEdge: "line",
    surfaceShadow: "low",
    inputStyle: "outline",
    segmentedSelected: "raised",
  },
  // Polaris: bevelled buttons and cards that sink when pressed.
  bevel: {
    button: "bevel",
    secondary: "bevel",
    surfaceLayers: "same",
    surfaceEdge: "bevel",
    surfaceShadow: "low",
    inputStyle: "inset",
    segmentedSelected: "raised",
  },
  // Duolingo: solid ledges under buttons and cards, well fields.
  chunky: {
    button: "ledge",
    secondary: "ledge",
    surfaceLayers: "same",
    surfaceEdge: "ledge",
    surfaceShadow: "flat",
    inputStyle: "well",
    segmentedSelected: "tone",
  },
  // Higgsfield, Material 3: no edges anywhere. Cards sit a tone apart,
  // fields are filled, secondaries a gray fill.
  borderless: {
    button: "flat",
    secondary: "soft",
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    surfaceShadow: "flat",
    inputStyle: "filled",
    segmentedSelected: "tone",
  },
  // Zara: underlined fields, outline secondaries, a ringed chip, no
  // shadow.
  brutalist: {
    button: "flat",
    secondary: "outline",
    surfaceLayers: "same",
    surfaceEdge: "line",
    surfaceShadow: "flat",
    inputStyle: "underline",
    segmentedSelected: "ring",
  },
}

/** The keys that follow the Style's record. */
export const STYLE_KEYS = [
  "surfaceLayers",
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
