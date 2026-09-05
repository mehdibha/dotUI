import type { Resolved, StudioState } from "./index"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressIndeterminate: "slide",
  progressGap: false,
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveProgress(_state: StudioState): Resolved {
  return {}
}
