"use client"

/* Rows by key: each section exports its own, any page hosts them. */

import { createContext, useContext } from "react"

import type { AxisKey } from "./use-axis"

/** Each key's one row, exported by the section that owns it. */
export type RowMap = Partial<Record<AxisKey, React.ComponentType>>

/** `ALL_ROWS`, provided by the panel so sections never import each other. */
export const RowsContext = createContext<RowMap>({})

/** A host's name for the row it renders; popovers reset it. */
export const RowLabel = createContext<string | undefined>(undefined)

/** The row's label, as its host names it. */
export const useRowLabel = (label: string) => useContext(RowLabel) ?? label

/** A key's row, hosted anywhere: it edits that key everywhere. */
export function Row({ axis, label }: { axis: AxisKey; label?: string }) {
  const Component = useContext(RowsContext)[axis]
  if (!Component) return null
  return (
    <RowLabel.Provider value={label}>
      <Component />
    </RowLabel.Provider>
  )
}
