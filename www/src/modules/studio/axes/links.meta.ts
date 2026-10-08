import { options } from "./core/meta"
import { LINK_COLOR_VALUES, UNDERLINE_VALUES } from "./links"

export const UNDERLINE_OPTIONS = options(UNDERLINE_VALUES, {
  always: {
    label: "Always",
    credits: ["Polaris", "Notion", "Supabase", "GOV.UK"],
  },
  hover: {
    label: "Hover",
    credits: ["Primer", "Carbon", "Radix Themes", "Geist"],
  },
  never: { label: "Never", credits: ["Stripe", "Duolingo", "Ant"] },
})

const LINK_COLOR_OPTIONS = options(LINK_COLOR_VALUES, {
  accent: {
    label: "Accent",
    credits: ["Carbon", "Stripe", "Polaris", "Geist"],
  },
  neutral: { label: "Neutral", credits: ["Supabase", "Notion", "Airbnb"] },
})

export const OPTIONS = {
  linkUnderline: UNDERLINE_OPTIONS,
  linkColor: LINK_COLOR_OPTIONS,
}
