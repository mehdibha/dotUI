"use client"

/* Surfaces — the chapter's panel. The recipe lives in the axis module; this
   file paints it. */

import { cn } from "@/registry/lib/utils"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

import {
  CANVAS_OPTIONS,
  DEPTH_OPTIONS,
  EDGE_OPTIONS,
  MATERIAL_OPTIONS,
  SHADOW_OPTIONS,
  STRATEGY_OPTIONS,
  SURFACE_DEFAULTS,
} from "../axes/surfaces"
import { DetailRow } from "../patterns"
import { ControlGroup, ROW, ROW_LABEL, SegmentedControlRow } from "../rows"
import type { SegmentedRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

/** Five named options don't fit beside a label at row width, so the strategy
 *  row stacks: label line on top, full-width segments beneath. */
function StackedSegmentedRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SegmentedRowOption[]
}) {
  return (
    <div
      data-row=""
      className={cn(ROW, "flex h-auto flex-col items-stretch gap-2 px-4 py-3")}
    >
      <span className={ROW_LABEL}>{label}</span>
      <SegmentedControl
        aria-label={label}
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) onChange(next as string)
        }}
        className="w-full bg-bg/50 p-0.5"
      >
        {options.map((option) => (
          <SegmentedControlItem
            key={option.value}
            id={option.value}
            className="min-w-0 flex-1 justify-center px-1 text-xs"
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

const label = (options: SegmentedRowOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

/** Collapsed-row summary: the separation strategy. */
export function surfacesSummary(state: StudioState): string {
  return (
    STRATEGY_OPTIONS.find((o) => o.value === state.surfaceStrategy)?.label ??
    state.surfaceStrategy
  )
}

const DETAIL_ROWS = [
  { key: "surfaceShadow", label: "Shadow", options: SHADOW_OPTIONS },
  { key: "surfaceEdge", label: "Edge", options: EDGE_OPTIONS },
  { key: "surfaceCanvas", label: "Canvas", options: CANVAS_OPTIONS },
] as const

export function SurfacesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const details = DETAIL_ROWS.filter(
    (row) => state[row.key] !== SURFACE_DEFAULTS[row.key],
  ).map((row) => label(row.options, state[row.key]))
  return (
    <>
      <ControlGroup>
        <StackedSegmentedRow
          label="Separation"
          value={state.surfaceStrategy}
          onChange={set("surfaceStrategy")}
          options={STRATEGY_OPTIONS}
        />
        <SegmentedControlRow
          label="Depth"
          value={state.surfaceDepth}
          onChange={set("surfaceDepth")}
          options={DEPTH_OPTIONS}
        />
        <SegmentedControlRow
          label="Material"
          description="Menus, popovers and dialogs."
          value={state.surfaceMaterial}
          onChange={set("surfaceMaterial")}
          options={MATERIAL_OPTIONS}
        />
      </ControlGroup>
      <DetailRow
        label="Details"
        summary={details.length > 0 ? details.join(" · ") : "Default"}
      >
        {DETAIL_ROWS.map((row) => (
          <SegmentedControlRow
            key={row.key}
            label={row.label}
            value={state[row.key]}
            onChange={set(row.key)}
            options={row.options}
          />
        ))}
      </DetailRow>
    </>
  )
}
