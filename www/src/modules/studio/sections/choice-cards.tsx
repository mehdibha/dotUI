"use client"

/* Choice cards — the card variant of the whole selection-control family:
   checkbox card, radio card, switch card, one treatment across all three
   (the Geist Choicebox / Cloudscape Tiles pattern; Ant Pro ships it as
   CheckCard). The control colors stay synced to the family Fill; the axes
   here are card-only. Selected is what marks the chosen card — an accent
   border, a tinted surface, or both; systems split roughly evenly. Control
   is where the real check/radio sits — leading, trailing, or hidden entirely
   so the card treatment alone carries the state (the Ant selectable-card
   school); a switch card always trails its control. */

import { CONTROL_OPTIONS, SELECTED_OPTIONS } from "../axes/choice-cards"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio } from "../state"

export function ChoiceCardsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Selected"
        value={state.cardSelected}
        onChange={set("cardSelected")}
        options={SELECTED_OPTIONS}
      />
      <SegmentedControlRow
        label="Control"
        value={state.cardControl}
        onChange={set("cardControl")}
        options={CONTROL_OPTIONS}
      />
    </ControlGroup>
  )
}
