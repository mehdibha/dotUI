/* Choice cards — the card variant of the whole selection-control family
   (checkbox card, radio card, switch card), one treatment across all three.
   The control keeps the family Fill; the axes here are card-only.

   Engine: `card-selected` is an enum param on `checkbox`, `radio-group` and
   `switch` (a synced group — one axis writes all three); every value paints
   with the selection tokens, so the card follows the family Fill.
   `card-control` reaches the box and the dot only; a switch card always
   trails its control. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "tint",
  cardControl: "start",
}

export const SELECTED_OPTIONS = [
  {
    value: "outline",
    label: "Outline",
    description:
      "The card's 1px border turns the selection color; the surface stays " +
      "as is.",
    seenIn: ["Radix Themes", "Chakra UI"],
  },
  {
    value: "tint",
    label: "Tint",
    description:
      "A muted selection-color wash with a soft border at 25% of the " +
      "selection color.",
    seenIn: ["Chakra UI"],
  },
  {
    value: "outline-tint",
    label: "Both",
    description: "The muted wash plus a full-strength selection-color border.",
  },
]

export const CONTROL_OPTIONS = [
  {
    value: "start",
    label: "Start",
    description: "The checkbox or radio leads, before the label.",
  },
  {
    value: "end",
    label: "End",
    description:
      "The checkbox or radio moves to the trailing edge, the label pushed " +
      "to the start.",
    seenIn: ["Radix Themes"],
  },
  {
    value: "hidden",
    label: "Hidden",
    description:
      "No checkbox or radio is drawn; the card treatment alone shows the " +
      "state.",
    seenIn: ["Radix Themes", "Chakra UI"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

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

export const CHOICE_CARD_SPEC = {
  label: "Choice cards",
  description:
    "Checkbox, radio and switch rendered as bordered cards (the control " +
    "with a label): how a chosen card looks, and where its control sits.",
  axes: {
    cardSelected: {
      label: "Selected",
      description:
        "How a chosen card differs from the rest. Every option paints with " +
        "the selection tokens, so it follows the controls' Fill.",
      value: { type: "enum", options: SELECTED_OPTIONS },
      guidance:
        "Radix Themes marks a chosen radio card with a 2px accent outline " +
        "only; Chakra UI defaults to an accent outline and offers tinted " +
        "variants (subtle, surface). Outline stays crisp in dense forms; a " +
        "tint reads better at a glance on large pricing or plan cards.",
    },
    cardControl: {
      label: "Control",
      description:
        "Where the checkbox or radio sits in its card, or whether it shows " +
        "at all. Switch cards always put the switch at the end.",
      value: { type: "enum", options: CONTROL_OPTIONS },
      guidance:
        "Radix Themes is split by control: checkbox cards pin the box to " +
        "the trailing edge, radio cards draw no radio at all. Chakra UI " +
        "documents a no-indicator card. Hide the control only when the " +
        "selected treatment is strong enough to carry the state alone.",
    },
  },
} satisfies ChapterSpec<typeof CHOICE_CARD_DEFAULTS>
