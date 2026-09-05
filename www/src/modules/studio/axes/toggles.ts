import type { Resolved, StudioState } from "./index"

export const TOGGLE_DEFAULTS = {
  toggleSelected: "fill",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveToggles(_state: StudioState): Resolved {
  return {}
}
