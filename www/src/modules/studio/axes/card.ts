/* Card — what sets the footer apart. The container itself is Surfaces',
   the corners Shape's, the title Typography's.

   Engine: one enum param on `card`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CARD_DEFAULTS = {
  cardFooter: "none",
}

export const FOOTER_OPTIONS = [
  {
    value: "none",
    label: "None",
    credits: [
      "shadcn mira, vega, maia, luma, sera, rhea",
      "Radix Themes",
      "Polaris",
      "Fluent 2",
    ],
  },
  {
    value: "rule",
    label: "Rule",
    credits: ["shadcn lyra", "Primer", "Supabase", "Untitled UI"],
  },
  { value: "band", label: "Band", credits: ["shadcn nova", "Geist"] },
]

export const CARD_SCHEMA: ChapterSchema<typeof CARD_DEFAULTS> = {
  cardFooter: oneOf(FOOTER_OPTIONS),
}

export function resolveCard(state: Effective): Resolved {
  return { params: { card: { footer: state.cardFooter } } }
}

export const chapter = defineChapter({
  id: "card",
  defaults: CARD_DEFAULTS,
  schema: CARD_SCHEMA,
  resolve: resolveCard,
})
