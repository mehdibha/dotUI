"use client"

/* Segmented control — the container+chip archetype Tabs and Button groups
   both exile here (tabs-in-a-track is not a tab style; a chip in a shared
   well is not a button group). Selected: how the chip reads against the
   track — raised, a page-colored chip lifted on shadow (iOS
   UISegmentedControl, Radix Themes, Ant Design Segmented, shadcn Tabs) vs
   flat, tone-on-tone fill with no lift (Linear, Geist — dotUI today:
   bg-selected with a whisper of shadow) vs inverse, the selected segment
   snapping to full contrast (Carbon Content Switcher, pricing toggles).
   Track: filled well (iOS, shadcn, Linear) vs outline — hairline boundary,
   no fill (Carbon, Material 3 segmented buttons). The axes compose: filled +
   raised is iOS, outline + flat is M3's tonal segmented button, outline +
   inverse is Carbon. Rejected: underline-in-a-track — no shipping system
   found; the underline is Tabs' line signature (tabs.tsx). Idle-segment
   separators — iOS's hairlines travel with the raised treatment, derived.
   Gapped/detached segments — Toggle group territory. Fluid vs hug width —
   per-usage prop. Size and radius — Space and Shape. */

import { useState } from "react"

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "flat",
  segmentedTrack: "filled",
}

const TRACK_SHELL = {
  filled: "bg-muted",
  outline: "border border-border",
}

/* Raised keeps the hairline ring so the bg-on-bg chip survives dark wells —
   same rationale as the Toggles chip. */
const SELECTED_FX = {
  raised: "bg-bg text-fg shadow-sm ring-1 ring-border-field",
  flat: "bg-selected text-fg-on-selected",
  inverse: "bg-inverse text-fg-inverse",
}

/* ------------------------------ Option glyphs ------------------------------ */

/* One ladder: chip weight rises raised → flat → inverse; raised alone gets a
   stroked edge — the light chip reads as a cutout on its darker track. */
function SelectedGlyph({ look }: { look: keyof typeof SELECTED_FX }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="7"
        width="19"
        height="10"
        rx="5"
        fill="currentColor"
        opacity={look === "raised" ? ".3" : ".15"}
      />
      {look === "raised" ? (
        <rect
          x="4.75"
          y="9"
          width="8"
          height="6"
          rx="3"
          fill="currentColor"
          opacity=".08"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      ) : (
        <rect
          x="4.5"
          y="8.75"
          width="8.5"
          height="6.5"
          rx="3.25"
          fill="currentColor"
          opacity={look === "inverse" ? "1" : ".45"}
        />
      )}
    </svg>
  )
}

const SELECTED_OPTIONS: SelectRowOption[] = [
  {
    value: "raised",
    label: "Raised",
    illustration: <SelectedGlyph look="raised" />,
  },
  { value: "flat", label: "Flat", illustration: <SelectedGlyph look="flat" /> },
  {
    value: "inverse",
    label: "Inverse",
    illustration: <SelectedGlyph look="inverse" />,
  },
]

const TRACK_OPTIONS = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
]

/* ---------------------------------- Hero ----------------------------------- */

const PERIODS = [
  ["day", "Day"],
  ["week", "Week"],
  ["month", "Month"],
] as const

export function SegmentedHero({ state }: { state: LabState }) {
  const [period, setPeriod] = useState("week")
  return (
    <Hero className="items-center py-5">
      <div
        className={cn(
          "flex items-center rounded-lg p-[3px]",
          TRACK_SHELL[state.segmentedTrack as keyof typeof TRACK_SHELL],
        )}
      >
        {PERIODS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={period === id}
            onClick={() => setPeriod(id)}
            className={cn(
              "flex h-7 items-center rounded-md px-3 text-[0.8125rem] font-medium",
              period === id
                ? SELECTED_FX[
                    state.segmentedSelected as keyof typeof SELECTED_FX
                  ]
                : "text-fg-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the chip treatment, and the track shell. */
export function segmentedControlSummary(state: LabState): string {
  const selected =
    SELECTED_OPTIONS.find((o) => o.value === state.segmentedSelected)?.label ??
    state.segmentedSelected
  const track =
    TRACK_OPTIONS.find((o) => o.value === state.segmentedTrack)?.label ??
    state.segmentedTrack
  return `${selected} chip · ${track} track`
}

export function SegmentedControlSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SegmentedHero state={state} />
      <SelectRow
        label="Selected"
        value={state.segmentedSelected}
        onChange={set("segmentedSelected")}
        options={SELECTED_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Track"
        value={state.segmentedTrack}
        onChange={set("segmentedTrack")}
        options={TRACK_OPTIONS}
      />
    </ControlGroup>
  )
}
