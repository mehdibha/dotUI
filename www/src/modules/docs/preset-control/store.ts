'use client'

import { useSyncExternalStore } from 'react'

import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Site-wide preview controls, persisted in localStorage so they survive reloads
 * and stay in sync across every demo on the page (and across tabs):
 *
 *  - `dotui:preview-preset`   — which design-system preset the demos render in.
 *  - `dotui:preview-selector` — where the preset selector is shown (a tweaker
 *    the team flips while deciding the final placement; not user-facing chrome).
 *
 * The selected preset is an id, not a serialized design system: `'yours'` means
 * the one the user built at /create (read live from `useStoredPreset`), anything
 * else is one of the curated presets in presets-data.ts. Resolution lives in
 * resolve.ts; this module only owns the string ids.
 */

/* ------------------------------ selected preset ------------------------------ */

/** `'yours'` (the /create design system) or a curated preset id. */
export type PresetSelection = string

export const YOURS: PresetSelection = 'yours'

const PRESET_STORAGE_KEY = 'dotui:preview-preset'

const VALID_PRESET_IDS = new Set<string>([YOURS, ...PRESETS.map((p) => p.id)])

/* ------------------------------ selector placement ------------------------------ */

/**
 * Where the preset selector renders:
 *  - `each`   — in every demo/playground frame (the literal "on all demos").
 *  - `page`   — once in the docs page header.
 *  - `header` — once in the site header, alongside the theme toggle.
 */
export type SelectorPlacement = 'each' | 'page' | 'header'

const PLACEMENT_STORAGE_KEY = 'dotui:preview-selector'

const VALID_PLACEMENTS = new Set<string>(['each', 'page', 'header'])

/* --------------------------- persistent string store --------------------------- */

/**
 * A localStorage-backed string value exposed as a `useSyncExternalStore` hook.
 * Same-tab writes dispatch a custom event (the native `storage` event only fires
 * in *other* tabs); the server and the first client render always see `fallback`
 * so hydration matches, then the stored value swaps in on mount.
 */
function createStringStore<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => boolean,
) {
  const CHANGE_EVENT = `${key}:change`

  function read(): T {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = window.localStorage.getItem(key)
      return raw && isValid(raw) ? (raw as T) : fallback
    } catch {
      return fallback
    }
  }

  function write(value: T): void {
    if (typeof window === 'undefined') return
    try {
      if (value === fallback) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, value)
      window.dispatchEvent(new Event(CHANGE_EVENT))
    } catch {
      // Private mode / quota / disabled storage — non-fatal, just won't persist.
    }
  }

  function subscribe(onChange: () => void): () => void {
    window.addEventListener('storage', onChange)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => {
      window.removeEventListener('storage', onChange)
      window.removeEventListener(CHANGE_EVENT, onChange)
    }
  }

  // Strings are compared by value, so `read` already returns a stable snapshot.
  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => fallback)
  }

  return { read, write, useValue }
}

/* ----------------------------------- exports ----------------------------------- */

const presetStore = createStringStore<PresetSelection>(
  PRESET_STORAGE_KEY,
  YOURS,
  (v) => VALID_PRESET_IDS.has(v),
)

const placementStore = createStringStore<SelectorPlacement>(
  PLACEMENT_STORAGE_KEY,
  'each',
  (v) => VALID_PLACEMENTS.has(v),
)

/** Subscribe to the selected preview preset id (SSR-safe; cross-tab + in-tab). */
export const useSelectedPreset = presetStore.useValue
export const setSelectedPreset = presetStore.write

/** Subscribe to the preset-selector placement mode (SSR-safe). */
export const useSelectorPlacement = placementStore.useValue
export const setSelectorPlacement = placementStore.write
