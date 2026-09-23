"use client"

import { createPersistedStore } from "@/lib/persisted-store"

import { DEFAULT_PRESET, decodePreset, encodePreset } from "./codec"
import type { StudioPreset } from "./codec"

/**
 * The user's design system, persisted as the same compact string /studio uses
 * in its `?preset=` param (see codec.ts) so presets round-trip between the two.
 * The /studio page writes it as the user customizes; docs previews read it live.
 * `encodePreset` returns undefined when everything matches the defaults, which
 * clears the key instead of storing an empty diff.
 */
const presetStore = createPersistedStore<StudioPreset>(
  "dotui:preset",
  DEFAULT_PRESET,
  {
    decode: decodePreset,
    encode: (preset) => encodePreset(preset) ?? null,
  },
)

export const loadStoredPreset = presetStore.get
export const saveStoredPreset = presetStore.set
export const useStoredPreset = presetStore.useValue

/** The working system's name; empty until the user picks or names one. */
const nameStore = createPersistedStore<string>("dotui:design-system-name", "", {
  decode: (raw) => raw,
  encode: (name) => name,
})

export const saveDesignSystemName = nameStore.set
export const useDesignSystemName = nameStore.useValue
