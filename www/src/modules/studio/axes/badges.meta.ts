import { CASE_VALUES, SHAPE_VALUES, STYLE_VALUES } from "./badges"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  solid: {
    label: "Solid",
    description: "shadcn, Geist, Spectrum 2, Mantine, Fluent 2",
  },
  soft: {
    label: "Soft",
    description: "Radix Themes, Polaris, Chakra, Carbon, Atlassian, HeroUI",
  },
  outline: { label: "Outline", description: "Primer" },
  "soft-outline": {
    label: "Soft + outline",
    description: "Ant Design, Untitled UI, Supabase",
  },
  dot: { label: "Dot", description: "Linear" },
})

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  pill: {
    label: "Pill",
    description: "Geist, Primer, Carbon, Mantine, Supabase, Fluent 2, HeroUI",
  },
  rounded: {
    label: "Rounded",
    description:
      "Atlassian, Ant Design, Chakra, Spectrum 2, Radix Themes, Untitled UI, Polaris (approx.)",
  },
})

export const CASE_OPTIONS = options(CASE_VALUES, {
  sentence: {
    label: "Sentence",
    description: "shadcn, Radix Themes, Primer, Polaris, Geist",
  },
  uppercase: {
    label: "Uppercase",
    description: "Supabase, Mantine, Atlassian (v15), Chakra v2",
  },
})

export const OPTIONS = {
  badgeStyle: STYLE_OPTIONS,
  badgeShape: SHAPE_OPTIONS,
  badgeCase: CASE_OPTIONS,
}
