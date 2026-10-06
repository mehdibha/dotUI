/* Charts — the categorical series strategy and the chart looks. The color
   engine generates `--chart-1..8` per mode from the brand accent, so the
   palette rides on the color recipe as `chartPalette` (absent = tonal
   shades, the shadcn-parity default). The looks are `chart` params: each
   swaps a line of the kit's `chartDefaults`, so a chart's own options still
   win. Chart motion lives in the Motion chapter. */

import type { ColorConfig } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"
import { ease } from "./motion"
import type { Curve } from "./motion"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CHART_DEFAULTS = {
  chartPalette: "mono",
  chartAxes: "minimal",
  chartGrid: "lines",
  chartLines: "smooth",
  chartArea: "tint",
  chartBars: "rounded",
  chartLegend: "off",
  chartGuide: "none",
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

/* Category labels only (shadcn); value labels too (Tremor, Vercel); and a
   baseline (Carbon, Highcharts); values on the right (Linear, Stripe). */
export const AXES_OPTIONS = [
  { value: "minimal", label: "Minimal" },
  { value: "labeled", label: "Labeled" },
  { value: "baseline", label: "Baseline" },
  { value: "right", label: "Right" },
]

export const GRID_OPTIONS = [
  { value: "lines", label: "Lines" },
  { value: "dashed", label: "Dashed" },
  { value: "full", label: "Full" },
]

export const LINES_OPTIONS = [
  { value: "smooth", label: "Smooth" },
  { value: "straight", label: "Straight" },
  { value: "fine", label: "Fine" },
]

export const AREA_OPTIONS = [
  { value: "tint", label: "Tint" },
  { value: "gradient", label: "Gradient" },
  { value: "solid", label: "Solid" },
]

export const BARS_OPTIONS = [
  { value: "rounded", label: "Rounded" },
  { value: "tip", label: "Tip" },
  { value: "square", label: "Square" },
  { value: "slim", label: "Slim" },
]

export const LEGEND_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "bottom", label: "Bottom" },
  { value: "top", label: "Top" },
]

export const GUIDE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "line", label: "Line" },
  { value: "dashed", label: "Dashed" },
]

const physics = (stiffness: number, damping: number): Curve => ({
  type: "physics",
  stiffness,
  damping,
  mass: 1,
})

/* Quick is a 300ms ease-out tween (Carbon); Spring is react-spring's default
   config, Bouncy its wobbly one. `curve` is each value's specimen, mirroring
   the transitions in `ui/chart/base.tsx`. */
export const MOTION_OPTIONS: { value: string; label: string; curve?: Curve }[] =
  [
    { value: "off", label: "Off" },
    {
      value: "quick",
      label: "Quick",
      curve: { type: "easing", ease: ease("ease-out") },
    },
    { value: "spring", label: "Spring", curve: physics(170, 26) },
    { value: "bouncy", label: "Bouncy", curve: physics(180, 12) },
  ]

/** The recipe's series strategy for a palette option; `undefined` is the
 *  engine's tonal default. */
export function chartPaletteOf(palette: string): ColorConfig["chartPalette"] {
  return palette === "vivid" || palette === "muted" ? palette : undefined
}

export const CHART_SCHEMA: ChapterSchema<typeof CHART_DEFAULTS> = {
  chartPalette: oneOf(PALETTE_OPTIONS),
  chartAxes: oneOf(AXES_OPTIONS),
  chartGrid: oneOf(GRID_OPTIONS),
  chartLines: oneOf(LINES_OPTIONS),
  chartArea: oneOf(AREA_OPTIONS),
  chartBars: oneOf(BARS_OPTIONS),
  chartLegend: oneOf(LEGEND_OPTIONS),
  chartGuide: oneOf(GUIDE_OPTIONS),
  chartMotion: oneOf(MOTION_OPTIONS),
}

export function resolveCharts(state: StudioState): Resolved {
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
        guide: state.chartGuide,
        motion: state.chartMotion,
      },
    },
  }
}
