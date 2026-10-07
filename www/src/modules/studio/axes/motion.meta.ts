import { options } from "./core/meta"
import { ENTRANCE_VALUES, MOTION_VALUES } from "./motion"

export const MOTION_OPTIONS = options(MOTION_VALUES, {
  none: { label: "None", description: "Ant Design" },
  standard: { label: "Standard", description: "shadcn" },
  smooth: { label: "Smooth", description: "Radix Themes" },
  expressive: { label: "Expressive", description: "Material 3" },
})

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  zoom: { label: "Zoom", description: "shadcn" },
  slide: { label: "Slide", description: "Polaris" },
  fade: { label: "Fade", description: "Primer" },
})

export const OPTIONS = {
  motion: MOTION_OPTIONS,
  motionEntrance: ENTRANCE_OPTIONS,
}
