import type { Resolved, StudioState } from "./index"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveTooltips(_state: StudioState): Resolved {
  return {}
}
