/* Choice cards — the card mode of checkbox, radio-group and switch: one
   `card-selected` param written to all three (the recipe's single source is
   CHOICE_CARD in the checkbox styles). Every value paints with the selection
   tokens; Accent re-declares them on the card as a `choice-card` recipe
   scope, so the check inside follows. Where the control sits is markup, not
   an axis. */

import { SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "tint",
  cardColor: "same" as "same" | "neutral" | "accent",
}

/* Tint: a soft edge on a tinted surface (shadcn). Edged tint: a 1px
   edge on the tint (Geist, Claude; nearest for Duolingo and Airbnb, whose
   edge is 2px). Outline: a 2px edge, no tint (Radix Themes, Stripe,
   Untitled UI; nearest for Carbon and Notion, whose edge is 1px). */
export const SELECTED_VALUES = ["tint", "outline-tint", "outline"] as const

export const CHOICE_CARD_SCHEMA: ChapterSchema<typeof CHOICE_CARD_DEFAULTS> = {
  cardSelected: oneOf(SELECTED_VALUES),
  cardColor: oneOf(SOURCE_VALUES),
}

export function resolveChoiceCards(state: Effective): Resolved {
  const card = { "card-selected": state.cardSelected }
  return {
    params: { checkbox: card, "radio-group": card, switch: card },
    // Accent cards beside neutral checks (Geist); else each control's own fill.
    color:
      state.cardColor === "accent" && state.checkboxColor !== "accent"
        ? { scopes: { "choice-card": "accent" } }
        : undefined,
  }
}

export const chapter = defineChapter({
  id: "choice-cards",
  defaults: CHOICE_CARD_DEFAULTS,
  schema: CHOICE_CARD_SCHEMA,
  resolve: resolveChoiceCards,
  follows: {
    cardColor: [{ kind: "same", id: "same", from: "checkboxColor" }],
  },
  rules: [
    // Accent checks already paint the cards accent.
    {
      id: "choice-cards/accent-checks-hide-card-color",
      target: "cardColor",
      when: { key: "checkboxColor", in: ["accent"] },
      effect: { kind: "hide" },
      cause: "checkboxColor",
    },
  ],
})
