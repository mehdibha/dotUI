import { STYLE_VALUES } from "./alert"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  neutral: { label: "Neutral", description: "shadcn, HeroUI" },
  soft: {
    label: "Soft",
    description: "Radix Themes, Atlassian, Mantine, Chakra, Polaris",
  },
  "soft-outline": {
    label: "Soft + outline",
    description: "Primer, Ant Design, Fluent 2, Supabase",
  },
  outline: { label: "Outline", description: "Geist" },
  inverse: { label: "Inverse", description: "Carbon" },
})

export const OPTIONS = {
  alertStyle: STYLE_OPTIONS,
}
