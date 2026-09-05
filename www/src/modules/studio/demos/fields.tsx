"use client"

/* Field-family illustrations — monochrome anatomy schematics (see ink.tsx). */

import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

/** A closed select: value word and caret in a bare shell. */
export function PickersDemo() {
  return (
    <span className="flex h-7 w-24 shrink-0 items-center gap-2 rounded-lg border border-fg/30 px-2.5">
      <span className="flex-1 truncate text-[11px] font-medium text-fg/80">
        Monthly
      </span>
      <ChevronDownIcon className="size-3 shrink-0 text-fg/50" />
    </span>
  )
}

/** A month as a dot grid, one day chosen. */
export function CalendarDemo() {
  return (
    <span className="flex shrink-0 flex-col gap-[5px]">
      {[0, 1, 2].map((row) => (
        <span key={row} className="flex gap-[5px]">
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <span
              key={col}
              className={cn(
                "size-1.5 rounded-full",
                row === 1 && col === 3 ? "bg-fg/80" : "bg-fg/20",
              )}
            />
          ))}
        </span>
      ))}
    </span>
  )
}

/** Track, fill and the outline-circle handle. */
export function SlidersDemo() {
  return (
    <span className="relative flex h-4 w-24 shrink-0 items-center">
      <span className="h-1 w-full overflow-hidden rounded-full bg-fg/15">
        <span className="block h-full w-3/5 rounded-full bg-fg/75" />
      </span>
      <span className="absolute left-[60%] size-3.5 -translate-x-1/2 rounded-full border-2 border-fg/75 bg-bg" />
    </span>
  )
}
