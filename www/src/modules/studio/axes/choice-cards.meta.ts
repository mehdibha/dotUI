import { SELECTED_VALUES } from "./choice-cards"
import { SOURCE_VALUES } from "./color"
import { options } from "./core/meta"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tint: {
    label: "Tint",
    description: "A tinted fill with a soft edge",
    credits: ["shadcn"],
  },
  "outline-tint": {
    label: "Edged tint",
    description: "A tinted fill with a 1px colored edge",
    credits: ["Geist", "Claude"],
  },
  outline: {
    label: "Outline",
    description: "A 2px colored edge, no fill",
    credits: ["Radix Themes", "Stripe", "Untitled UI"],
  },
})

const CARD_COLOR_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral", description: "Black, or white in dark mode" },
  accent: {
    label: "Accent",
    description: "The brand color",
    credits: ["Geist"],
  },
})

/* The row: the follow, then the credited option. */
export const CARD_COLOR_ROW = [
  {
    value: "same",
    label: "Same as checks",
    description: "Follows the checkbox color",
  },
  ...CARD_COLOR_OPTIONS.filter((option) => option.value === "accent"),
]

export const OPTIONS = {
  cardSelected: SELECTED_OPTIONS,
  cardColor: CARD_COLOR_OPTIONS,
}
