import { CASE_VALUES, SHAPE_VALUES, STYLE_VALUES } from "./badges"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  solid: {
    label: "Solid",
    description: "Full status color with contrasting text",
    credits: ["shadcn", "Geist", "Spectrum 2", "Mantine", "Fluent 2"],
  },
  soft: {
    label: "Soft",
    description: "Light status tint with colored text",
    credits: [
      "Radix Themes",
      "Polaris",
      "Chakra",
      "Carbon",
      "Atlassian",
      "HeroUI",
    ],
  },
  outline: {
    label: "Outline",
    description: "Colored edge and text, no fill",
    credits: ["Primer"],
  },
  "soft-outline": {
    label: "Soft + outline",
    description: "Light tint inside a colored edge",
    credits: ["Ant Design", "Untitled UI", "Supabase"],
  },
  dot: {
    label: "Dot",
    description: "Neutral outline with a colored status dot",
    credits: ["Linear"],
  },
})

export const SHAPE_OPTIONS = options(SHAPE_VALUES, {
  pill: {
    label: "Pill",
    description: "Fully rounded ends",
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
    description: "Small corners from the radius scale",
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
    description: "Text kept as written",
    credits: ["shadcn", "Radix Themes", "Primer", "Polaris", "Geist"],
  },
  uppercase: {
    label: "Uppercase",
    description: "Small, widely spaced capitals",
    credits: ["Supabase", "Mantine", "Atlassian (v15)", "Chakra v2"],
  },
})

export const OPTIONS = {
  badgeStyle: STYLE_OPTIONS,
  badgeShape: SHAPE_OPTIONS,
  badgeCase: CASE_OPTIONS,
}
