/* Selection — whether UI text can be selected, and what selected content
   looks like. Engine: the `select-ui` utility (base.css) every control and
   label wears reads `--user-select-ui` (none unless a system opts text back
   in; the arrow cursor follows for free — `cursor: auto` is the arrow over
   unselectable text), and `::selection` reads the `text-selection` semantic
   pair, re-pointed at the OS highlight when the system leaves it alone. */

import type { Resolved, StudioState } from "./index"

/* Defaults mirror the registry: controls are unselectable, `::selection` is
   the accent tint. */
export const SELECTION_DEFAULTS = {
  selectionUiText: "none",
  selectionHighlight: "accent",
}

export const UI_TEXT_OPTIONS = [
  { value: "none", label: "Non-selectable" },
  { value: "selectable", label: "Selectable" },
]

export const HIGHLIGHT_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "browser", label: "Browser" },
]

export function resolveSelection(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.selectionUiText === "selectable")
    tokens["--user-select-ui"] = "auto"
  if (state.selectionHighlight === "browser") {
    tokens["--color-text-selection"] = "Highlight"
    tokens["--color-fg-on-text-selection"] = "HighlightText"
  }
  return { tokens }
}
