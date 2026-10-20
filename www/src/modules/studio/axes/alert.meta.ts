import { STYLE_VALUES } from "./alert"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Card fill and border, status-colored text",
    credits: ["shadcn", "HeroUI"],
  },
  soft: {
    label: "Soft",
    description: "A status-tinted fill, no border",
    credits: ["Radix Themes", "Atlassian", "Mantine", "Chakra", "Polaris"],
  },
  "soft-outline": {
    label: "Soft + outline",
    description: "A status tint and border, colored icon",
    credits: ["Primer", "Ant Design", "Fluent 2", "Supabase"],
  },
  outline: {
    label: "Outline",
    description: "A status border and text, no fill",
    credits: ["Geist"],
  },
  inverse: {
    label: "Inverse",
    description: "Inverted colors, status in the icon",
    credits: ["Carbon"],
  },
})

export const OPTIONS = {
  alertStyle: STYLE_OPTIONS,
}
