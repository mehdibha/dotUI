import type { Resolved, StudioState } from "./index"

export const CHART_DEFAULTS = {
  chartPalette: "auto",
  chartCurve: "smooth",
  chartGrid: "dashed",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveCharts(_state: StudioState): Resolved {
  return {}
}
