// The frozen copies a system page shows, one file per copy at <slug>/<copy
// path>, read from the census a capture left in www/.scratch-refs/<slug>/. In
// dev, vite.config.ts serves them from there; `copies:upload` puts them on the
// Blob store the deployed site reads.
import fs from "node:fs"
import path from "node:path"

import type { PartFile, Snapshot } from "@dotui/capture/snapshot"

import { looksFileSchema } from "../src/data/looks"
import { specFileSchema } from "../src/data/spec"

const refsDir = path.resolve(import.meta.dirname, "../../www/.scratch-refs")
const systemsDir = path.resolve(import.meta.dirname, "../systems")

export function capturedSlugs() {
  return fs
    .readdirSync(systemsDir)
    .filter((slug) => fs.existsSync(path.join(systemsDir, slug, "looks.json")))
}

/** The copy paths a system's looks and spec grids reference, by census
 *  date: a path starts with the date of the census it came from. */
export function copyPaths(slug: string) {
  const read = (name: string) =>
    JSON.parse(fs.readFileSync(path.join(systemsDir, slug, name), "utf8"))
  const byDate = new Map<string, Set<string>>()
  const add = (copy: string | undefined) => {
    if (!copy) return
    const date = copy.split("/")[0] ?? ""
    if (!byDate.has(date)) byDate.set(date, new Set())
    byDate.get(date)?.add(copy)
  }
  const looks = looksFileSchema.parse(read("looks.json"))
  for (const component of Object.values(looks.components))
    for (const look of component.looks)
      for (const modes of Object.values(look.states))
        for (const reading of Object.values(modes)) add(reading?.copy)
  if (fs.existsSync(path.join(systemsDir, slug, "spec.json"))) {
    const spec = specFileSchema.parse(read("spec.json"))
    for (const component of Object.values(spec.components))
      for (const grid of component.grids)
        for (const cell of grid.cells)
          for (const modes of Object.values(cell.copies ?? {}))
            for (const copy of Object.values(modes)) add(copy)
  }
  return byDate
}

export function readCopy(slug: string, copy: string): Snapshot | undefined {
  const file = path.join(refsDir, slug, copy)
  if (!file.startsWith(path.join(refsDir, slug) + path.sep)) return undefined
  if (!fs.existsSync(file)) return undefined
  const part: PartFile = JSON.parse(fs.readFileSync(file, "utf8"))
  return part.snapshot
}
