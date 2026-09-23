/* The built-in presets, resolved. Pages that must not load the resolver (the
   landing) read the precomputed __generated__/catalog.ts instead. */

import type { StudioState } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { BUILT_INS, loadRevision } from "./built-ins"
import type { PresetMeta, PresetRevision } from "./built-ins"

/** A preset's latest revision, precomputed for the pages that show it. */
export interface PresetSummary extends PresetMeta {
  rev: number
  designSystem: DesignSystem
}

export interface Preset extends PresetSummary {
  state: StudioState
}

export const PRESETS: Preset[] = BUILT_INS.map(({ revisions, ...meta }) => {
  const latest = revisions.at(-1) as PresetRevision
  const { state } = loadRevision(latest)
  return {
    ...meta,
    rev: latest.rev,
    state,
    designSystem: resolveDesignSystem(state),
  }
})

/** The default preset: its latest revision is the axis defaults. */
export const ORIGIN = PRESETS[0] as Preset
