"use client"

/* A key's options laid out in place on a surface, each with what it does:
   the label and the picked option's name over the list. For drill-in pages,
   where a few options read better whole than behind a popover. */

import { useRef } from "react"

import { cn } from "@/registry/lib/utils"

import { DIAL_LABEL, DialPickList } from "./dial"
import { holdEditFocus } from "./focus"
import { useRowLabel } from "./row-host"
import { CauseChip, useAxisGate } from "./use-axis"
import type { AxisKey } from "./use-axis"

interface Choice {
  value: string
  label: string
  description?: string
  /** After the label, such as where a followed pick comes from. */
  aside?: React.ReactNode
}

export function DialChoices({
  axis: key,
  label: labelProp,
  value: valueProp,
  onChange,
  options,
}: {
  axis: AxisKey
  label: string
  /** The pick shown, when it isn't the key's effective value. */
  value?: string
  onChange?: (value: string) => void
  options: Choice[]
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
      className="flex flex-col rounded-lg tint-5 px-1.5 pb-1.5"
    >
      <span className="flex h-9 items-center justify-between gap-3 px-1.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className={cn(DIAL_LABEL, pinned && "opacity-50")}>
            {label}
          </span>
          {cause && <CauseChip cause={cause} />}
        </span>
        <span className="truncate text-[13px] font-medium text-fg/60">
          {options.find((o) => o.value === value)?.label ?? value}
        </span>
      </span>
      <DialPickList
        label={label}
        value={value}
        onChange={(next) => {
          holdEditFocus(ref.current)
          if (onChange) onChange(next)
          else axis?.set(next)
        }}
        options={options}
        disabledKeys={pinned ? options.map((o) => o.value) : exclude?.options}
      />
    </div>
  )
}
