/* Charts — the data-viz look: the categorical series strategy and the
   gridline treatment.

   Engine: the color engine generates `--chart-1..8` per mode from the brand
   accent, so the palette rides on the color recipe as `chartPalette` (absent
   = tonal shades, the shadcn-parity default); the grid is an enum param on
   the `chart` container every chart renders through. */

import type { ColorConfig } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"

export const CHART_DEFAULTS = {
  chartPalette: "mono",
  chartGrid: "solid",
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

export const WIRED = true

export function resolveCharts(state: StudioState): Resolved {
  const chartPalette = chartPaletteOf(state.chartPalette)
  const grid = gridOption(state.chartGrid)
  return {
    // A recipe slice, not a recipe: resolve.ts completes it against the default.
    ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
    params: { chart: { grid } },
  }
}
