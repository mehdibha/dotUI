import type { Resolved, StudioState } from "./index"

export const MOBILE_DEFAULTS = {
  mobileAdapt: true,
  mobileDetect: "viewport",
  mobilePickers: "drawer",
  mobileDialogs: "center",
  mobileControls: "larger",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveMobile(_state: StudioState): Resolved {
  return {}
}
