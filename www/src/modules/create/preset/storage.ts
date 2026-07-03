'use client'

import { createPersistedStore } from '@/lib/persisted-store'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'
import type { DesignSystem } from './types'

/**
 * The user's design system, persisted as the same compact string /create uses
 * in its `?preset=` param (see codec.ts) so presets round-trip between the two.
 * The /create page writes it as the user customizes; docs previews read it live.
 * `encodePreset` returns undefined when everything matches the defaults, which
 * clears the key instead of storing an empty diff.
 */
const presetStore = createPersistedStore<DesignSystem>(
  'dotui:preset',
  DEFAULTS,
  {
    decode: decodePreset,
    encode: (ds) => encodePreset(ds) ?? null,
  },
)

export const loadStoredPreset = presetStore.get
export const saveStoredPreset = presetStore.set
export const useStoredPreset = presetStore.useValue

/** Shown for a design system the user hasn't named. */
export const DEFAULT_DESIGN_SYSTEM_NAME = 'Untitled'

const nameStore = createPersistedStore<string>(
  'dotui:design-system-name',
  DEFAULT_DESIGN_SYSTEM_NAME,
  {
    decode: (raw) => raw,
    encode: (name) => name,
  },
)

export const saveDesignSystemName = nameStore.set
export const useDesignSystemName = nameStore.useValue
