import type { Resolved, StudioState } from "./index"

export const SLIDER_DEFAULTS = {
  sliderThumb: "circle",
  sliderTrack: "thin",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSliders(_state: StudioState): Resolved {
  return {}
}
