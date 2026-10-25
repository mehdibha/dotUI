"use client"

/* A key's options laid out in place as preview tiles: the row's title over a
   grid of specimens, the picked one ringed. For drill-in pages, where the
   preview each option draws is the comparison. */

import { useRef } from "react"
import {
  ListBox as RacListBox,
  ListBoxItem as RacListBoxItem,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { DIAL_LABEL } from "./dial"
import { holdEditFocus } from "./focus"
import { useRowLabel } from "./row-host"
import { CauseChip, useAxisGate } from "./use-axis"
import type { AxisKey } from "./use-axis"

export interface DialTile {
  value: string
  label: string
  /** The option drawn: fills the tile. */
  tile: React.ReactNode
}

const TILE =
  "group flex min-w-0 cursor-interactive flex-col gap-1.5 outline-none disabled:cursor-default disabled:opacity-50"

/* Rings like the Focus color swatches. */
const PREVIEW =
  "relative flex h-16 items-center justify-center overflow-hidden rounded-lg tint-5 ring-offset-2 ring-offset-(--panel-surface,var(--color-card)) transition-colors group-hover:tint-10 group-focus-visible:focus-ring group-selected:ring-2 group-selected:ring-fg/70"

export function DialTiles({
  axis: key,
  label: labelProp,
  options,
  columns = 2,
}: {
  axis: AxisKey
  label: string
  options: DialTile[]
  columns?: 2 | 3
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude } = useAxisGate(key)
  const ref = useRef<HTMLDivElement>(null)
  if (hidden) return null
  const value = String(axis?.effective)
  const cause = pinned ?? exclude?.cause
  return (
    <div
      ref={ref}
      data-axis={key}
      // The board frames the set this key draws while the pointer is here.
      onPointerEnter={() => holdEditFocus(ref.current)}
      onFocus={() => holdEditFocus(ref.current)}
      className="flex flex-col gap-1 pb-1.5"
    >
      <span className="flex h-9 items-center gap-2 px-3">
        <span className={cn(DIAL_LABEL, pinned && "opacity-50")}>{label}</span>
        {cause && <CauseChip cause={cause} />}
      </span>
      <RacListBox
        aria-label={label}
        layout="grid"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        disabledKeys={pinned ? options.map((o) => o.value) : exclude?.options}
        onSelectionChange={(keys) => {
          if (keys === "all") return
          const next = keys.values().next().value
          if (next === undefined) return
          holdEditFocus(ref.current)
          axis?.set(String(next))
        }}
        className={cn(
          "grid gap-x-2 gap-y-3 px-1 outline-none",
          columns === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {options.map((option) => (
          <RacListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            className={TILE}
          >
            {/* Specimens are pictures: presses land on the tile. */}
            <span inert className={PREVIEW}>
              {option.tile}
            </span>
            <span className="truncate px-0.5 text-xs font-medium text-fg/55 group-selected:text-fg/90">
              {option.label}
            </span>
          </RacListBoxItem>
        ))}
      </RacListBox>
    </div>
  )
}
