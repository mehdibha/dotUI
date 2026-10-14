import { parseState } from "@/modules/studio/axes"
import type { StudioState, StudioStateInput } from "@/modules/studio/axes"

/** A built-in, read-only starting point: a diff over Origin (the defaults). */
export interface Preset {
  id: string
  name: string
  description: string
  /** Curated dot color, legible on light and dark surfaces. */
  swatch: string
  /** The brand a preset recreates; absent for dotUI's own. */
  inspiredBy?: string
  /** Only the keys that differ from Origin. */
  diff: Partial<StudioStateInput>
  /** The diff over the defaults, validated. */
  state: StudioState
}

export type PresetMeta = Omit<Preset, "state" | "diff">

export function definePreset({
  diff,
  ...meta
}: PresetMeta & { diff: Partial<StudioStateInput> }): Preset {
  return { ...meta, diff, state: parseState(diff) }
}
