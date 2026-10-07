import { GRID_VALUES, MOTION_VALUES, PALETTE_VALUES } from "./charts"
import { options } from "./core/meta"

export const PALETTE_OPTIONS = options(PALETTE_VALUES, {
  mono: { label: "Mono" },
  vivid: { label: "Vivid" },
  muted: { label: "Muted" },
})

export const GRID_OPTIONS = options(GRID_VALUES, {
  solid: { label: "Solid" },
  dashed: { label: "Dashed" },
  none: { label: "None" },
})

export const MOTION_OPTIONS = options(MOTION_VALUES, {
  spring: { label: "Spring", description: "Origin" },
  ease: { label: "Ease", description: "shadcn" },
  none: { label: "None" },
})

export const OPTIONS = {
  chartPalette: PALETTE_OPTIONS,
  chartGrid: GRID_OPTIONS,
  chartMotion: MOTION_OPTIONS,
}
