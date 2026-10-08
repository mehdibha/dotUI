/* Charts: series palette (a color-recipe slice), grid and motion (`chart` params). */

import type { ColorConfig } from "@/registry/theme"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CHART_DEFAULTS = {
  chartPalette: "mono",
  chartGrid: "solid",
  chartMotion: "spring",
}

/* Mono = tonal shades of the brand; vivid / muted = hues spread around the
   brand at high or low chroma. */
export const PALETTE_VALUES = ["mono", "vivid", "muted"] as const

export const GRID_VALUES = ["solid", "dashed", "none"] as const

// Spring is dotUI's own (react-spring's default config); Ease is recharts' 400ms tween.
export const MOTION_VALUES = ["spring", "ease", "none"] as const

/** The recipe's series strategy for a palette option; `undefined` is the
 *  engine's tonal default. */
export function chartPaletteOf(palette: string): ColorConfig["chartPalette"] {
  return palette === "vivid" || palette === "muted" ? palette : undefined
}

export const CHART_SCHEMA: ChapterSchema<typeof CHART_DEFAULTS> = {
  chartPalette: oneOf(PALETTE_VALUES),
  chartGrid: oneOf(GRID_VALUES),
  chartMotion: oneOf(MOTION_VALUES),
}

export function resolveCharts(state: Effective): Resolved {
  const chartPalette = chartPaletteOf(state.chartPalette)
  return {
    // A recipe slice, not a recipe: resolve.ts completes it against the default.
    ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
    params: { chart: { grid: state.chartGrid, motion: state.chartMotion } },
  }
}

export const chapter = defineChapter({
  id: "charts",
  defaults: CHART_DEFAULTS,
  schema: CHART_SCHEMA,
  resolve: resolveCharts,
  rules: [
    {
      // A chart would otherwise animate in a system where nothing moves.
      id: "charts/motion-off",
      target: "chartMotion",
      when: { key: "motion", in: ["none"] },
      effect: { kind: "pin", value: "none" },
      cause: "motion",
    },
  ],
})
