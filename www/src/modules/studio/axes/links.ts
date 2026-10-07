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

export const UNDERLINE_VALUES = ["always", "hover", "never"] as const

// Primer's, Duolingo's, Polaris' and Geist's blue links beside other fills
// need their own ink (Emphasis).
export const LINK_COLOR_VALUES = ["accent", "neutral"] as const

export const LINK_SCHEMA: ChapterSchema<typeof LINK_DEFAULTS> = {
  linkUnderline: oneOf(UNDERLINE_VALUES),
  linkColor: oneOf(LINK_COLOR_VALUES),
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
