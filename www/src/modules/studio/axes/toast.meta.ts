import { options } from "./core/meta"
import { STATUS_VALUES, STYLE_VALUES } from "./toast"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  surface: {
    label: "Surface",
    credits: [
      "Sonner",
      "Atlassian",
      "Fluent 2",
      "Ant Design",
      "HeroUI",
      "Chakra",
    ],
  },
  inverse: {
    label: "Inverse",
    credits: ["Material 3", "Polaris", "Spectrum 2", "Carbon"],
  },
})

export const STATUS_OPTIONS = options(STATUS_VALUES, {
  icon: {
    label: "Icon",
    credits: [
      "Sonner",
      "Fluent 2",
      "Ant Design",
      "HeroUI",
      "Mantine",
      "Carbon",
    ],
  },
  bold: {
    label: "Bold",
    credits: ["Spectrum 2", "Polaris", "Chakra", "Atlassian"],
  },
  soft: { label: "Soft", credits: ["Sonner (rich)", "Carbon (low)"] },
})

export const OPTIONS = {
  toastStyle: STYLE_OPTIONS,
  toastStatus: STATUS_OPTIONS,
}
