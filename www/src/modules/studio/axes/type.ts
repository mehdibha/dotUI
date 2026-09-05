import { DEFAULT_BODY_FAMILY, DEFAULT_MONO_FAMILY } from "@/lib/fonts"

import type { Resolved, StudioState } from "./index"

export const TYPE_DEFAULTS = {
  // heading mirrors --font-heading: '' = Auto, follows body.
  headingFont: "",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  headingWeight: "600",
  headingTracking: "normal",
  typeBase: 16,
  headingAdjust: 1,
  bodyLeading: "normal",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveType(_state: StudioState): Resolved {
  return {}
}
