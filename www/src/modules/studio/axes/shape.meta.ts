import { options } from "./core/meta"
import { SHAPE_VALUES, STROKE_VALUES, TRACK_VALUES } from "./shape"

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

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  square: {
    label: "Square",
    description: "No rounded corners; switch and slider tracks stay round.",
  },
  sharp: {
    label: "Sharp",
    description: "Small corners on every component.",
  },
  standard: {
    label: "Standard",
    description: "Controls a step tighter than menus, a step under dialogs.",
  },
  soft: {
    label: "Soft",
    description: "Larger corners, closer in size from controls to dialogs.",
  },
  round: {
    label: "Round",
    description: "Generous corners on every surface, pill buttons.",
  },
  pill: {
    label: "Pill",
    description:
      "Pill buttons, fields and controls; cards and dialogs moderate.",
  },
})
