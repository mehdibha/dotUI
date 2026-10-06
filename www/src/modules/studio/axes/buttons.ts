/* Buttons — one recipe for Button and ToggleButton (a synced pair: every key
   here writes both). Style picks a real system's recipe, copied whole; an
   open style (Flat, Hairline) lets Secondary and Press swap in, a closed one
   draws its own. Under Ledge, groups sit apart (decision 14). */

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

/* Descriptions credit the systems each option is copied from. */
export const STYLE_OPTIONS = [
  { value: "flat", label: "Flat", description: "shadcn, Geist, Carbon" },
  { value: "hairline", label: "Hairline", description: "Primer, Supabase" },
  { value: "rim-light", label: "Rim light", description: "Untitled UI" },
  { value: "gloss", label: "Gloss", description: "Clerk" },
  { value: "bevel", label: "Bevel", description: "Polaris, Radix classic" },
  { value: "ledge", label: "Ledge", description: "Duolingo" },
]

/** Styles that draw their own secondary and press. */
export const CLOSED_STYLES = ["rim-light", "gloss", "bevel", "ledge"]

export const SECONDARY_OPTIONS = [
  { value: "as-style", label: "As style", description: "Primer, Polaris" },
  {
    value: "outline",
    label: "Outline",
    description: "shadcn, Geist, Notion, Stripe",
  },
  { value: "raised", label: "Raised", description: "Supabase, Claude" },
  { value: "soft", label: "Soft", description: "Radix, Airbnb, Spectrum 2" },
  { value: "tonal", label: "Tonal", description: "Material 3" },
]

export const RADIUS_OPTIONS = [
  { value: "same", label: "Same as controls", description: "Primer, shadcn" },
  {
    value: "pill",
    label: "Pill",
    description: "Material 3, Spectrum 2, Spotify",
  },
]

export const PRESS_OPTIONS = [
  { value: "as-style", label: "As style", description: "Primer, Carbon" },
  { value: "nudge", label: "Nudge", description: "shadcn, Mantine" },
  { value: "scale", label: "Scale", description: "Supabase, Claude" },
]

export const CASE_OPTIONS = [
  { value: "sentence", label: "Sentence", description: "shadcn, Primer" },
  { value: "uppercase", label: "Uppercase", description: "Duolingo" },
]

export const BUTTON_SCHEMA: ChapterSchema<typeof BUTTON_DEFAULTS> = {
  buttonStyle: oneOf(STYLE_OPTIONS),
  buttonSecondary: oneOf(SECONDARY_OPTIONS),
  buttonRadius: oneOf(RADIUS_OPTIONS),
  buttonPress: oneOf(PRESS_OPTIONS),
  buttonCase: oneOf(CASE_OPTIONS),
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
