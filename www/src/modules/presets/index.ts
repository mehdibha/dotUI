import type { StudioState } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { airbnb } from "./airbnb"
import { claude } from "./claude"
import { github } from "./github"
import { linear } from "./linear"
import { notion } from "./notion"
import { origin } from "./origin"
import type { Preset, PresetMeta } from "./preset"
import { spotify } from "./spotify"
import { stripe } from "./stripe"
import { supabase } from "./supabase"
import { vercel } from "./vercel"

export type { Preset, PresetMeta }

export const PRESETS: Preset[] = [
  origin,
  claude,
  supabase,
  stripe,
  linear,
  vercel,
  airbnb,
  github,
  notion,
  spotify,
]

/** The default preset — what /studio starts on for first-time users. */
export const ORIGIN = origin

/** What pickers list; a preview resolves its preset on demand. */
export const PRESET_META: PresetMeta[] = PRESETS.map(
  ({ state: _, ...meta }) => meta,
)

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id)

/** The built-in whose state differs from `state` in the fewest axes. */
export function closestPreset(state: StudioState): Preset {
  let closest = ORIGIN
  let fewest = Infinity
  for (const preset of PRESETS) {
    const differing = (Object.keys(state) as (keyof StudioState)[]).filter(
      (key) => state[key] !== preset.state[key],
    ).length
    if (differing < fewest) {
      closest = preset
      fewest = differing
    }
  }
  return closest
}

const resolved = new Map<string, DesignSystem>()

/** A built-in's design system, resolved on first use. */
export function resolvePreset(id: string): DesignSystem {
  let designSystem = resolved.get(id)
  if (!designSystem) {
    const preset = getPreset(id)
    if (!preset) throw new Error(`Unknown preset "${id}"`)
    designSystem = resolveDesignSystem(preset.state)
    resolved.set(id, designSystem)
  }
  return designSystem
}
