import { STYLE_VALUES } from "./alert"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  neutral: { label: "Neutral", credits: ["shadcn", "HeroUI"] },
  soft: {
    label: "Soft",
    credits: ["Radix Themes", "Atlassian", "Mantine", "Chakra", "Polaris"],
  },
  "soft-outline": {
    label: "Soft + outline",
    credits: ["Primer", "Ant Design", "Fluent 2", "Supabase"],
  },
  outline: { label: "Outline", credits: ["Geist"] },
  inverse: { label: "Inverse", credits: ["Carbon"] },
})

export const OPTIONS = {
  alertStyle: STYLE_OPTIONS,
}
