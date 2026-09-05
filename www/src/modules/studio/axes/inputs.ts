import type { Resolved, StudioState } from "./index"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveInputs(_state: StudioState): Resolved {
  return {}
}
