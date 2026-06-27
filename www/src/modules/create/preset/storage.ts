'use client'

import { useSyncExternalStore } from 'react'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'
import type { DesignSystem } from './types'

/**
 * The user's selected design-system preset, persisted in localStorage so it
 * survives reloads and is shared across the whole site: the /create page writes
 * it as the user customizes, and every docs component demo reads it to render in
 * that exact preset.
 *
 * The stored value is the same compact, URL-safe string the /create page uses in
 * its `?preset=` param (see codec.ts), so a preset round-trips between the two.
 */
const STORAGE_KEY = 'dotui:preset'

// Same-tab listeners don't get the native `storage` event (it only fires in
// *other* tabs), so saving also dispatches this for live in-tab updates.
const CHANGE_EVENT = 'dotui:preset-change'

export function loadStoredPreset(): DesignSystem {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? decodePreset(raw) : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function saveStoredPreset(ds: DesignSystem): void {
  if (typeof window === 'undefined') return
  try {
    const encoded = encodePreset(ds)
    // `encodePreset` returns undefined when everything matches the defaults —
    // clear the key so we fall back to DEFAULTS rather than storing an empty diff.
    if (encoded) window.localStorage.setItem(STORAGE_KEY, encoded)
    else window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    // Private mode / quota / disabled storage — non-fatal, the preset just won't persist.
  }
}

/* ----------------------------- reactive hook ----------------------------- */

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

// Cache the decoded preset keyed by its raw string so getSnapshot returns a
// stable reference between unchanged reads (useSyncExternalStore requires it).
let snapshot: { raw: string | null; ds: DesignSystem } = {
  raw: null,
  ds: DEFAULTS,
}

function getSnapshot(): DesignSystem {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== snapshot.raw) {
    snapshot = { raw, ds: raw ? decodePreset(raw) : DEFAULTS }
  }
  return snapshot.ds
}

// Server (and the first client render, for hydration parity) always sees DEFAULTS;
// the stored preset is applied on mount, after which scoped theming swaps it in.
function getServerSnapshot(): DesignSystem {
  return DEFAULTS
}

/** Subscribe to the user's stored preset (SSR-safe; updates across tabs and in-tab). */
export function useStoredPreset(): DesignSystem {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
