import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { STYLE_VALUES } from "./switch"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  inset: {
    label: "Inset",
    description: "Filled track, knob stretches on press",
    credits: ["iOS", "shadcn", "Radix Themes", "Linear", "Untitled UI"],
  },
  outlined: {
    label: "Outlined",
    description: "Outlined track, small knob grows when on",
    credits: ["Material 3", "Fluent 2", "Spectrum 2", "Polaris"],
  },
  slab: {
    label: "Slab",
    description: "Squarer track with a half-width knob",
    credits: ["Primer"],
  },
})

export const OPTIONS = {
  switchColor: SOURCE_OPTIONS,
  switchStyle: STYLE_OPTIONS,
}
