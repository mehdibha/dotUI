import { options } from "./core/meta"
import { STYLE_VALUES } from "./spinner"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  ring: {
    label: "Ring",
    credits: ["shadcn", "Polaris", "HeroUI", "Chakra", "Material 3"],
  },
  "ring-track": {
    label: "Ring + track",
    credits: ["Primer", "Spectrum 2", "Fluent 2", "Mantine"],
  },
  blades: { label: "Blades", credits: ["Radix Themes", "Geist", "Apple"] },
  dots: { label: "Dots", credits: ["Ant Design"] },
})

export const OPTIONS = {
  spinnerStyle: STYLE_OPTIONS,
}
