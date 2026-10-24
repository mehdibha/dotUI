import { notFound } from "@tanstack/react-router"

import rawIndex from "./__generated__/index.json"
import type {
  ComponentDef,
  DataIndex,
  SystemComponent,
  SystemEntry,
} from "./schema"

export const dataIndex = rawIndex as unknown as DataIndex

/** Loader helper for system exploration pages: the researched system or a 404. */
export function getSystem(slug: string): SystemEntry {
  const system = dataIndex.systems.find((s) => s.slug === slug)
  if (!system) throw notFound()
  return system
}

/** One system's take on a canonical component. */
export interface ComponentExample {
  system: SystemEntry
  entry: SystemComponent
  /** Path under public/ where build-demos.ts materialized the live demo. */
  demoSrc: string | null
}

// Inverted index: canonical component slug → every system's example of it.
const examplesByComponent = new Map<string, ComponentExample[]>()
for (const system of dataIndex.systems) {
  for (const entry of system.components?.components ?? []) {
    if (entry.component === null) continue
    const list = examplesByComponent.get(entry.component) ?? []
    list.push({
      system,
      entry,
      demoSrc: entry.demo
        ? `/demos/${system.slug}/${entry.component}.html`
        : null,
    })
    examplesByComponent.set(entry.component, list)
  }
}
for (const list of examplesByComponent.values()) {
  list.sort((a, b) => a.system.name.localeCompare(b.system.name))
}

export function getComponentExamples(slug: string): ComponentExample[] {
  return examplesByComponent.get(slug) ?? []
}

/** Loader helper for component pages: the canonical component or a 404. */
export function getComponentDef(slug: string): ComponentDef {
  const def = dataIndex.componentsCatalog.find((c) => c.slug === slug)
  if (!def) throw notFound()
  return def
}
