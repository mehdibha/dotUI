import type { Resolved, StudioState } from "./index"

export const SHAPE_DEFAULTS = {
  /** The base radius — the lg rung (popover · menu), in px. */
  radiusPx: 10,
  cornerShape: "round",
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveShape(_state: StudioState): Resolved {
  return {}
}
