import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"

import { airbnb } from "./airbnb"
import { carbon } from "./carbon"
import { claude } from "./claude"
import { duolingo } from "./duolingo"
import { github } from "./github"
import { linear } from "./linear"
import { material3 } from "./material3"
import { notion } from "./notion"
import { origin } from "./origin"
import { polaris } from "./polaris"
import type { Preset, PresetMeta } from "./preset"
import { radix } from "./radix"
import { spotify } from "./spotify"
import { stripe } from "./stripe"
import { supabase } from "./supabase"
import { untitled } from "./untitled"
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
  duolingo,
  polaris,
  material3,
  radix,
  untitled,
  carbon,
]

/** The default preset — what /studio starts on for first-time users. */
export const ORIGIN = origin

/** What pickers list; a preview resolves its preset on demand. */
export const PRESET_META: PresetMeta[] = PRESETS.map(
  ({ state: _, diff: __, ...meta }) => meta,
)

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id)

const resolved = new Map<string, DesignSystem>()

/** A built-in's design system, resolved on first use. */
export function resolvePreset(id: string): DesignSystem {
  let designSystem = resolved.get(id)
  if (!designSystem) {
    const preset = getPreset(id)
    if (!preset) throw new Error(`Unknown preset "${id}"`)
    designSystem = designSystemOf(preset.state)
    resolved.set(id, designSystem)
  }
  return designSystem
}
