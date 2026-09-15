"use client"

/* Radio — the selection-control family's single-choice member. It has no
   geometry of its own (a radio is always a circle) so its only axis is the
   family's synced Fill, owned by the Checkbox chapter. */

import { cn } from "@/registry/lib/utils"

import { ControlGroup } from "../rows"
import type { Studio } from "../state"
import { FillRow } from "./checkbox"
import type { CheckFill } from "./checkbox"

/* -------------------------------- Specimen --------------------------------- */

export function DemoRadio({
  selected,
  fill,
}: {
  selected?: boolean
  fill: CheckFill
}) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full",
        selected ? fill.box : "border border-border",
      )}
    >
      {selected && <span className={cn("size-1.5 rounded-full", fill.dot)} />}
    </span>
  )
}

export function RadioSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <FillRow studio={studio} />
    </ControlGroup>
  )
}
