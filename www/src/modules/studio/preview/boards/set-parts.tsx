"use client"

/* The canvas and component sets the Foundations boards share: a set at rest
   above and in the page's state below, framed the way design tools frame
   one, selected while the panel edits it. */

import { cn } from "@/registry/lib/utils"

// Figma's selection blue.
const SELECTION = "#0D99FF"

// A dot-grid canvas filling the preview; the bottom clears the toolbar.
export const CANVAS =
  "min-h-dvh max-w-none cursor-default items-center justify-center bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] px-6 pt-10 pb-20 sm:px-10"

/** The sets, in a 2×2 grid that stacks on narrow screens. */
export function SetGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      inert
      className="grid w-full max-w-4xl grid-cols-2 gap-8 max-md:grid-cols-1"
    >
      {children}
    </div>
  )
}

export function ComponentSet({
  name,
  selected,
  rows,
}: {
  name: string
  selected: boolean
  rows: React.ReactNode[]
}) {
  const color = selected ? SELECTION : undefined
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span
        className={cn(
          "text-[11px] leading-none font-medium",
          !selected && "text-fg-muted",
        )}
        style={{ color }}
      >
        {name}
      </span>
      <div
        className={cn(
          "flex flex-col gap-6 rounded-md border border-dashed bg-bg p-6 transition-colors duration-150 max-sm:p-4",
          !selected && "border-fg-muted/40",
        )}
        style={{ borderColor: color }}
      >
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}
