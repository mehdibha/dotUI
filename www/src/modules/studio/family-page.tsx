"use client"

/* A family page's parts. */

import { createContext, useContext } from "react"

import type { AxisKey } from "./use-axis"

/** Each key's one row, exported by the section that owns it. */
export type RowMap = Partial<Record<AxisKey, React.ComponentType>>

/** `ALL_ROWS`, provided by the panel so sections never import each other. */
export const RowsContext = createContext<RowMap>({})

/** A key's page, by its short label. */
export const PlaceLabel = createContext<(key: AxisKey) => string | undefined>(
  () => undefined,
)

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

/** A member's rows under its name; `/studio#<family>/<id>` lands here. */
export function MemberSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      data-member={id}
      aria-label={title}
      className="mt-2.5 flex scroll-mt-2 flex-col gap-1.5"
    >
      <span className="px-1 text-xs font-medium text-fg-muted">{title}</span>
      {children}
    </section>
  )
}
