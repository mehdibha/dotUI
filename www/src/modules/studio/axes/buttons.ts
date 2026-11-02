/* Buttons — one recipe for Button and ToggleButton (a synced pair: every key
   here writes both). The Style's look picks a real system's recipe, copied
   whole, and its secondary. A look on Flat buttons lets Secondary and Press
   swap in; the others draw their own. Under Chunky, groups always sit
   apart. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { BOOLEAN, oneOf } from "./schema"
import { LOOKS } from "./style"
import type { Style } from "./style"

/** The recipes a look's `button` names. */
export const STYLE_VALUES = [
  "flat",
  "rim-light",
  "gloss",
  "bevel",
  "ledge",
] as const

/** Looks whose button draws its own secondary and press. */
const CLOSED_STYLES: readonly Style[] = ["rim", "gloss", "bevel", "chunky"]

export const SECONDARY_VALUES = [
  "as-style",
  "outline",
  "raised",
  "soft",
  "tonal",
  "solid",
] as const

export const RADIUS_VALUES = ["same", "pill"] as const

export const PRESS_VALUES = ["as-style", "nudge", "scale"] as const

export const CASE_VALUES = ["sentence", "uppercase"] as const

/** Every variant Button and ToggleButton draw, in order. */
export const VARIANT_VALUES = [
  "primary",
  "secondary",
  "quiet",
  "link",
  "warning",
  "danger",
] as const

export type Variant = (typeof VARIANT_VALUES)[number]

/** The key that keeps a variant in the system. */
export const variantKey = (variant: Variant) =>
  `${variant}Variant` as `${Variant}Variant`

const closed = { key: "style", in: CLOSED_STYLES }

export const chapter = defineChapter({
  id: "buttons",
  defaults: {
    buttonSecondary: "as-style",
    buttonRadius: "same",
    buttonPress: "as-style",
    buttonCase: "sentence",
    primaryVariant: true,
    secondaryVariant: true,
    quietVariant: true,
    linkVariant: true,
    warningVariant: true,
    dangerVariant: true,
  },
  schema: {
    buttonSecondary: oneOf(SECONDARY_VALUES),
    buttonRadius: oneOf(RADIUS_VALUES),
    buttonPress: oneOf(PRESS_VALUES),
    buttonCase: oneOf(CASE_VALUES),
    primaryVariant: BOOLEAN,
    secondaryVariant: BOOLEAN,
    quietVariant: BOOLEAN,
    linkVariant: BOOLEAN,
    warningVariant: BOOLEAN,
    dangerVariant: BOOLEAN,
  },
  resolve(state: Effective): Resolved {
    const { button: style, secondary } = LOOKS[state.style]
    const selection = {
      style,
      secondary:
        state.buttonSecondary === "as-style"
          ? secondary
          : state.buttonSecondary,
      press: state.buttonPress,
      case: state.buttonCase,
    }
    const segments = { segments: style === "ledge" ? "gapped" : "attached" }
    const variants = VARIANT_VALUES.filter((v) => state[variantKey(v)])
    return {
      // Only a system that removed one says which it keeps.
      ...(variants.length < VARIANT_VALUES.length && {
        variants: { button: variants, "toggle-button": variants },
      }),
      tokens:
        state.buttonRadius === "pill"
          ? {
              "--studio-btn-radius": "var(--radius-full)",
              "--studio-btn-xs-radius": "var(--radius-full)",
            }
          : {},
      params: {
        button: selection,
        "toggle-button": selection,
        group: segments,
        "toggle-button-group": segments,
      },
    }
  },
  rules: [
    {
      // Under a neutral primary the two read as one button.
      id: "buttons/solid-needs-brand-primary",
      target: "buttonSecondary",
      when: {
        all: [
          { key: "buttonColor", in: ["neutral"] },
          { key: "style", notIn: CLOSED_STYLES },
        ],
      },
      effect: { kind: "exclude", options: ["solid"], fallback: "as-style" },
      cause: "buttonColor",
    },
    {
      // Two background recipes would ship.
      id: "buttons/closed-style-owns-secondary",
      target: "buttonSecondary",
      when: closed,
      effect: { kind: "hide", value: "as-style" },
      cause: "style",
    },
    {
      // Ledge and Nudge would both write translate.
      id: "buttons/closed-style-owns-press",
      target: "buttonPress",
      when: closed,
      effect: { kind: "hide", value: "as-style" },
      cause: "style",
    },
  ],
})
