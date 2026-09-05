import type { Resolved, StudioState } from "./index"

export const INPUT_GROUP_DEFAULTS = {
  addonLayout: "inside",
  addonDivider: "hairline",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveInputGroups(_state: StudioState): Resolved {
  return {}
}
