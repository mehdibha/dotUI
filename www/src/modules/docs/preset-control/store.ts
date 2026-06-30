'use client'

import { useSyncExternalStore } from 'react'

import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Site-wide docs preview controls, persisted in localStorage so they survive
 * reloads and stay in sync across every demo on the page (and across tabs):
 *
 *  - `dotui:preview-preset` — which design-system preset previews render in.
 *  - `dotui:preview-mode`   — light/dark for the previews only (`system` follows
 *    the site theme).
 *
 * Both are scoped to the previews, not the whole site — the controls live in the
 * docs content, not the site chrome, so their scope reads honestly.
 */

/* ----------------------- persistent enum store factory ----------------------- */

/**
 * A localStorage-backed string value as a `useSyncExternalStore` hook. The value
 * equal to `fallback` clears the key (so defaults never persist a diff). Same-tab
 * writes dispatch a custom event (the native `storage` event only fires in other
 * tabs); server + first client render see `fallback` so hydration matches.
 */
function createEnumStore<T extends string>(
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

  // Strings compare by value, so `read` is already a stable snapshot.
  const useValue = (): T =>
    useSyncExternalStore(subscribe, read, () => fallback)

  return { read, write, useValue }
}

/* ------------------------------ selected preset ------------------------------ */

/** `'yours'` (the /create design system) or a curated preset id. */
export type PresetSelection = string

export const YOURS: PresetSelection = 'yours'

const VALID_PRESET_IDS = new Set<string>([YOURS, ...PRESETS.map((p) => p.id)])

const presetStore = createEnumStore<PresetSelection>(
  'dotui:preview-preset',
  YOURS,
  (v) => VALID_PRESET_IDS.has(v),
)

/** Subscribe to the selected preview preset id (SSR-safe; cross-tab + in-tab). */
export const useSelectedPreset = presetStore.useValue
export const setSelectedPreset = presetStore.write

/* ------------------------------- preview mode ------------------------------- */

/** `'system'` follows the site theme; `'light'`/`'dark'` force the previews. */
export type PreviewMode = 'system' | 'light' | 'dark'

const modeStore = createEnumStore<PreviewMode>(
  'dotui:preview-mode',
  'system',
  (v) => v === 'system' || v === 'light' || v === 'dark',
)

/** Subscribe to the preview light/dark mode (SSR-safe; cross-tab + in-tab). */
export const useSelectedMode = modeStore.useValue
export const setSelectedMode = modeStore.write
