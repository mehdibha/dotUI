import { SELECTED_VALUES } from "./choice-cards"
import { SOURCE_VALUES } from "./color"
import { options } from "./core/meta"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tint: { label: "Tint", credits: ["shadcn"] },
  "outline-tint": { label: "Edged tint", credits: ["Geist", "Claude"] },
  outline: {
    label: "Outline",
    credits: ["Radix Themes", "Stripe", "Untitled UI"],
  },
})

export const CARD_COLOR_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral" },
  accent: { label: "Accent", credits: ["Geist"] },
})

/* The row: the follow, then the credited option. */
export const CARD_COLOR_ROW = [
  { value: "same", label: "Same as checks" },
  ...CARD_COLOR_OPTIONS.filter((option) => option.value === "accent"),
]

export const OPTIONS = {
  cardSelected: SELECTED_OPTIONS,
  cardColor: CARD_COLOR_OPTIONS,
}
