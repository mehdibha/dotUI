"use client"

import { createPersistedStore } from "@/lib/persisted-store"
import { DEFAULT_STATE, formatIssues } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import { decodeState, encodeState } from "./codec"

/**
 * The user's design system, persisted as the same compact string /studio uses
 * in its `?preset=` param (see codec.ts) so presets round-trip between the two.
 * The /studio page writes it as the user customizes; docs previews read it live.
 * `encodeState` returns undefined when everything matches the defaults, which
 * clears the key instead of storing an empty diff.
 */
const presetStore = createPersistedStore<StudioState>(
  "dotui:preset",
  DEFAULT_STATE,
  {
    // A stored preset that no longer validates reads as the fallback.
    decode: (raw) => {
      const result = decodeState(raw)
      if (!result.ok) throw new Error(formatIssues(result.issues))
      return result.state
    },
    encode: (state) => encodeState(state) ?? null,
  },
)

export const loadStoredPreset = presetStore.get
export const saveStoredPreset = presetStore.set
export const useStoredPreset = presetStore.useValue

/** Shown for a design system the user hasn't named — first-time users start
 *  on the Origin preset, so the unnamed fallback carries its name. */
export const DEFAULT_DESIGN_SYSTEM_NAME = "Origin"

const nameStore = createPersistedStore<string>(
  "dotui:design-system-name",
  DEFAULT_DESIGN_SYSTEM_NAME,
  {
    decode: (raw) => raw,
    encode: (name) => name,
  },
)

export const saveDesignSystemName = nameStore.set
export const useDesignSystemName = nameStore.useValue
