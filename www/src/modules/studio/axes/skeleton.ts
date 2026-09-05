import type { Resolved, StudioState } from "./index"

export const SKELETON_DEFAULTS = {
  skeletonAnimation: "shimmer",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSkeleton(_state: StudioState): Resolved {
  return {}
}
