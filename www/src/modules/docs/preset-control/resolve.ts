'use client'

import { DEFAULTS, type DesignSystem } from '@/modules/create/preset'
import { useStoredPreset } from '@/modules/create/preset/storage'
import { PRESETS } from '@/modules/presets/presets-data'

import { useSelectedPreset, YOURS } from './store'

/**
 * The design system the demos should render in, resolved from the global
 * selection: `'yours'` follows the preset built at /create (read live so demos
 * still react to customizing there), every other id maps to a curated preset.
 * Falls back to defaults if a stale id no longer matches a preset.
 */
export function useResolvedPreset(): DesignSystem {
  const selected = useSelectedPreset()
  // Always read the stored preset (hooks must run unconditionally); it's only
  // used when the selection is "your design system".
  const yours = useStoredPreset()

  if (selected === YOURS) return yours
  return PRESETS.find((p) => p.id === selected)?.designSystem ?? DEFAULTS
}

/** The accent seed of a preset, for the selector's swatch (undefined = use site primary). */
export function presetAccent(id: string): string | undefined {
  if (id === YOURS) return undefined
  return PRESETS.find((p) => p.id === id)?.designSystem.color?.seeds.accent
}
