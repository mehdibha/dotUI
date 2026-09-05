import type { Resolved, StudioState } from "./index"

export const SURFACE_DEFAULTS = {
  surfaceStrategy: "hairline",
  surfaceDepth: "subtle",
  surfaceShadow: "plain",
  surfaceEdge: "border",
  surfaceCanvas: "same",
  surfaceMaterial: "solid",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSurfaces(_state: StudioState): Resolved {
  return {}
}
