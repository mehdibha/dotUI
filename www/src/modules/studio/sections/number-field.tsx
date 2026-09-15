"use client"

/* Number field — where the steppers sit (axes/number-field.ts). The steppers
   are attached segments beside the field, as the registry ships them; the
   field look comes from the Inputs section. */

import { NUMBER_LAYOUT_OPTIONS } from "../axes/number-field"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function NumberFieldSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Steppers"
        value={state.numberLayout}
        onChange={set("numberLayout")}
        options={NUMBER_LAYOUT_OPTIONS}
      />
    </ControlGroup>
  )
}
