/* Charts — the data-viz look: the categorical series strategy and the
   gridline treatment.

   Engine: the color engine generates `--chart-1..8` per mode from the brand
   accent, so the palette rides on the color recipe as `chartPalette` (absent
   = tonal shades, the shadcn-parity default); the grid is an enum param on
   the `chart` container every chart renders through. Motion is the `motion`
   enum param on `chart`: a JS transition (the marks animate their geometry,
   not CSS), folded to its literal on publish. */

import type { ColorConfig } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"
import { ease } from "./motion"
import type { Curve } from "./motion"

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

const physics = (stiffness: number, damping: number): Curve => ({
  type: "physics",
  stiffness,
  damping,
  mass: 1,
})

/* shadcn's charts ride recharts' tween (CSS `ease`, 400ms on bars); dotUI's
   default is react-spring's default config, and the other springs are its
   named ones. `curve` is each value's specimen, mirroring the transitions in
   `ui/chart/base.tsx`; none has nothing to draw. */
export const MOTION_OPTIONS: { value: string; label: string; curve?: Curve }[] =
  [
    { value: "spring", label: "Spring", curve: physics(170, 26) },
    { value: "stiff", label: "Stiff", curve: physics(210, 20) },
    { value: "wobbly", label: "Wobbly", curve: physics(180, 12) },
    { value: "slow", label: "Slow", curve: physics(280, 60) },
    {
      value: "ease",
      label: "Ease",
      curve: { type: "easing", ease: ease("ease") },
    },
    { value: "none", label: "None" },
  ]

/** A stored value outside the list (e.g. the pre-rename `auto`) reads as the default. */
export function paletteOption(value: string): string {
  return PALETTE_OPTIONS.some((o) => o.value === value)
    ? value
    : CHART_DEFAULTS.chartPalette
}

export function motionOption(value: string): string {
  return MOTION_OPTIONS.some((o) => o.value === value)
    ? value
    : CHART_DEFAULTS.chartMotion
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
  const motion = motionOption(state.chartMotion)
  return {
    // A recipe slice, not a recipe: resolve.ts completes it against the default.
    ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
    params: { chart: { grid, motion } },
  }
}
