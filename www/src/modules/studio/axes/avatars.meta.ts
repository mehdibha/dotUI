import { FALLBACK_VALUES, SHAPE_VALUES } from "./avatars"
import { options } from "./core/meta"

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  circle: {
    label: "Circle",
    credits: [
      "shadcn",
      "Geist",
      "Primer",
      "Fluent 2",
      "Chakra",
      "Mantine",
      "HeroUI",
      "Spectrum 2",
      "Ant Design",
      "Atlassian",
      "Untitled UI",
      "Material 3",
    ],
  },
  rounded: { label: "Rounded", credits: ["Polaris", "Radix Themes", "Stripe"] },
})

export const FALLBACK_OPTIONS = options(FALLBACK_VALUES, {
  neutral: {
    label: "Neutral",
    credits: ["shadcn", "Primer", "Atlassian", "Untitled UI", "Fluent 2"],
  },
  accent: {
    label: "Accent",
    credits: ["Radix Themes (soft)", "Material 3 (list)"],
  },
})

export const OPTIONS = {
  avatarShape: SHAPE_OPTIONS,
  avatarFallback: FALLBACK_OPTIONS,
}
