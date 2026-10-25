import { notFound } from "@tanstack/react-router"

import rawIndex from "./__generated__/index.json"
import type { CapturedSystem, DataIndex, SystemEntry } from "./schema"

export const dataIndex = rawIndex as unknown as DataIndex

/** Loader helper for system exploration pages: the researched system or a 404. */
export function getSystem(slug: string): SystemEntry {
  const system = dataIndex.systems.find((s) => s.slug === slug)
  if (!system) throw notFound()
  return system
}

/** A row of the directory: a system with a page. Live ones render their real
 *  components from their published packages; captured ones were read off the
 *  real product. A system can be both. */
export interface DirectoryRow {
  slug: string
  name: string
  org?: string
  live?: SystemEntry
  captured?: CapturedSystem
}

const catalogOf = (slug: string) =>
  dataIndex.catalog.find(
    (entry) => entry.slug === slug || entry.preset === slug,
  )

const slugs = new Set([
  ...dataIndex.looks.map((looks) => looks.slug),
  ...dataIndex.systems.map((system) => system.slug),
])

/** Captured systems first, the current focus; then by name. */
export const directory: DirectoryRow[] = [...slugs]
  .map((slug) => {
    const live = dataIndex.systems.find((system) => system.slug === slug)
    const captured = dataIndex.looks.find((looks) => looks.slug === slug)
    const entry = catalogOf(slug)
    return {
      slug,
      name: live?.name ?? entry?.name ?? captured?.name ?? slug,
      org: live?.org ?? entry?.org,
      live,
      captured,
    }
  })
  .sort(
    (a, b) =>
      Number(!!b.captured) - Number(!!a.captured) ||
      a.name.localeCompare(b.name),
  )
