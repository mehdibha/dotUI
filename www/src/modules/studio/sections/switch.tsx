"use client"

/* Switch — the selection-control family's on/off member; always a pill, so
   its only axis is the family's synced Fill, owned by the Checkbox chapter.
   Geist is Neutral at the checkbox (gray-1000) but forks its Toggle to
   --geist-success — the same switch-forks-to-success pattern as iOS, Carbon
   and Atlassian green toggles. A verified minority (2026-08), candidate axis
   (switch tint: follow | success), not yet approved. */

import { cn } from "@/registry/lib/utils"

import { ControlGroup } from "../rows"
import type { Studio } from "../state"
import { FillRow } from "./checkbox"
import type { CheckFill } from "./checkbox"

/* -------------------------------- Specimen --------------------------------- */

export function DemoSwitch({
  on = true,
  fill,
}: {
  on?: boolean
  fill: CheckFill
}) {
  return (
    <span
      className={cn(
        "flex h-4 w-7 shrink-0 items-center rounded-full p-0.5",
        on ? cn("justify-end", fill.track) : "justify-start bg-border",
      )}
    >
      <span className={cn("size-3 rounded-full", on ? fill.thumb : "bg-bg")} />
    </span>
  )
}

export function SwitchSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <FillRow studio={studio} />
    </ControlGroup>
  )
}
