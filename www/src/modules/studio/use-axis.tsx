"use client"

/* One key as the panel sees it: what was picked, what it resolves to, and
   why (axes/core). Dial primitives take an `axis` and wire the rest:
   hidden rows render nothing, pinned rows dim behind their cause chip,
   excluded options disable with one. */

import { createContext, useContext } from "react"

import { effective, FOLLOWS } from "./axes"
import type { StudioState } from "./axes"
import type { Explained } from "./axes/core/types"
import { OPTIONS } from "./axes/meta"
import { edit, useCurrent } from "./selection"

export type AxisKey = keyof StudioState & string

export interface Axis {
  key: AxisKey
  saved: unknown
  effective: unknown
  explain: Explained
  /** The follow ids the key accepts ("auto", "same", "style"). */
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
    set: (value) => edit({ ...state, [key]: value } as StudioState),
  }
}

/** A value as its row names it: the option label, else the value. */
export function valueLabel(key: AxisKey, value: unknown): string {
  const option = OPTIONS[key]?.find((o) => o.value === value)
  if (option) return option.label
  if (typeof value === "boolean") return value ? "On" : "Off"
  return String(value)
}

/** Scrolls to a key's row and flashes it; the page swaps in a reveal that
 *  first opens the row's chapter or page. */
export const RevealAxis = createContext<(key: AxisKey) => void>(flashAxis)

/** Scrolls a row into view and flashes it. */
export function revealRow(row: Element) {
  requestAnimationFrame(() => {
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
  })
}

/** The key's row, or the row whose popover edits it; false when neither is
 *  on screen. */
export function flashAxis(key: string): boolean {
  const row = [
    ...document.querySelectorAll(
      `[data-axis="${key}"], [data-holds~="${key}"]`,
    ),
  ].find((el) => el.checkVisibility())
  if (!row) return false
  revealRow(row)
  return true
}

/** A small action inside a row. A plain button on purpose: inside a Select
 *  or ListBox a RAC Button would pick up the trigger's context; it also
 *  keeps a slider row from starting a drag. */
export function ChipButton({
  onPress,
  children,
}: {
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onPress()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="pointer-events-auto flex h-5 shrink-0 cursor-interactive items-center rounded-md bg-fg/8 px-1.5 font-sans text-xs font-medium text-fg/70 focus-reset transition-colors hover:bg-fg/12 focus-visible:focus-ring"
    >
      {children}
    </button>
  )
}

/** The cause row's value, linking to it. */
export function CauseChip({ cause }: { cause: string }) {
  const reveal = useContext(RevealAxis)
  const axis = useAxis(cause as AxisKey)
  return (
    <ChipButton onPress={() => reveal(axis.key)}>
      {valueLabel(axis.key, axis.effective)}
    </ChipButton>
  )
}

/** How a primitive renders its key right now. */
export function useAxisGate(key: AxisKey | undefined) {
  const axis = useAxis(key)
  const lock = axis?.explain.lock
  return {
    axis,
    hidden: lock?.kind === "hide",
    pinned: lock?.kind === "pin" ? lock.cause : undefined,
    exclude: axis?.explain.exclude,
    /** The cause of an exclusion the saved value falls in. */
    held:
      axis?.explain.rule && axis.explain.rule === axis.explain.exclude?.rule
        ? axis.explain.exclude.cause
        : undefined,
    /** The follow id the row reads through, while it does. */
    following: axis?.explain.via,
  }
}
