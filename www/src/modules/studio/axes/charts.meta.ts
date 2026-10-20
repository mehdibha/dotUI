import {
  AREA_VALUES,
  AXES_VALUES,
  BARS_VALUES,
  GRID_VALUES,
  LEGEND_VALUES,
  LINES_VALUES,
  PALETTE_VALUES,
} from "./charts"
import { options } from "./core/meta"
import { MOTION_OPTIONS } from "./motion.meta"

export const PALETTE_OPTIONS = options(PALETTE_VALUES, {
  mono: {
    label: "Mono",
    description: "Light to dark shades of the brand color",
    credits: ["shadcn", "Geist"],
  },
  vivid: {
    label: "Vivid",
    description: "Bright hues spread around the brand",
    credits: ["Material 3", "Carbon"],
  },
  muted: {
    label: "Muted",
    description: "Soft, low-saturation hues around the brand",
    credits: ["Linear", "Stripe"],
  },
})

export const AXES_OPTIONS = options(AXES_VALUES, {
  minimal: {
    label: "Minimal",
    description: "Category labels only",
    credits: ["shadcn"],
  },
  labeled: {
    label: "Labeled",
    description: "Value labels beside the gridlines",
    credits: ["Tremor", "Vercel"],
  },
})

export const GRID_OPTIONS = options(GRID_VALUES, {
  lines: { label: "Lines", description: "Solid gridlines behind the plot" },
  dashed: { label: "Dashed", description: "Dashed gridlines behind the plot" },
})

export const LINES_OPTIONS = options(LINES_VALUES, {
  smooth: { label: "Smooth", description: "Curved lines and area edges" },
  straight: {
    label: "Straight",
    description: "Straight segments between points",
  },
  fine: { label: "Fine", description: "Thin, straight lines" },
})

export const AREA_OPTIONS = options(AREA_VALUES, {
  tint: { label: "Tint", description: "A light fill under the line" },
  solid: { label: "Solid", description: "A strong fill under the line" },
})

export const BARS_OPTIONS = options(BARS_VALUES, {
  rounded: { label: "Rounded", description: "Rounded bar tops" },
  square: { label: "Square", description: "Square bars" },
  slim: { label: "Slim", description: "Narrow, square bars" },
})

export const LEGEND_OPTIONS = options(LEGEND_VALUES, {
  bottom: { label: "Bottom", description: "The legend under the chart" },
  top: { label: "Top", description: "The legend above the chart" },
})

export const OPTIONS = {
  chartPalette: PALETTE_OPTIONS,
  chartAxes: AXES_OPTIONS,
  chartGrid: GRID_OPTIONS,
  chartLines: LINES_OPTIONS,
  chartArea: AREA_OPTIONS,
  chartBars: BARS_OPTIONS,
  chartLegend: LEGEND_OPTIONS,
  chartMotion: MOTION_OPTIONS,
}
