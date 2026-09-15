"use client"

/* Buttons — the synced family's shared axes: Button sets the look that
   Button groups and Toggles reuse. Style is a family look reshaping every
   fill variant at once; the variant enum stays API. */

import {
  HOVER_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
  STYLE_OPTIONS,
} from "../axes/buttons"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Style"
        value={state.buttonStyle}
        onChange={set("buttonStyle")}
        options={STYLE_OPTIONS}
      />
      <SelectRow
        label="Radius"
        value={state.buttonRadius}
        onChange={set("buttonRadius")}
        options={RADIUS_OPTIONS}
      />
      <SelectRow
        label="Hover"
        value={state.buttonHover}
        onChange={set("buttonHover")}
        options={HOVER_OPTIONS}
      />
      <SelectRow
        label="Press"
        value={state.buttonPress}
        onChange={set("buttonPress")}
        options={PRESS_OPTIONS}
      />
    </ControlGroup>
  )
}
