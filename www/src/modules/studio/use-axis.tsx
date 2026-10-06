"use client"

/* One key as the panel sees it: what was picked, what it resolves to, and
   why (axes/core). Dial primitives take an `axis` and wire the rest:
   hidden rows render nothing, pinned rows dim behind their cause chip,
   excluded options disable with one. */

import { createContext, useContext } from "react"
import { Button as RacButton } from "react-aria-components"

import { effective, FOLLOWS, SCHEMA } from "./axes"
import type { StudioState } from "./axes"
import type { Explained } from "./axes/core/types"
import { edit, useCurrent } from "./selection"

export type AxisKey = keyof StudioState & string

export interface Axis {
  key: AxisKey
  saved: unknown
  effective: unknown
  explain: Explained
  /** The follow ids the key accepts ("auto", "same"). */
  follows: string[]
  set: (value: unknown) => void
}

export function useAxis(key: AxisKey): Axis
export function useAxis(key: AxisKey | undefined): Axis | undefined
export function useAxis(key: AxisKey | undefined): Axis | undefined {
  const { state } = useCurrent()
  if (!key) return
  const { values, explain } = effective(state)
  return {
    key,
    saved: state[key],
    effective: values[key],
    explain: explain[key] ?? { saved: state[key], effective: values[key] },
    follows: (FOLLOWS[key] ?? []).map((follow) => follow.id),
    set: (value) => edit({ ...state, [key]: value }),
  }
}

/** A value as its row names it: the option label, else the value. */
export function valueLabel(key: AxisKey, value: unknown): string {
  const schema = SCHEMA[key]?.value
  if (schema?.type === "enum") {
    const option = schema.options.find((o) => o.value === value) as
      | { label?: string }
      | undefined
    if (option?.label) return option.label
  }
  if (typeof value === "boolean") return value ? "On" : "Off"
  return String(value)
}

/** Scrolls to a key's row and flashes it; the page swaps in a reveal that
 *  first opens the row's chapter or page. */
export const RevealAxis = createContext<(key: AxisKey) => void>(flashAxis)

export function flashAxis(key: string): boolean {
  const row = document.querySelector(`[data-axis="${key}"]`)
  if (!row) return false
  row.scrollIntoView({ block: "nearest" })
  row.animate(
    {
      boxShadow: [
        "inset 0 0 0 1.5px var(--color-accent)",
        "inset 0 0 0 1.5px transparent",
      ],
    },
    { duration: 1200, easing: "ease-in" },
  )
  return true
}

/** The value of the row that set this one, as a link to that row. */
export function CauseChip({ cause }: { cause: string }) {
  const reveal = useContext(RevealAxis)
  const axis = useAxis(cause as AxisKey)
  return (
    <RacButton
      onPress={() => reveal(axis.key)}
      onPointerDown={(e) => e.stopPropagation()}
      className="pointer-events-auto flex h-5 shrink-0 cursor-interactive items-center rounded-md bg-fg/8 px-1.5 text-xs font-medium text-fg/70 focus-reset transition-colors hover:bg-fg/12 focus-visible:focus-ring"
    >
      {valueLabel(axis.key, axis.effective)}
    </RacButton>
  )
}

/** How a primitive renders its key right now. */
export function useAxisGate(key: AxisKey | undefined) {
  const axis = useAxis(key)
  const lock = axis?.explain.lock
  return {
    axis,
    hidden: lock?.kind === "hide" && !lock.part,
    pinned: lock?.kind === "pin" ? lock.cause : undefined,
    exclude: axis?.explain.exclude,
    /** The follow id the row reads through, while it does. */
    following: axis?.explain.via,
  }
}
