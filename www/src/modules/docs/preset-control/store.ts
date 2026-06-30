'use client'

import { useSyncExternalStore } from 'react'

import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Which design-system preset the docs previews render in, persisted in
 * localStorage so it survives reloads and stays in sync across every demo on the
 * page (and across tabs). The value is an id, not a serialized design system:
 * `'yours'` means the one the user built at /create (read live from
 * `useStoredPreset`), anything else is one of the curated presets in
 * presets-data.ts. Resolution lives in resolve.ts; this module only owns the id.
 *
 * The control is intentionally scoped to the previews, not the whole site — so
 * it lives in the docs content ("Previewing components in …"), not the site
 * chrome, where it would falsely imply it re-themes the nav/header too.
 */

/** `'yours'` (the /create design system) or a curated preset id. */
export type PresetSelection = string

export const YOURS: PresetSelection = 'yours'

const STORAGE_KEY = 'dotui:preview-preset'

const VALID_IDS = new Set<string>([YOURS, ...PRESETS.map((p) => p.id)])

// Same-tab listeners don't get the native `storage` event (it only fires in
// *other* tabs), so saving also dispatches this for live in-tab updates.
const CHANGE_EVENT = 'dotui:preview-preset:change'

function read(): PresetSelection {
  if (typeof window === 'undefined') return YOURS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw && VALID_IDS.has(raw) ? raw : YOURS
  } catch {
    return YOURS
  }
}

export function setSelectedPreset(value: PresetSelection): void {
  if (typeof window === 'undefined') return
  try {
    if (value === YOURS) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, value)
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

// Server (and the first client render, for hydration parity) always sees the
// default; the stored preset is applied on mount, after which scoped theming
// swaps it in. Strings compare by value, so `read` is already a stable snapshot.
export function useSelectedPreset(): PresetSelection {
  return useSyncExternalStore(subscribe, read, () => YOURS)
}
