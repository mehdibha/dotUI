import { options } from "./core/meta"
import { ENTRANCE_VALUES, MOTION_VALUES } from "./motion"

export const MOTION_OPTIONS = options(MOTION_VALUES, {
  none: { label: "None", credits: ["Ant Design"] },
  standard: { label: "Standard", credits: ["shadcn"] },
  smooth: { label: "Smooth", credits: ["Radix Themes"] },
  expressive: { label: "Expressive", credits: ["Material 3"] },
})

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  zoom: { label: "Zoom", credits: ["shadcn"] },
  slide: { label: "Slide", credits: ["Polaris"] },
  fade: { label: "Fade", credits: ["Primer"] },
})

export const OPTIONS = {
  motion: MOTION_OPTIONS,
  motionEntrance: ENTRANCE_OPTIONS,
}
