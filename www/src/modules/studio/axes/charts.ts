/* Charts: series palette (a color-recipe slice), grid and motion (`chart` params); motion follows the global Motion. */

import type { ColorConfig } from "@/registry/theme"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { FOLLOWS_MOTION, MOTION_VALUES } from "./motion"
import { oneOf } from "./schema"

/* Mono = tonal shades of the brand; vivid / muted = hues spread around the
   brand at high or low chroma. */
export const PALETTE_VALUES = ["mono", "vivid", "muted"] as const

export const GRID_VALUES = ["solid", "dashed", "none"] as const

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
    chartGrid: "solid",
    chartMotion: "same",
  },
  schema: {
    chartPalette: oneOf(PALETTE_VALUES),
    chartGrid: oneOf(GRID_VALUES),
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
          grid: state.chartGrid,
          motion: CHART_MOTION[state.chartMotion] ?? "spring",
        },
      },
    }
  },
})
