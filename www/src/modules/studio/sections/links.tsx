"use client"

/* Links — two axes, see axes/links.ts. The combos are left honest:
   foreground + never barely reads. */

import { COLOR_OPTIONS, UNDERLINE_OPTIONS } from "../axes/links"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio } from "../state"

export function LinksSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Underline"
        value={state.linkUnderline}
        onChange={set("linkUnderline")}
        options={UNDERLINE_OPTIONS}
      />
      <SegmentedControlRow
        label="Color"
        value={state.linkColor}
        onChange={set("linkColor")}
        options={COLOR_OPTIONS}
      />
    </ControlGroup>
  )
}
