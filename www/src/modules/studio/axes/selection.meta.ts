import { options } from "./core/meta"
import { HIGHLIGHT_VALUES } from "./selection"

export const HIGHLIGHT_OPTIONS = options(HIGHLIGHT_VALUES, {
  accent: {
    label: "Accent",
    description: "Highlighted text gets a brand tint",
    credits: ["Radix Themes", "Linear", "Raycast"],
  },
  browser: {
    label: "Browser",
    description: "The browser's default highlight color",
    credits: ["Material 3", "Primer", "Carbon"],
  },
})

export const OPTIONS = {
  selectionHighlight: HIGHLIGHT_OPTIONS,
}
