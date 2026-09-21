"use client"

/* Switch — the selection-control family's on/off member. Always a pill, so
   its only axis is its Color — the one Geist forks: near-black checkboxes,
   a blue toggle. */

import { ControlGroup } from "../rows"
import type { Studio } from "../state"
import { FillRow } from "./checkbox"

export function SwitchSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <FillRow studio={studio} field="switchColor" />
    </ControlGroup>
  )
}
