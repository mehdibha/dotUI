import { options } from "./core/meta"
import { SHAPE_VALUES, STROKE_VALUES, TRACK_VALUES } from "./shape"

export const STROKE_OPTIONS = options(STROKE_VALUES, {
  regular: {
    label: "Regular",
    description: "1px control edges",
    credits: ["shadcn", "Geist", "Primer"],
  },
  bold: {
    label: "Bold",
    description: "2px control edges",
    credits: ["Spectrum 2", "Duolingo"],
  },
})

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  round: {
    label: "Round",
    description: "Switch, slider and progress stay fully round",
    credits: ["Carbon"],
  },
  follow: {
    label: "Follow",
    description: "Track corners follow the control radius",
    credits: ["Radix Themes", "shadcn sera"],
  },
})

export const OPTIONS = {
  controlStroke: STROKE_OPTIONS,
  tracks: TRACK_OPTIONS,
}

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  square: { label: "Square", description: "No rounding on any corner" },
  sharp: { label: "Sharp", description: "Small, tight corners" },
  standard: { label: "Standard", description: "Moderate corners everywhere" },
  soft: { label: "Soft", description: "Larger, gentler corners" },
  round: {
    label: "Round",
    description: "Pill controls, generous card corners",
  },
})
