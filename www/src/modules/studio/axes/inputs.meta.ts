import { options } from "./core/meta"
import { HEIGHT_VALUES, HOVER_VALUES, STYLE_VALUES } from "./inputs"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  outline: {
    label: "Outline",
    credits: ["shadcn nova", "Geist", "Linear", "Stripe", "Spotify", "Polaris"],
  },
  raised: { label: "Raised", credits: ["Untitled UI", "shadcn vega"] },
  inset: { label: "Inset", credits: ["Primer", "Radix Themes"] },
  well: {
    label: "Well",
    credits: ["shadcn mira", "Supabase", "Notion", "Duolingo"],
  },
  filled: { label: "Filled", credits: ["shadcn luma", "Ant filled"] },
  indicator: { label: "Indicator", credits: ["Material 3 filled", "Carbon"] },
  underline: { label: "Underline", credits: ["shadcn sera"] },
})

export const HOVER_OPTIONS = options(HOVER_VALUES, {
  none: { label: "None", credits: ["shadcn", "Primer", "Radix", "Carbon"] },
  edge: {
    label: "Edge",
    credits: ["Geist", "Linear", "Stripe", "Spotify", "Claude"],
  },
  tint: { label: "Tint", credits: ["Material 3 filled"] },
  "edge-tint": { label: "Edge + tint", credits: ["Polaris"] },
})

export const HEIGHT_OPTIONS = options(HEIGHT_VALUES, {
  controls: {
    label: "Controls",
    credits: ["shadcn", "Geist", "Linear", "Stripe", "Primer"],
  },
  step: {
    label: "One step taller",
    credits: ["Polaris", "Untitled UI", "Supabase"],
  },
  tall: { label: "Tall", credits: ["Material 3", "Airbnb"] },
})

export const OPTIONS = {
  inputStyle: STYLE_OPTIONS,
  inputHover: HOVER_OPTIONS,
  inputHeight: HEIGHT_OPTIONS,
}
