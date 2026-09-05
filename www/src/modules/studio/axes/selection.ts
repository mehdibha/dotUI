/* Selection — whether UI text can be selected, and what selected content
   looks like. Engine: base.css puts `user-select: var(--user-select-ui)` on
   controls and their labels (the arrow cursor follows for free — `cursor:
   auto` is the arrow over unselectable text), and its `::selection` rule
   reads the `--selection-bg` / `--selection-fg` pair, the OS highlight
   colors unless a system paints its own. */

import type { Resolved, StudioState } from "./index"

export const SELECTION_DEFAULTS = {
  selectionUiText: "selectable",
  selectionHighlight: "browser",
}

export const UI_TEXT_OPTIONS = [
  { value: "selectable", label: "Selectable" },
  { value: "none", label: "Non-selectable" },
]

export const HIGHLIGHT_OPTIONS = [
  { value: "browser", label: "Browser" },
  { value: "accent", label: "Accent" },
]

export const WIRED = true

export function resolveSelection(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.selectionUiText === "none") tokens["--user-select-ui"] = "none"
  if (state.selectionHighlight === "accent") {
    tokens["--selection-bg"] = "var(--color-accent)"
    tokens["--selection-fg"] = "var(--color-fg-on-accent)"
  }
  return { tokens }
}
