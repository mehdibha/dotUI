"use client"

/* Radio — the selection-control family's single-choice member. Always a
   circle, so its only axis is its Color. */

import { ControlGroup } from "../rows"
import type { Studio } from "../state"
import { FillRow } from "./checkbox"

export function RadioSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <FillRow studio={studio} field="radioColor" />
    </ControlGroup>
  )
}
