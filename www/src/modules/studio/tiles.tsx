"use client"

/* A key's options laid out in place as preview tiles, on a surface: the
   label and the picked option's name over a grid of cards, the picked one
   ringed. For drill-in pages, where the
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
  /** The option's name: the row's value when picked. */
  label: string
  /** The option drawn: fills the tile. */
  tile: React.ReactNode
  /** A line under the tile, such as a CSS name. */
  caption?: string
}

const TILE =
  "group flex min-w-0 cursor-interactive flex-col gap-1.5 outline-none disabled:cursor-default disabled:opacity-50"

/* Cards on the surface, ringed like the Focus color swatches; the ring's gap
   is the surface (tint-5). */
const PREVIEW =
  "relative flex h-16 items-center justify-center overflow-hidden rounded-md bg-(--panel-surface,var(--color-card)) ring-offset-2 ring-offset-[color-mix(in_oklab,var(--color-fg)_5%,var(--panel-surface,var(--color-card)))] transition-colors group-hover:tint-3 group-focus-visible:focus-ring group-selected:ring-2 group-selected:ring-fg/70"

export function DialTiles({
  axis: key,
  label: labelProp,
  value: valueProp,
  onChange,
  options,
  columns = 2,
}: {
  axis: AxisKey
  label: string
  /** A pick that writes several keys: its value and change, over `axis`'s. */
  value?: string
  onChange?: (value: string) => void
  options: DialTile[]
  columns?: 2 | 3
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude } = useAxisGate(key)
  const ref = useRef<HTMLDivElement>(null)
  if (hidden) return null
  const value = valueProp ?? String(axis?.effective)
  const cause = pinned ?? exclude?.cause
  return (
    <div
      ref={ref}
      data-axis={key}
      // The board frames the set this key draws while the pointer is here.
      onPointerEnter={() => holdEditFocus(ref.current)}
      onFocus={() => holdEditFocus(ref.current)}
      className="flex flex-col rounded-lg tint-5 pb-3"
    >
      <span className="flex h-9 items-center justify-between gap-3 px-3">
        <span className="flex min-w-0 items-center gap-2">
          <span className={cn(DIAL_LABEL, pinned && "opacity-50")}>
            {label}
          </span>
          {cause && <CauseChip cause={cause} />}
        </span>
        <span className="truncate font-mono text-[13px] font-medium text-fg/60">
          {options.find((o) => o.value === value)?.label ?? value}
        </span>
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
          if (onChange) onChange(String(next))
          else axis?.set(String(next))
        }}
        className={cn(
          "grid gap-x-2 gap-y-3 px-3 outline-none",
          columns === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {options.map((option) => (
          <RacListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            // The inert specimen is hidden from assistive tech: name the tile.
            aria-label={option.label}
            className={TILE}
          >
            {/* Specimens are pictures: presses land on the tile. */}
            <span inert className={PREVIEW}>
              {option.tile}
            </span>
            {option.caption && (
              <span className="truncate px-0.5 text-xs font-medium text-fg/55 group-selected:text-fg/90">
                {option.caption}
              </span>
            )}
          </RacListBoxItem>
        ))}
      </RacListBox>
    </div>
  )
}
