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
  // Stable benchmark key: `^[a-z-]+(:[a-z0-9-]+)?$`.
  id: string
  category: ImportCategory
  label: string
  source?: string
  keys?: (keyof StudioStateInput)[]
  value?: string
  result?: string
  delta?: string
}

export interface DesignMdImport {
  name?: string
  state: Partial<StudioStateInput>
  report: {
    mapped: ImportItem[]
    approximated: ImportItem[]
    unmapped: ImportItem[]
  }
  // Parse-level notes, never counted.
  warnings: string[]
  source: "frontmatter" | "prose" | "none"
}

export async function importDesignMd(text: string): Promise<DesignMdImport> {
  return mapDesignMd(await parseDesignMd(text))
}

export { impliedTint } from "./color"
export { cleanImportName } from "./map"
export { fitDensity, fitRadius } from "./shape"
