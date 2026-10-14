/* Buttons — one recipe for Button and ToggleButton (a synced pair: every key
   here writes both). Style picks a real system's recipe, copied whole; an
   open style (Flat, Hairline) lets Secondary and Press swap in, a closed one
   draws its own. Under Ledge, groups always sit apart. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonSecondary: "as-style",
  buttonRadius: "same",
  buttonPress: "as-style",
  buttonCase: "sentence",
}

export const STYLE_VALUES = [
  "flat",
  "hairline",
  "rim-light",
  "gloss",
  "bevel",
  "ledge",
] as const

/** Styles that draw their own secondary and press. */
export const CLOSED_STYLES = ["rim-light", "gloss", "bevel", "ledge"]

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

export const BUTTON_SCHEMA: ChapterSchema<typeof BUTTON_DEFAULTS> = {
  buttonStyle: oneOf(STYLE_VALUES),
  buttonSecondary: oneOf(SECONDARY_VALUES),
  buttonRadius: oneOf(RADIUS_VALUES),
  buttonPress: oneOf(PRESS_VALUES),
  buttonCase: oneOf(CASE_VALUES),
}

export function resolveButtons(state: Effective): Resolved {
  const style = state.buttonStyle
  const selection = {
    style,
    secondary:
      state.buttonSecondary === "as-style" ? style : state.buttonSecondary,
    press: state.buttonPress,
    case: state.buttonCase,
  }
  const segments = { segments: style === "ledge" ? "gapped" : "attached" }
  return {
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
}

const closed = { key: "buttonStyle", in: CLOSED_STYLES }

export const chapter = defineChapter({
  id: "buttons",
  defaults: BUTTON_DEFAULTS,
  schema: BUTTON_SCHEMA,
  resolve: resolveButtons,
  rules: [
    {
      // Under a neutral primary the two read as one button.
      id: "buttons/solid-needs-brand-primary",
      target: "buttonSecondary",
      when: {
        all: [
          { key: "buttonColor", in: ["neutral"] },
          { key: "buttonStyle", notIn: CLOSED_STYLES },
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
      cause: "buttonStyle",
    },
    {
      // Ledge and Nudge would both write translate.
      id: "buttons/closed-style-owns-press",
      target: "buttonPress",
      when: closed,
      effect: { kind: "hide", value: "as-style" },
      cause: "buttonStyle",
    },
  ],
})
