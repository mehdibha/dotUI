"use client"

import { Fragment } from "react"

import { cn } from "@/registry/lib/utils"

import { CAPTION, stateProps } from "./board"
import type { StateName } from "./board"

export type Attrs = Record<string, string>

export const SELECTED: Attrs = { "data-selected": "true" }

/** A wide section beside a 23rem one on large screens, their boxes one height. */
export const SPLIT =
  "grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] [&>section>div]:flex-1"

/** Magnifies a 16px control so its corner and edge read. */
export const MAGNIFY = "[zoom:1.5] lg:[zoom:2]"

const LABEL: Record<StateName, string> = {
  rest: "Rest",
  hover: "Hover",
  pressed: "Pressed",
  focus: "Focus",
  selected: "Selected",
  disabled: "Disabled",
  invalid: "Invalid",
}

/** Frozen specimens, one row per value (off, on…) and one column per state; `lit` dims the other rows. */
export function StateGrid({
  rows,
  states,
  lit,
  column = "auto",
  className,
  children,
}: {
  rows: readonly { label: string; attrs: Attrs }[]
  states: readonly StateName[]
  lit?: readonly string[]
  /** Each state column's track. */
  column?: string
  className?: string
  children: (attrs: Attrs) => React.ReactNode
}) {
  return (
    <div
      inert
      className={cn(
        "grid items-center justify-center gap-x-4 gap-y-5 sm:gap-x-8",
        className,
      )}
      style={{
        gridTemplateColumns: `auto repeat(${states.length}, ${column})`,
      }}
    >
      <span />
      {states.map((state) => (
        <span key={state} className={cn(CAPTION, "text-center")}>
          {LABEL[state]}
        </span>
      ))}
      {rows.map((row) => {
        const dim = lit && !lit.includes(row.label)
        return (
          <Fragment key={row.label}>
            <span
              className={cn(
                CAPTION,
                "pe-1 transition-opacity duration-300",
                dim && "opacity-35",
              )}
            >
              {row.label}
            </span>
            {states.map((state) => (
              <span
                key={state}
                className={cn(
                  "flex justify-center transition-opacity duration-300",
                  dim && "opacity-35",
                )}
              >
                {children({ ...stateProps(state), ...row.attrs })}
              </span>
            ))}
          </Fragment>
        )
      })}
    </div>
  )
}
