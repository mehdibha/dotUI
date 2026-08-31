"use client"

/* Toggles — Toggle Button ⇄ Toggle Group, synced on one selected look. The
   family look and press/hover come from the Buttons section; the attached
   shell and its separator from Button groups. */

import { useState } from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { AttachedShell } from "./button-groups"
import {
  buttonRadiusPx,
  hoverFx,
  pressFx,
  SPECIMEN_FX,
  styleLook,
} from "./buttons"

export const TOGGLE_DEFAULTS = {
  toggleSelected: "fill",
}

const SELECTED_OPTIONS: SelectRowOption[] = [
  { value: "fill", label: "Fill" },
  { value: "chip", label: "Chip" },
  { value: "inverse", label: "Inverse" },
]

/* Chip is the container archetype's floating pill; the hairline ring keeps it
   reading on dark wells and flat surfaces alike. */
export function selectedFx(state: LabState): string {
  switch (state.toggleSelected) {
    case "chip":
      return "bg-bg text-fg shadow-sm ring-1 ring-border-control"
    case "inverse":
      return "bg-inverse text-fg-inverse"
    default:
      return "bg-selected text-fg-on-selected"
  }
}

/** A lone Toggle Button and a working single-select Toggle Group wearing the
 *  same selected look. */
export function ToggleHero({ state }: { state: LabState }) {
  const [starred, setStarred] = useState(true)
  const [view, setView] = useState("list")
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const selected = selectedFx(state)

  const standalone = (
    <button
      type="button"
      aria-label="Star"
      aria-pressed={starred}
      onClick={() => setStarred((s) => !s)}
      className={cn(
        "flex h-7 w-7 items-center justify-center",
        SPECIMEN_FX,
        starred
          ? cn(selected, hoverFx(state, "fill"), pressFx(state, "fill"))
          : cn(
              "text-fg-muted hover:text-fg",
              hoverFx(state, "quiet"),
              pressFx(state, "quiet"),
            ),
      )}
      style={{ borderRadius: radius }}
    >
      <StarIcon className={cn("size-3.5", starred && "fill-current")} />
    </button>
  )

  const segment = (id: string, label: string) => (
    <button
      key={id}
      type="button"
      aria-pressed={view === id}
      onClick={() => setView(id)}
      className={cn(
        "flex h-7 items-center px-3 text-xs font-medium",
        SPECIMEN_FX,
        view === id
          ? cn(selected, pressFx(state, "fill"))
          : cn("text-fg-muted hover:text-fg", pressFx(state, "quiet")),
      )}
    >
      {label}
    </button>
  )
  const segments = [
    ["list", "List"],
    ["grid", "Grid"],
    ["board", "Board"],
  ] as const

  return (
    <Hero className="items-center py-5">
      <div className="flex items-center gap-4">
        {standalone}
        <AttachedShell
          state={state}
          radius={radius}
          className={look.secondary}
          segments={segments.map(([id, label]) => segment(id, label))}
        />
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the selected look, the section's one axis. */
export function togglesSummary(state: LabState): string {
  const selected =
    SELECTED_OPTIONS.find((o) => o.value === state.toggleSelected)?.label ??
    state.toggleSelected
  return `${selected} selected`
}

export function TogglesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ToggleHero state={state} />
      <SelectRow
        label="Selected"
        value={state.toggleSelected}
        onChange={set("toggleSelected")}
        options={SELECTED_OPTIONS}
      />
    </ControlGroup>
  )
}
