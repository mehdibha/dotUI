import { GRID_VALUES, PALETTE_VALUES } from "./charts"
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

export const GRID_OPTIONS = options(GRID_VALUES, {
  solid: { label: "Solid", description: "Solid gridlines behind the plot" },
  dashed: { label: "Dashed", description: "Dashed gridlines behind the plot" },
  none: { label: "None", description: "No gridlines" },
})

export const OPTIONS = {
  chartPalette: PALETTE_OPTIONS,
  chartGrid: GRID_OPTIONS,
  chartMotion: MOTION_OPTIONS,
}
