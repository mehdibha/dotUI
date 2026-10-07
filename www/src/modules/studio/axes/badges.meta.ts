import { CASE_VALUES, SHAPE_VALUES, STYLE_VALUES } from "./badges"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  solid: {
    label: "Solid",
    credits: ["shadcn", "Geist", "Spectrum 2", "Mantine", "Fluent 2"],
  },
  soft: {
    label: "Soft",
    credits: [
      "Radix Themes",
      "Polaris",
      "Chakra",
      "Carbon",
      "Atlassian",
      "HeroUI",
    ],
  },
  outline: { label: "Outline", credits: ["Primer"] },
  "soft-outline": {
    label: "Soft + outline",
    credits: ["Ant Design", "Untitled UI", "Supabase"],
  },
  dot: { label: "Dot", credits: ["Linear"] },
})

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  pill: {
    label: "Pill",
    credits: [
      "Geist",
      "Primer",
      "Carbon",
      "Mantine",
      "Supabase",
      "Fluent 2",
      "HeroUI",
    ],
  },
  rounded: {
    label: "Rounded",
    credits: [
      "Atlassian",
      "Ant Design",
      "Chakra",
      "Spectrum 2",
      "Radix Themes",
      "Untitled UI",
      "Polaris (approx.)",
    ],
  },
})

export const CASE_OPTIONS = options(CASE_VALUES, {
  sentence: {
    label: "Sentence",
    credits: ["shadcn", "Radix Themes", "Primer", "Polaris", "Geist"],
  },
  uppercase: {
    label: "Uppercase",
    credits: ["Supabase", "Mantine", "Atlassian (v15)", "Chakra v2"],
  },
})

export const OPTIONS = {
  badgeStyle: STYLE_OPTIONS,
  badgeShape: SHAPE_OPTIONS,
  badgeCase: CASE_OPTIONS,
}
