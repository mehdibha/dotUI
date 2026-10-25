import { options } from "./core/meta"
import { HIGHLIGHT_VALUES } from "./selection"

export const HIGHLIGHT_OPTIONS = options(HIGHLIGHT_VALUES, {
  accent: {
    label: "Accent",
    description: "Highlighted text gets a brand tint",
    credits: ["Radix Themes", "Linear", "Raycast"],
  },
  neutral: {
    label: "Neutral",
    description: "Highlighted text gets a gray tint",
  },
  browser: {
    label: "Browser",
    description: "The browser's default highlight color",
    credits: ["Material 3", "Primer", "Carbon"],
  },
  custom: { label: "Custom", description: "A color of its own" },
})

export const OPTIONS = {
  selectionHighlight: HIGHLIGHT_OPTIONS,
}
