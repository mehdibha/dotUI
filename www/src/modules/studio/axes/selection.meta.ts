import { options } from "./core/meta"
import { HIGHLIGHT_VALUES } from "./selection"

export const HIGHLIGHT_OPTIONS = options(HIGHLIGHT_VALUES, {
  accent: { label: "Accent" },
  browser: { label: "Browser" },
})

export const OPTIONS = {
  selectionHighlight: HIGHLIGHT_OPTIONS,
}
