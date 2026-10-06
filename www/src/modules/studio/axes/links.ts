/* Links — the one link recipe: links, link buttons, and breadcrumb
   ancestors drawn as links. Color is a leaf of Color's Primary (Same as ink
   until Emphasis lands).

   Engine: `underline` and `color` enum params on `link` (its default
   variant), `linkUnderline` and `linkColor` on `button` and `toggle-button`
   (their link variant); breadcrumbs fold both into `ancestors`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const LINK_DEFAULTS = {
  linkUnderline: "never",
  linkColor: "accent",
}

/* Descriptions credit the systems each option is copied from. */
export const UNDERLINE_OPTIONS = [
  {
    value: "always",
    label: "Always",
    description: "Polaris, Notion, Supabase, GOV.UK",
  },
  {
    value: "hover",
    label: "Hover",
    description: "Primer, Carbon, Radix Themes, Geist",
  },
  { value: "never", label: "Never", description: "Stripe, Duolingo, Ant" },
]

// Primer's, Duolingo's, Polaris' and Geist's blue links beside other fills
// need their own ink (Emphasis).
export const LINK_COLOR_OPTIONS = [
  {
    value: "accent",
    label: "Accent",
    description: "Carbon, Stripe, Polaris, Geist",
  },
  {
    value: "neutral",
    label: "Neutral",
    description: "Supabase, Notion, Airbnb",
  },
]

export const LINK_SCHEMA: ChapterSchema<typeof LINK_DEFAULTS> = {
  linkUnderline: oneOf(UNDERLINE_OPTIONS),
  linkColor: oneOf(LINK_COLOR_OPTIONS),
}

export function resolveLinks(state: Effective): Resolved {
  return {
    params: {
      link: { underline: state.linkUnderline, color: state.linkColor },
      button: {
        linkUnderline: state.linkUnderline,
        linkColor: state.linkColor,
      },
      "toggle-button": {
        linkUnderline: state.linkUnderline,
        linkColor: state.linkColor,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "links",
  defaults: LINK_DEFAULTS,
  schema: LINK_SCHEMA,
  resolve: resolveLinks,
})
