import type { Resolved, StudioState } from "./index"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "flat",
  segmentedTrack: "filled",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSegmentedControl(_state: StudioState): Resolved {
  return {}
}
