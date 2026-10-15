import { options } from "./core/meta"
import { STYLE_VALUES } from "./spinner"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  ring: {
    label: "Ring",
    description: "An open arc that spins",
    credits: ["shadcn", "Polaris", "HeroUI", "Chakra", "Material 3"],
  },
  "ring-track": {
    label: "Ring + track",
    description: "An arc spinning over a faint full circle",
    credits: ["Primer", "Spectrum 2", "Fluent 2", "Mantine"],
  },
  blades: {
    label: "Blades",
    description: "Eight fading spokes around a center",
    credits: ["Radix Themes", "Geist", "Apple"],
  },
  dots: {
    label: "Dots",
    description: "Three dots pulsing in turn",
    credits: ["Ant Design"],
  },
})

export const OPTIONS = {
  spinnerStyle: STYLE_OPTIONS,
}
