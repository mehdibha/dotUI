import { options } from "./core/meta"
import { STATUS_VALUES, STYLE_VALUES } from "./toast"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  surface: {
    label: "Surface",
    description: "Same surface as popovers and menus",
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
    description: "Inverted colors that stand out from the page",
    credits: ["Material 3", "Polaris", "Spectrum 2", "Carbon"],
  },
})

export const STATUS_OPTIONS = options(STATUS_VALUES, {
  icon: {
    label: "Icon",
    description: "Only the icon takes the status color",
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
    description: "Whole toast filled with the status color",
    credits: ["Spectrum 2", "Polaris", "Chakra", "Atlassian"],
  },
  soft: {
    label: "Soft",
    description: "Light status tint, colored edge and text",
    credits: ["Sonner (rich)", "Carbon (low)"],
  },
})

export const OPTIONS = {
  toastStyle: STYLE_OPTIONS,
  toastStatus: STATUS_OPTIONS,
}
