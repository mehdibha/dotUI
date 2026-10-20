import { FALLBACK_VALUES, SHAPE_VALUES } from "./avatars"
import { options } from "./core/meta"

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  circle: {
    label: "Circle",
    description: "Fully round",
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
  rounded: {
    label: "Rounded",
    description: "A square with rounded corners",
    credits: ["Polaris", "Radix Themes", "Stripe"],
  },
})

export const FALLBACK_OPTIONS = options(FALLBACK_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Initials on a gray fill",
    credits: ["shadcn", "Primer", "Atlassian", "Untitled UI", "Fluent 2"],
  },
  accent: {
    label: "Accent",
    description: "Brand-colored initials on a brand tint",
    credits: ["Radix Themes (soft)", "Material 3 (list)"],
  },
})

export const OPTIONS = {
  avatarShape: SHAPE_OPTIONS,
  avatarFallback: FALLBACK_OPTIONS,
}
