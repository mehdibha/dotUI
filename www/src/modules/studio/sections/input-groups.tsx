"use client"

/* Input groups — the Buttons→Group analog: how a prefix/suffix sits in the
   field (axes/input-groups.ts). The field look comes from the Inputs section. */

import {
  ADDON_DIVIDER_OPTIONS,
  ADDON_LAYOUT_OPTIONS,
} from "../axes/input-groups"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function InputGroupsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Layout"
        value={state.addonLayout}
        onChange={set("addonLayout")}
        options={ADDON_LAYOUT_OPTIONS}
      />
      {state.addonLayout === "boxed" && (
        <SelectRow
          label="Divider"
          value={state.addonDivider}
          onChange={set("addonDivider")}
          options={ADDON_DIVIDER_OPTIONS}
        />
      )}
    </ControlGroup>
  )
}
