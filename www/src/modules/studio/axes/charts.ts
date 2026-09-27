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

export function resolveCharts(state: StudioState): Resolved {
  const chartPalette = chartPaletteOf(state.chartPalette)
  return {
    // A recipe slice, not a recipe: resolve.ts completes it against the default.
    ...(chartPalette ? { color: { chartPalette } as ColorConfig } : {}),
    params: { chart: { grid: state.chartGrid, motion: state.chartMotion } },
  }
}
