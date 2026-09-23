/* Charts — the data-viz look: the categorical series strategy and the
   gridline treatment.

   Engine: the color engine generates `--chart-1..8` per mode from the brand
   accent, so the palette rides on the color recipe as `chartPalette` (absent
   = tonal shades, the shadcn-parity default); the grid is an enum param on
   the `chart` container every chart renders through. */

import type { ColorConfig } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const CHART_DEFAULTS = {
  chartPalette: "mono",
  chartGrid: "solid",
}

export const PALETTE_OPTIONS = [
  {
    value: "mono",
    label: "Mono",
    description:
      "Eight tonal shades of the accent's hue, ordered by lightness; " +
      "lightness alone tells series apart. A blue brand gives eight " +
      "blues from pale sky to navy.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "vivid",
    label: "Vivid",
    description:
      "Eight saturated hues (75% of each hue's max chroma): series 1 is " +
      "the accent's hue, the other seven are picked around the wheel to " +
      "stay apart under color-vision deficiency, so every brand gets a " +
      "full rainbow including pinks and purples. The default blue brand " +
      "gives blue, orange, teal, pink, orchid, amber-brown, lime, violet; " +
      "a series keeps its hue in both modes.",
    seenIn: ["Carbon", "Cloudscape", "Atlassian"],
  },
  {
    value: "muted",
    label: "Muted",
    description:
      "The same kind of hue spread at 30% chroma — dusty, low-saturation " +
      "series. The default blue brand gives slate blue, dusty rose, sage, " +
      "lavender, orchid, mauve, gray-cyan, gray-teal.",
  },
]

export const GRID_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description:
      "Solid gridlines: the cartesian grid, and rings and spokes on polar " +
      "charts.",
    seenIn: ["shadcn/ui", "Carbon"],
  },
  {
    value: "dashed",
    label: "Dashed",
    description: "The same gridlines drawn 3px on, 3px off.",
    seenIn: ["Ant Design"],
  },
  {
    value: "none",
    label: "None",
    description: "No gridlines; only axes and marks.",
  },
]

/** A stored value outside the list (e.g. the pre-rename `auto`) reads as the default. */
export function paletteOption(value: string): string {
  return PALETTE_OPTIONS.some((o) => o.value === value)
    ? value
    : CHART_DEFAULTS.chartPalette
}

export function gridOption(value: string): string {
  return GRID_OPTIONS.some((o) => o.value === value)
    ? value
    : CHART_DEFAULTS.chartGrid
}

/** The recipe's series strategy for a palette option; `undefined` is the
 *  engine's tonal default. */
export function chartPaletteOf(palette: string): ColorConfig["chartPalette"] {
  return palette === "vivid" || palette === "muted" ? palette : undefined
}

export function resolveCharts(state: StudioState): Resolved {
  const chartPalette = chartPaletteOf(state.chartPalette)
  const grid = gridOption(state.chartGrid)
  return {
    // A recipe slice, not a recipe: resolve.ts completes it against the default.
    ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
    params: { chart: { grid } },
  }
}

export const CHART_SPEC = {
  label: "Charts",
  description:
    "The data-viz look shared by every chart family: the series colors " +
    "and the gridlines behind them.",
  axes: {
    chartPalette: {
      label: "Palette",
      description:
        "How the eight categorical series colors (`--chart-1..8`) are " +
        "generated from the brand accent, per mode.",
      value: { type: "enum", options: PALETTE_OPTIONS },
      guidance:
        "shadcn ships tonal blues; Carbon, Cloudscape and Atlassian ship " +
        "fixed saturated multi-hue sets. Mono stays on-brand but separates " +
        "series by lightness only; with many series, Vivid (or the calmer " +
        "Muted) separates them by hue. Neither restricts which hues appear, " +
        "so a conservative brand that can't carry pink or purple series " +
        "should stay on Mono.",
    },
    chartGrid: {
      label: "Grid",
      description: "How the gridlines behind every chart are drawn.",
      value: { type: "enum", options: GRID_OPTIONS },
      guidance:
        "Solid is the common default (shadcn, Carbon); AntV — Ant Design's " +
        "chart engine — dashes its grid. None suits sparklines and " +
        "minimal dashboards where values are labeled.",
    },
  },
} satisfies ChapterSpec<typeof CHART_DEFAULTS>
