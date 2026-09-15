"use client"

/* Button groups — action grouping as one control. Always attached: gapped is
   per-usage spacing, a prop not a system decision, and the container+chip
   archetype is Segmented Control, a different component. The separator is the
   section's one axis, shared by every attached group. The family look comes
   from the Buttons section. */

import { SEPARATOR_OPTIONS } from "../axes/button-groups"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function ButtonGroupsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Separator"
        value={state.groupSeparator}
        onChange={set("groupSeparator")}
        options={SEPARATOR_OPTIONS}
      />
    </ControlGroup>
  )
}
