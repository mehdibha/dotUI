/* Choice cards — the card mode of checkbox, radio-group and switch, one
   `card-selected` param written to all three (the recipe's single source is
   CHOICE_CARD in the checkbox styles). Every value paints with the selection
   tokens, so the card follows the family fill. Where the control sits is
   markup, not an axis. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "tint",
}

/* Tint: a soft edge on a tinted surface (shadcn). Outline + tint: Geist,
   Duolingo, Airbnb, Claude. Outline: a 2px edge, no tint (Radix Themes,
   Stripe, Untitled UI). */
export const SELECTED_OPTIONS = [
  { value: "tint", label: "Tint" },
  { value: "outline-tint", label: "Outline + tint" },
  { value: "outline", label: "Outline" },
]

export const CHOICE_CARD_SCHEMA: ChapterSchema<typeof CHOICE_CARD_DEFAULTS> = {
  cardSelected: oneOf(SELECTED_OPTIONS),
}

export function resolveChoiceCards(state: Effective): Resolved {
  const card = { "card-selected": state.cardSelected }
  return { params: { checkbox: card, "radio-group": card, switch: card } }
}

export const chapter = defineChapter({
  id: "choice-cards",
  defaults: CHOICE_CARD_DEFAULTS,
  schema: CHOICE_CARD_SCHEMA,
  resolve: resolveChoiceCards,
})
