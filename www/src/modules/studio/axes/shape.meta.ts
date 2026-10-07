import { options } from "./core/meta"
import { STROKE_VALUES, TRACK_VALUES } from "./shape"

export const STROKE_OPTIONS = options(STROKE_VALUES, {
  regular: { label: "Regular", description: "shadcn, Geist, Primer" },
  bold: { label: "Bold", description: "Spectrum 2, Duolingo" },
})

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  round: { label: "Round", description: "Carbon" },
  follow: { label: "Follow", description: "Radix Themes, shadcn sera" },
})

export const OPTIONS = {
  controlStroke: STROKE_OPTIONS,
  tracks: TRACK_OPTIONS,
}
