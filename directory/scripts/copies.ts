// The frozen copies a system page shows, one file per system and census date:
// { [copy path]: Snapshot }, built from the census a capture left in
// www/.scratch-refs/<slug>/. In dev, vite.config.ts serves them from there;
// `copies:upload` puts them on the Blob store the deployed site reads.
import fs from "node:fs"
import path from "node:path"

import type { PartFile, Snapshot } from "@dotui/capture/snapshot"

import { looksFileSchema } from "../src/data/looks"

const refsDir = path.resolve(import.meta.dirname, "../../www/.scratch-refs")
const systemsDir = path.resolve(import.meta.dirname, "../systems")

export function capturedSlugs() {
  return fs
    .readdirSync(systemsDir)
    .filter((slug) => fs.existsSync(path.join(systemsDir, slug, "looks.json")))
}

/** The copy paths a system's looks reference, by census date: a path starts
 *  with the date of the census it came from. */
export function copyPaths(slug: string) {
  const file = path.join(systemsDir, slug, "looks.json")
  const looks = looksFileSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")))
  const byDate = new Map<string, Set<string>>()
  for (const component of Object.values(looks.components)) {
    for (const look of component.looks) {
      for (const modes of Object.values(look.states)) {
        for (const reading of Object.values(modes)) {
          if (!reading?.copy) continue
          const date = reading.copy.split("/")[0] ?? ""
          if (!byDate.has(date)) byDate.set(date, new Set())
          byDate.get(date)?.add(reading.copy)
        }
      }
    }
  }
  return byDate
}

export function bundleCopies(slug: string, paths: Iterable<string>) {
  const copies: Record<string, Snapshot> = {}
  const missing: string[] = []
  for (const copy of paths) {
    const file = path.join(refsDir, slug, copy)
    const part: PartFile | undefined = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, "utf8"))
      : undefined
    if (part?.snapshot) copies[copy] = part.snapshot
    else missing.push(copy)
  }
  return { copies, missing }
}
