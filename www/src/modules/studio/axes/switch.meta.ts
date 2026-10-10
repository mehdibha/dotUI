import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { STYLE_VALUES } from "./switch"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  inset: {
    label: "Inset",
    credits: ["iOS", "shadcn", "Radix Themes", "Linear", "Untitled UI"],
  },
  outlined: {
    label: "Outlined",
    credits: ["Material 3", "Fluent 2", "Spectrum 2", "Polaris"],
  },
  slab: { label: "Slab", credits: ["Primer"] },
})

export const OPTIONS = {
  switchColor: SOURCE_OPTIONS,
  switchStyle: STYLE_OPTIONS,
}
