"use client"

/* Tables — how a data grid separates its rows, and how loud its header row
   is. Two axes because real systems mix them freely. Separation: hairlines
   under every row is the modern default (shadcn, GitHub, Radix Themes);
   zebra striping survives in dense data tools and classic Bootstrap, where
   alternating fills carry the eye across wide rows without lines; plain
   drops both — the Linear list look, whitespace alone doing the work.
   Header: shadcn leaves it a bare muted-text line over the data, while Ant
   and Carbon paint a filled band (their gray-2/layer-accent) that anchors
   the columns before any row renders. */

import { HEADER_OPTIONS, SEPARATION_OPTIONS } from "../axes/tables"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio } from "../state"

export function TablesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Separation"
        value={state.tableSeparation}
        onChange={set("tableSeparation")}
        options={SEPARATION_OPTIONS}
      />
      <SegmentedControlRow
        label="Header"
        value={state.tableHeader}
        onChange={set("tableHeader")}
        options={HEADER_OPTIONS}
      />
    </ControlGroup>
  )
}
