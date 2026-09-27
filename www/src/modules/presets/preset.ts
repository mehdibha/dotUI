import { DEFAULTS, parseState } from "@/modules/studio/axes"
import type { StudioState, StudioStateInput } from "@/modules/studio/axes"
import type { MotionValues } from "@/modules/studio/axes/motion-presets"

/** A built-in, read-only starting point. */
export interface Preset {
  id: string
  name: string
  description: string
  /** Curated dot color, legible on light and dark surfaces. */
  swatch: string
  /** The brand a preset recreates; absent for dotUI's own. */
  inspiredBy?: string
  state: StudioState
}

export type PresetMeta = Omit<Preset, "state">

/** Every axis is written out: a missing or unknown key is a type error. */
export function definePreset({
  state,
  ...meta
}: PresetMeta & { state: StudioStateInput }): Preset {
  return { ...meta, state: parseState(state) }
}

/** Every component's default motion, for a preset to spread. */
export const DEFAULT_MOTION = Object.fromEntries(
  Object.entries(DEFAULTS).filter(([key]) => key.endsWith("Motion")),
) as MotionValues
