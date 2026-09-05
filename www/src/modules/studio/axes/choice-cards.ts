/* Choice cards — the card variant of the whole selection-control family
   (checkbox card, radio card, switch card), one treatment across all three.
   The control keeps the family Fill; the axes here are card-only.

   Engine: `card-selected` and `card-control` are enum params on `checkbox`,
   `radio-group` and `switch` (a synced group — one axis writes all three).
   Selected marks the chosen card with the selection tokens, so it follows
   the family Fill for free. */

import type { Resolved, StudioState } from "./index"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "outline",
  cardControl: "start",
}

/* An accent border, a tinted surface, or both; systems split roughly evenly. */
export const SELECTED_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "tint", label: "Tint" },
  { value: "outline-tint", label: "Both" },
]

/* Where the real check/radio/switch sits — or hidden, so the card treatment
   alone carries the state (the Ant selectable-card school). */
export const CONTROL_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "end", label: "End" },
  { value: "hidden", label: "Hidden" },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveChoiceCards(state: StudioState): Resolved {
  const selection = {
    "card-selected": pick(SELECTED_OPTIONS, state.cardSelected, "outline"),
    "card-control": pick(CONTROL_OPTIONS, state.cardControl, "start"),
  }
  return {
    params: {
      checkbox: selection,
      "radio-group": selection,
      switch: selection,
    },
  }
}
