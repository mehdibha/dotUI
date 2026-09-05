import type { Resolved, StudioState } from "./index"

export const MENU_DEFAULTS = {
  menuIndicator: "check-start",
  menuHighlight: "neutral",
  menuInset: "inset",
  menuLabels: "sentence",
  menuSearch: "field",
  menuScale: "default",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveMenus(_state: StudioState): Resolved {
  return {}
}
