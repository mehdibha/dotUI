"use client"

/* Links — two axes, see axes/links.ts. The combos are left honest:
   neutral + never barely reads. */

import { SOURCE_OPTIONS } from "../axes/color"
import { UNDERLINE_OPTIONS } from "../axes/links"
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
        options={SOURCE_OPTIONS}
      />
    </ControlGroup>
  )
}
