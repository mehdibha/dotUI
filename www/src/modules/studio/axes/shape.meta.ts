import { options } from "./core/meta"
import { STROKE_VALUES, TRACK_VALUES } from "./shape"
import type { ShapeVector } from "./shape"

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

/* Three looks that stay distinct at a glance; the base slider and Custom
   cover the rest. Checked against shadcn/create: Square ≈ lyra/sera,
   Standard ≈ mira (vega and nova within a rung), Round ≈ luma/rhea. */
export const SHAPE_CHARACTERS: Array<{
  id: string
  label: string
  vector: ShapeVector
}> = [
  {
    id: "square",
    label: "Square",
    vector: {
      roleControl: "none",
      roleItem: "none",
      roleSurface: "none",
      rolePanel: "none",
      roleCard: "auto",
    },
  },
  {
    id: "standard",
    label: "Standard",
    vector: {
      roleControl: "md",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
      roleCard: "auto",
    },
  },
  {
    id: "round",
    label: "Round",
    vector: {
      roleControl: "3xl",
      roleItem: "auto",
      roleSurface: "2xl",
      rolePanel: "3xl",
      roleCard: "auto",
    },
  },
]
