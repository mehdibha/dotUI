import { notFound } from '@tanstack/react-router'

import rawIndex from './__generated__/index.json'
import type { DataIndex, SystemWithColors } from './schema'

export const dataIndex = rawIndex as unknown as DataIndex

/** Loader helper for system exploration pages: the researched system or a 404. */
export function getSystem(slug: string): SystemWithColors {
  const system = dataIndex.systems.find((s) => s.slug === slug)
  if (!system) throw notFound()
  return system
}
