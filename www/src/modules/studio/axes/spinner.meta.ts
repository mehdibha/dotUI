import { options } from "./core/meta"
import { STYLE_VALUES } from "./spinner"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  ring: {
    label: "Ring",
    description: "shadcn, Polaris, HeroUI, Chakra, Material 3",
  },
  "ring-track": {
    label: "Ring + track",
    description: "Primer, Spectrum 2, Fluent 2, Mantine",
  },
  blades: { label: "Blades", description: "Radix Themes, Geist, Apple" },
  dots: { label: "Dots", description: "Ant Design" },
})

export const OPTIONS = {
  spinnerStyle: STYLE_OPTIONS,
}
