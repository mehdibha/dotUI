/* Inputs — the field shell every text field, picker trigger and OTP cell
   wears, its pointer state and its height. Engine: `input.style`,
   `input.hover`, `input.height`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const INPUT_DEFAULTS = {
  inputStyle: "auto",
  inputHover: "auto",
  inputHeight: "controls",
}

/* Each shell is one system's field, copied whole (input/styles.ts). */
export const STYLE_OPTIONS = [
  {
    value: "outline",
    label: "Outline",
    credits: ["shadcn nova", "Geist", "Linear", "Stripe", "Spotify", "Polaris"],
  },
  { value: "raised", label: "Raised", credits: ["Untitled UI", "shadcn vega"] },
  { value: "inset", label: "Inset", credits: ["Primer"] },
  {
    value: "well",
    label: "Well",
    credits: ["shadcn mira", "Supabase", "Notion", "Duolingo"],
  },
  { value: "filled", label: "Filled", credits: ["shadcn luma", "Ant filled"] },
  {
    value: "indicator",
    label: "Indicator",
    credits: ["Material 3 filled", "Carbon"],
  },
  { value: "underline", label: "Underline", credits: ["shadcn sera"] },
]

/* Auto pairs the shell with the button style's source system: Hairline →
   Inset is Primer's alone (Linear draws Outline, Supabase a Well). */
export const AUTO_STYLE: Record<string, string> = {
  flat: "outline",
  hairline: "inset",
  "rim-light": "raised",
  gloss: "outline",
  // Spec pairing, uncredited: Polaris (Bevel's source) measured Outline.
  bevel: "inset",
  ledge: "well",
}

export const HOVER_OPTIONS = [
  {
    value: "none",
    label: "None",
    credits: ["shadcn", "Primer", "Radix", "Carbon"],
  },
  {
    value: "edge",
    label: "Edge",
    credits: ["Geist", "Linear", "Stripe", "Spotify", "Claude"],
  },
  { value: "tint", label: "Tint", credits: ["Material 3 filled"] },
  { value: "edge-tint", label: "Edge + tint", credits: ["Polaris"] },
]

/** As style (the follow): each shell's own hover, from the system it is
 *  copied from. */
export const STYLE_HOVER: Record<string, string> = {
  outline: "none", // shadcn
  raised: "none", // Untitled UI
  inset: "none", // Primer
  well: "edge", // Supabase
  filled: "tint", // Ant filled
  indicator: "tint", // Material 3 state layer (Carbon draws none)
  underline: "edge", // Fluent
}

export const HEIGHT_OPTIONS = [
  {
    value: "controls",
    label: "Controls",
    credits: ["shadcn", "Geist", "Linear", "Stripe", "Primer"],
  },
  {
    value: "step",
    label: "One step taller",
    credits: ["Polaris", "Untitled UI", "Supabase"],
  },
  { value: "tall", label: "Tall", credits: ["Material 3", "Airbnb"] },
]

export const INPUT_SCHEMA: ChapterSchema<typeof INPUT_DEFAULTS> = {
  inputStyle: oneOf(STYLE_OPTIONS),
  inputHover: oneOf(HOVER_OPTIONS),
  inputHeight: oneOf(HEIGHT_OPTIONS),
}

export function resolveInputs(state: Effective): Resolved {
  return {
    params: {
      input: {
        style: state.inputStyle,
        hover: state.inputHover,
        height: state.inputHeight,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "inputs",
  defaults: INPUT_DEFAULTS,
  schema: INPUT_SCHEMA,
  resolve: resolveInputs,
  follows: {
    inputStyle: [
      { kind: "auto", id: "auto", from: "buttonStyle", table: AUTO_STYLE },
    ],
    inputHover: [
      { kind: "auto", id: "auto", from: "inputStyle", table: STYLE_HOVER },
    ],
  },
})
