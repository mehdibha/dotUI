/* Charts: series palette (a color-recipe slice) and the chart look (`chart` params, each swapping lines of the kit's `chartLook` literal); motion follows the global Motion. */

import type { ColorConfig } from "@/registry/theme"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { FOLLOWS_MOTION, MOTION_VALUES } from "./motion"
import { oneOf } from "./schema"

/* Mono = tonal shades of the brand; vivid / muted = hues spread around the
   brand at high or low chroma. */
export const PALETTE_VALUES = ["mono", "vivid", "muted"] as const

/* Category labels only (shadcn), or value labels too (Tremor, Vercel). */
export const AXES_VALUES = ["minimal", "labeled"] as const

export const GRID_VALUES = ["lines", "dashed"] as const

export const LINES_VALUES = ["smooth", "straight", "fine"] as const

export const AREA_VALUES = ["tint", "solid"] as const

export const BARS_VALUES = ["rounded", "square", "slim"] as const

export const LEGEND_VALUES = ["bottom", "top"] as const

/* The chart's transition under each tempo (`chart` motion param): Standard
   keeps dotUI's spring, Smooth recharts' tween, Expressive a spring that
   overshoots. */
const CHART_MOTION: Record<string, string> = {
  none: "none",
  standard: "spring",
  smooth: "ease",
  expressive: "bouncy",
}

/** The recipe's series strategy for a palette option; `undefined` is the
 *  engine's tonal default. */
function chartPaletteOf(palette: string): ColorConfig["chartPalette"] {
  return palette === "vivid" || palette === "muted" ? palette : undefined
}

export const chapter = defineChapter({
  id: "charts",
  defaults: {
    chartPalette: "mono",
    chartAxes: "minimal",
    chartGrid: "lines",
    chartLines: "smooth",
    chartArea: "tint",
    chartBars: "rounded",
    chartLegend: "bottom",
    chartMotion: "same",
  },
  schema: {
    chartPalette: oneOf(PALETTE_VALUES),
    chartAxes: oneOf(AXES_VALUES),
    chartGrid: oneOf(GRID_VALUES),
    chartLines: oneOf(LINES_VALUES),
    chartArea: oneOf(AREA_VALUES),
    chartBars: oneOf(BARS_VALUES),
    chartLegend: oneOf(LEGEND_VALUES),
    chartMotion: oneOf(MOTION_VALUES),
  },
  follows: { chartMotion: FOLLOWS_MOTION },
  resolve(state: Effective): Resolved {
    const chartPalette = chartPaletteOf(state.chartPalette)
    return {
      // A recipe slice, not a recipe: resolve.ts completes it against the default.
      ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
      params: {
        chart: {
          axes: state.chartAxes,
          grid: state.chartGrid,
          lines: state.chartLines,
          area: state.chartArea,
          bars: state.chartBars,
          legend: state.chartLegend,
          motion: CHART_MOTION[state.chartMotion] ?? "spring",
        },
      },
    }
  },
})
