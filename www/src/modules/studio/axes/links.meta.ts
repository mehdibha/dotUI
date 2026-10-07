import { options } from "./core/meta"
import { LINK_COLOR_VALUES, UNDERLINE_VALUES } from "./links"

export const UNDERLINE_OPTIONS = options(UNDERLINE_VALUES, {
  always: { label: "Always", description: "Polaris, Notion, Supabase, GOV.UK" },
  hover: { label: "Hover", description: "Primer, Carbon, Radix Themes, Geist" },
  never: { label: "Never", description: "Stripe, Duolingo, Ant" },
})

export const LINK_COLOR_OPTIONS = options(LINK_COLOR_VALUES, {
  accent: { label: "Accent", description: "Carbon, Stripe, Polaris, Geist" },
  neutral: { label: "Neutral", description: "Supabase, Notion, Airbnb" },
})

export const OPTIONS = {
  linkUnderline: UNDERLINE_OPTIONS,
  linkColor: LINK_COLOR_OPTIONS,
}
