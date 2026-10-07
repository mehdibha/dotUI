import { options } from "./core/meta"
import { STATUS_VALUES, STYLE_VALUES } from "./toast"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  surface: {
    label: "Surface",
    description: "Sonner, Atlassian, Fluent 2, Ant Design, HeroUI, Chakra",
  },
  inverse: {
    label: "Inverse",
    description: "Material 3, Polaris, Spectrum 2, Carbon",
  },
})

export const STATUS_OPTIONS = options(STATUS_VALUES, {
  icon: {
    label: "Icon",
    description: "Sonner, Fluent 2, Ant Design, HeroUI, Mantine, Carbon",
  },
  bold: {
    label: "Bold",
    description: "Spectrum 2, Polaris, Chakra, Atlassian",
  },
  soft: { label: "Soft", description: "Sonner (rich), Carbon (low)" },
})

export const OPTIONS = {
  toastStyle: STYLE_OPTIONS,
  toastStatus: STATUS_OPTIONS,
}
