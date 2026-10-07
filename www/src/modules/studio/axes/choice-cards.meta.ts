import { SELECTED_VALUES } from "./choice-cards"
import { options } from "./core/meta"

export const SELECTED_OPTIONS = options(SELECTED_VALUES, {
  tint: { label: "Tint" },
  "outline-tint": { label: "Edged tint" },
  outline: { label: "Outline" },
})

export const OPTIONS = {
  cardSelected: SELECTED_OPTIONS,
}
