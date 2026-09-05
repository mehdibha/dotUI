import type { Resolved, StudioState } from "./index"

/* Defaults mirror the shipped focus-ring/focus-input utilities (2px accent
   ring, 2px bg gap, halo fields). */
export const FOCUS_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "ring",
  focusWidth: 2,
  focusOffset: "gap",
  focusGap: 2,
  focusHaloStrength: 45,
  focusInputStyle: "halo",
  focusInputWidth: 2,
  focusInputStrength: 30,
  focusInputBorderWidth: 1,
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveFocus(_state: StudioState): Resolved {
  return {}
}
