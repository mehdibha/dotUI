/* Choice cards — the card variant of the whole selection-control family
   (checkbox card, radio card, switch card), one treatment across all three.
   The control keeps the family Fill; the axes here are card-only.

   Engine: `card-selected` is an enum param on `checkbox`, `radio-group` and
   `switch` (a synced group — one axis writes all three); every value paints
   with the selection tokens, so the card follows the family Fill. Tint is the
   registry's default — the muted surface + soft edge today's cards ship.
   `card-control` reaches the box and the dot only: Start leaves the control
   where the markup puts it, End and Hidden reorder or drop the indicator. A
   switch card always trails its control. */

import type { Resolved, StudioState } from "./index"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "tint",
  cardControl: "start",
}

/* An accent border, a tinted surface, or both; systems split roughly evenly. */
export const SELECTED_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "tint", label: "Tint" },
  { value: "outline-tint", label: "Both" },
]

/* Where the real check/radio sits — or hidden, so the card treatment alone
   carries the state (the Ant selectable-card school). */
export const CONTROL_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "end", label: "End" },
  { value: "hidden", label: "Hidden" },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveChoiceCards(state: StudioState): Resolved {
  const selected = pick(SELECTED_OPTIONS, state.cardSelected, "tint")
  const box = {
    "card-selected": selected,
    "card-control": pick(CONTROL_OPTIONS, state.cardControl, "start"),
  }
  return {
    params: {
      checkbox: box,
      "radio-group": box,
      switch: { "card-selected": selected },
    },
  }
}
