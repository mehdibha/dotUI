import { options } from "./core/meta"
import { HIGHLIGHT_VALUES } from "./selection"

export const HIGHLIGHT_OPTIONS = options(HIGHLIGHT_VALUES, {
  accent: {
    label: "Accent",
    description: "A tint of the accent",
    credits: ["Radix Themes", "Linear", "Raycast"],
  },
  browser: {
    label: "Browser",
    description: "The system highlight",
    credits: ["Material 3", "Primer", "Carbon"],
  },
})

export const OPTIONS = {
  selectionHighlight: HIGHLIGHT_OPTIONS,
}
