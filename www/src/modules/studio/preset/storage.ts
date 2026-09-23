"use client"

import { createPersistedStore } from "@/lib/persisted-store"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import { decodeState, encodeState } from "./codec"

/**
 * The user's design system, persisted as the same compact string /studio uses
 * in its `?preset=` param (see codec.ts) so presets round-trip between the two.
 * The /studio page writes it as the user customizes; docs previews read it live.
 * `encodeState` returns undefined for the default system, which clears the key
 * instead of storing an empty diff.
 */
const presetStore = createPersistedStore<StudioState>(
  "dotui:preset",
  DEFAULTS,
  { decode: decodeState, encode: (state) => encodeState(state) ?? null },
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
