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

/* Mono = tonal shades of the brand (shadcn, Vercel); vivid / muted = hues
   spread around the brand at high (Material, Carbon) or low (Linear, Stripe
   dashboards) chroma. */
export const PALETTE_OPTIONS = [
  { value: "mono", label: "Mono" },
  { value: "vivid", label: "Vivid" },
  { value: "muted", label: "Muted" },
]

export const GRID_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "none", label: "None" },
]

// Spring is dotUI's own (react-spring's default config); Ease is recharts' 400ms tween.
export const MOTION_OPTIONS = [
  { value: "spring", label: "Spring", description: "Origin" },
  { value: "ease", label: "Ease", description: "shadcn" },
  { value: "none", label: "None" },
]

/** The recipe's series strategy for a palette option; `undefined` is the
 *  engine's tonal default. */
export function chartPaletteOf(palette: string): ColorConfig["chartPalette"] {
  return palette === "vivid" || palette === "muted" ? palette : undefined
}

export const CHART_SCHEMA: ChapterSchema<typeof CHART_DEFAULTS> = {
  chartPalette: oneOf(PALETTE_OPTIONS),
  chartGrid: oneOf(GRID_OPTIONS),
  chartMotion: oneOf(MOTION_OPTIONS),
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
