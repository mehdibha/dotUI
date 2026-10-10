/* Import a DESIGN.md as a starting studio state: deterministic, no LLM.
   What maps lands in `state`; everything else is reported, so the report
   doubles as evidence for the axes the studio is missing. */

import type { StudioStateInput } from "../axes"
import { mapDesignMd } from "./map"
import { parseDesignMd } from "./parse"

export type ImportStatus = "mapped" | "approximated" | "unmapped"

export type ImportCategory =
  | "color"
  | "typography"
  | "shape"
  | "space"
  | "surfaces"
  | "components"
  | "icons"
  | "links"
  | "layout"
  | "motion"

export interface ImportItem {
  /** Stable benchmark key: `^[a-z-]+(:[a-z0-9-]+)?$`. */
  id: string
  category: ImportCategory
  /** One line for the dialog. */
  label: string
  /** Where it came from: "colors.primary", "prose: Elevation & Depth"… */
  source?: string
  keys?: (keyof StudioStateInput)[]
  /** What the file says. */
  value?: string
  /** What dotUI applied. */
  result?: string
  /** Approximated only: how far off, "ΔE 0.031", "36px vs 40px". */
  delta?: string
}

export interface DesignMdImport {
  name?: string
  /** Only keys the file informs; every value passes SCHEMA. */
  state: Partial<StudioStateInput>
  report: {
    mapped: ImportItem[]
    approximated: ImportItem[]
    unmapped: ImportItem[]
  }
  /** Parse-level notes, never counted. */
  warnings: string[]
  source: "frontmatter" | "prose" | "none"
}

export async function importDesignMd(text: string): Promise<DesignMdImport> {
  return mapDesignMd(await parseDesignMd(text))
}

export { impliedTint } from "./color"
export { cleanImportName } from "./map"
export { fitDensity, fitRadius } from "./shape"
