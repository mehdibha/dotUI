import { options } from "./core/meta"
import { HEIGHT_VALUES, HOVER_VALUES, STYLE_VALUES } from "./inputs"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  outline: {
    label: "Outline",
    description: "Clear box with a visible edge",
    credits: ["shadcn nova", "Geist", "Linear", "Stripe", "Spotify", "Polaris"],
  },
  raised: {
    label: "Raised",
    description: "Page-colored box with a small drop shadow",
    credits: ["Untitled UI", "shadcn vega"],
  },
  inset: {
    label: "Inset",
    description: "Page-colored box with a faint inner shadow",
    credits: ["Primer", "Radix Themes"],
  },
  well: {
    label: "Well",
    description: "Tinted fill inside a visible edge",
    credits: ["shadcn mira", "Supabase", "Notion", "Duolingo"],
  },
  filled: {
    label: "Filled",
    description: "Tinted fill with no edge",
    credits: ["shadcn luma", "Ant filled"],
  },
  indicator: {
    label: "Indicator",
    description: "Tinted fill over a bottom line",
    credits: ["Material 3 filled", "Carbon"],
  },
  underline: {
    label: "Underline",
    description: "Bottom line only, no fill or box",
    credits: ["shadcn sera"],
  },
})

export const HOVER_OPTIONS = options(HOVER_VALUES, {
  none: {
    label: "None",
    description: "No change on hover",
    credits: ["shadcn", "Primer", "Radix", "Carbon"],
  },
  edge: {
    label: "Edge",
    description: "Edge darkens on hover",
    credits: ["Geist", "Linear", "Stripe", "Spotify", "Claude"],
  },
  tint: {
    label: "Tint",
    description: "Background tints on hover",
    credits: ["Material 3 filled"],
  },
  "edge-tint": {
    label: "Edge + tint",
    description: "Edge darkens and background tints on hover",
    credits: ["Polaris"],
  },
})

export const HEIGHT_OPTIONS = options(HEIGHT_VALUES, {
  controls: {
    label: "Controls",
    description: "Same height as buttons",
    credits: ["shadcn", "Geist", "Linear", "Stripe", "Primer"],
  },
  step: {
    label: "One step taller",
    description: "4px taller than buttons",
    credits: ["Polaris", "Untitled UI", "Supabase"],
  },
  tall: {
    label: "Tall",
    description: "16px taller than buttons, roomy fields",
    credits: ["Material 3", "Airbnb"],
  },
})

export const OPTIONS = {
  inputStyle: STYLE_OPTIONS,
  inputHover: HOVER_OPTIONS,
  inputHeight: HEIGHT_OPTIONS,
}
