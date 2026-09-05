import type { Resolved, StudioState } from "./index"

export const MOTION_DEFAULTS = {
  motionCharacter: "standard",
  motionSpeed: "default",
  motionOverlay: "scale",
  motionState: "smooth",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveMotion(_state: StudioState): Resolved {
  return {}
}
