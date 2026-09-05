import type { Resolved, StudioState } from "./index"

export const ICON_DEFAULTS = {
  iconLibrary: "lucide",
  iconStroke: 2,
  iconWeight: "regular",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveIcons(_state: StudioState): Resolved {
  return {}
}
