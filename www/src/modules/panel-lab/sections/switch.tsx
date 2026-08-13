"use client"

/* Switch — the selection-control family's on/off member; always a pill, so
   its only axis is the family's synced Fill, owned by the Checkbox chapter.
   Geist is Neutral at the checkbox (gray-1000) but forks its Toggle to
   --geist-success — the same switch-forks-to-success pattern as iOS, Carbon
   and Atlassian green toggles. A verified minority (2026-08), candidate axis
   (switch tint: follow | success), not yet approved. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { FillRow, fillOf, HERO_ROW } from "./checkbox"
import type { CheckFill } from "./checkbox"

export const SWITCH_DEFAULTS = {
  checkFill: "accent",
}

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

/* ---------------------------------- Hero ----------------------------------- */

function SwitchHero({ state }: { state: LabState }) {
  const fill = fillOf(state)
  return (
    <Hero className="gap-3 p-4">
      <label className={cn(HERO_ROW, "justify-between")}>
        Auto-save
        <DemoSwitch fill={fill} />
      </label>
      <label className={cn(HERO_ROW, "justify-between")}>
        Usage analytics
        <DemoSwitch on={false} fill={fill} />
      </label>
    </Hero>
  )
}

export function SwitchSection({ lab }: { lab: Lab }) {
  return (
    <ControlGroup>
      <SwitchHero state={lab.state} />
      <FillRow lab={lab} />
    </ControlGroup>
  )
}
