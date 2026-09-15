"use client"

/* Toggles — Toggle Button ⇄ Toggle Group, synced on one selected look. The
   family look and press/hover come from the Buttons section; the attached
   shell and its separator from Button groups. */

import { SELECTED_OPTIONS } from "../axes/toggles"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function TogglesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Selected"
        value={state.toggleSelected}
        onChange={set("toggleSelected")}
        options={SELECTED_OPTIONS}
      />
    </ControlGroup>
  )
}
