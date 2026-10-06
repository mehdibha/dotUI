/* Charts — the data-viz look: the categorical series strategy and the
   gridline treatment.

   Engine: the color engine generates `--chart-1..8` per mode from the brand
   accent, so the palette rides on the color recipe as `chartPalette` (absent
   = tonal shades, the shadcn-parity default); the grid is an enum param on
   the `chart` container every chart renders through. Motion is the `motion`
   enum param on `chart`: a JS transition (the marks animate their geometry,
   not CSS), folded to its literal on publish; Motion None pins it off. */

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

/* Spring: react-spring's default config (dotUI); Ease: recharts' 400ms
   tween on CSS `ease` (shadcn's charts); None: static marks. */
export const MOTION_OPTIONS = [
  { value: "spring", label: "Spring", description: "react-spring" },
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
