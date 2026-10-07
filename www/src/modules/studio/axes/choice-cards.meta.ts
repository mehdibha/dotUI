import { SELECTED_VALUES } from "./choice-cards"
import { SOURCE_VALUES } from "./color"
import { options } from "./core/meta"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tint: { label: "Tint" },
  "outline-tint": { label: "Edged tint" },
  outline: { label: "Outline" },
})

/* The panel offers Accent beside Same as checks. */
export const CARD_COLOR_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral" },
  accent: { label: "Accent", credits: ["Geist"] },
})

export const OPTIONS = {
  cardSelected: SELECTED_OPTIONS,
  cardColor: CARD_COLOR_OPTIONS,
}
