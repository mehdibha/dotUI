import { options } from "./core/meta"
import { LINK_COLOR_VALUES, UNDERLINE_VALUES } from "./links"

export const UNDERLINE_OPTIONS = options(UNDERLINE_VALUES, {
  always: {
    label: "Always",
    description: "Links are always underlined",
    credits: ["Polaris", "Notion", "Supabase", "GOV.UK"],
  },
  hover: {
    label: "Hover",
    description: "Underline appears on hover only",
    credits: ["Primer", "Carbon", "Radix Themes", "Geist"],
  },
  never: {
    label: "Never",
    description: "No underline, color alone marks links",
    credits: ["Stripe", "Duolingo", "Ant"],
  },
})

const LINK_COLOR_OPTIONS = options(LINK_COLOR_VALUES, {
  accent: {
    label: "Accent",
    description: "Links in the brand color",
    credits: ["Carbon", "Stripe", "Polaris", "Geist"],
  },
  neutral: {
    label: "Neutral",
    description: "Text-colored links in medium weight",
    credits: ["Supabase", "Notion", "Airbnb"],
  },
})

export const OPTIONS = {
  linkUnderline: UNDERLINE_OPTIONS,
  linkColor: LINK_COLOR_OPTIONS,
}
