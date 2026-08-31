"use client"

/* Button groups — action grouping as one control. Always attached: gapped is
   per-usage spacing, a prop not a system decision, and the container+chip
   archetype is Segmented Control, a different component. The separator is the
   section's one axis, shared by every attached group (Toggles reuses the
   shell). The family look comes from the Buttons section. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import {
  buttonRadiusPx,
  hoverFx,
  pressFx,
  SPECIMEN_FX,
  styleLook,
} from "./buttons"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto",
}

const SEPARATOR_OPTIONS: SelectRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "divider", label: "Divider" },
  { value: "none", label: "None" },
]

/** Attached grouping shared by Button Group and Toggle Group: one container,
 *  square segments, the separator axis deciding what divides them. */
export function AttachedShell({
  state,
  radius,
  className,
  segments,
}: {
  state: LabState
  radius: number
  className?: string
  segments: React.ReactNode[]
}) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden",
        state.groupSeparator === "auto" && "divide-x divide-border-control",
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-stretch">
          {state.groupSeparator === "divider" && i > 0 && (
            <span className="my-1.5 w-px bg-border-control" />
          )}
          {seg}
        </span>
      ))}
    </div>
  )
}

/** Cut/Copy/Paste as one control, wearing the secondary skin on the shell. */
export function ButtonGroupHero({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const actions = ["Cut", "Copy", "Paste"]

  return (
    <Hero className="items-center py-5">
      <AttachedShell
        state={state}
        radius={radius}
        className={look.secondary}
        segments={actions.map((label) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex h-8 items-center px-3 text-[0.8125rem] font-medium",
              SPECIMEN_FX,
              hoverFx(state, "quiet"),
              pressFx(state, "quiet"),
            )}
          >
            {label}
          </button>
        ))}
      />
    </Hero>
  )
}

/** Collapsed-row summary: the separator treatment, the section's one axis. */
export function buttonGroupsSummary(state: LabState): string {
  const sep =
    SEPARATOR_OPTIONS.find((o) => o.value === state.groupSeparator)?.label ??
    state.groupSeparator
  return state.groupSeparator === "none" ? "No separator" : `${sep} separator`
}

export function ButtonGroupsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ButtonGroupHero state={state} />
      <SelectRow
        label="Separator"
        value={state.groupSeparator}
        onChange={set("groupSeparator")}
        options={SEPARATOR_OPTIONS}
      />
    </ControlGroup>
  )
}
