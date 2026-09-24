"use client"

/* Patterns built on the dial language: a pick from illustrated cards, and a
   palette color as a dot. */

import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"

/** A palette's color as a dot before an option label — an option that names a
 *  color should show it. */
export function PaletteDot({ color }: { color: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

/* -------------------------------- Card grid -------------------------------- */

export interface CardOption {
  id: string
  label: string
  /** The specimen under the label. */
  children: React.ReactNode
}

/** A pick from a few cards, two (or three) per row: a radio dot, a label, a
 *  specimen. `value` undefined selects nothing — a view over values off every
 *  card. */
export function CardGrid({
  label,
  value,
  onChange,
  options,
  columns = 2,
}: {
  label: string
  value: string | undefined
  onChange: (id: string) => void
  options: CardOption[]
  columns?: 2 | 3
}) {
  return (
    <RacToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className={cn(
        "grid gap-1.5",
        columns === 3 ? "grid-cols-3" : "grid-cols-2",
      )}
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.id}
          id={option.id}
          className="group/card flex cursor-interactive flex-col gap-2.5 rounded-lg tint-5 p-3 text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring selected:tint-10 selected:inset-ring-1 selected:inset-ring-fg/25"
        >
          <span className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full border border-fg/30 transition-[border-width] group-selected/card:border-4 group-selected/card:border-fg" />
            <span className="text-[13px] font-medium text-fg/85">
              {option.label}
            </span>
          </span>
          {option.children}
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
  )
}
