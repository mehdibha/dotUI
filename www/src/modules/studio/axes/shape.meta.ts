import { options } from "./core/meta"
import { STROKE_VALUES, TRACK_VALUES } from "./shape"

export const STROKE_OPTIONS = options(STROKE_VALUES, {
  regular: { label: "Regular", credits: ["shadcn", "Geist", "Primer"] },
  bold: { label: "Bold", credits: ["Spectrum 2", "Duolingo"] },
})

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  round: { label: "Round", credits: ["Carbon"] },
  follow: { label: "Follow", credits: ["Radix Themes", "shadcn sera"] },
})

export const OPTIONS = {
  controlStroke: STROKE_OPTIONS,
  tracks: TRACK_OPTIONS,
}
