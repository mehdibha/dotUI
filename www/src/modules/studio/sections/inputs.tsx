"use client"

/* Inputs — the field family's axes. Style and hover are `input` params
   (axes/inputs.ts) and reach every field that renders through Input /
   InputGroup: TextArea, SearchField, Combobox, DateField, NumberField, OTP.
   Select's trigger is a Button and follows the Buttons chapter. Focus is
   owned by the Focus section. Labels always sit on top: float and
   placeholder-only failed review (a11y, systems moving away), inset is an
   InputGroup composition, not an axis.

   Error treatment moved to the Invalid section (a cross-component state, with
   Focus and Disabled). */

import { HOVER_OPTIONS, STYLE_OPTIONS } from "../axes/inputs"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function InputsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Style"
        value={state.inputStyle}
        onChange={set("inputStyle")}
        options={STYLE_OPTIONS}
      />
      <SelectRow
        label="Hover"
        value={state.inputHover}
        onChange={set("inputHover")}
        options={HOVER_OPTIONS}
      />
    </ControlGroup>
  )
}
