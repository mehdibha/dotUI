'use client'

import { useSyncExternalStore } from 'react'

interface PersistedStoreCodec<T> {
  decode: (raw: string) => T
  /** Return null to clear the key instead of storing. */
  encode: (value: T) => string | null
}

/**
 * A localStorage-backed value as a `useSyncExternalStore` hook. Memory is the
 * source of truth: writes update it and notify subscribers even when
 * persistence fails (private mode, quota), and reads never hit storage on the
 * render path. Same-tab writes notify through a per-key custom event (the
 * native `storage` event only fires in other tabs); the server and the first
 * client render see `fallback` so hydration matches.
 */
export function createPersistedStore<T>(
  key: string,
  fallback: T,
  { decode, encode }: PersistedStoreCodec<T>,
) {
  const changeEvent = `${key}:change`

  let initialized = false
  let value = fallback

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : decode(raw)
    } catch {
      return fallback
    }
  }

  function get(): T {
    if (!initialized && typeof window !== 'undefined') {
      value = read()
      initialized = true
    }
    return value
  }

  function set(next: T): void {
    initialized = true
    value = next
    try {
      const encoded = encode(next)
      if (encoded === null) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, encoded)
    } catch {
      // Best-effort persistence; the in-memory value still applies.
    }
    window.dispatchEvent(new Event(changeEvent))
  }

  function subscribe(onChange: () => void): () => void {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== key) return
      value = read()
      initialized = true
      onChange()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(changeEvent, onChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(changeEvent, onChange)
    }
  }

  const useValue = (): T => useSyncExternalStore(subscribe, get, () => fallback)

  return { get, set, useValue }
}

/** Codec for a closed string set. Unknown stored values decode to the fallback; the fallback clears the key. */
export function enumCodec<T extends string>(
  values: readonly T[],
  fallback: T,
): PersistedStoreCodec<T> {
  const valid = new Set<string>(values)
  return {
    decode: (raw) => (valid.has(raw) ? (raw as T) : fallback),
    encode: (value) => (value === fallback ? null : value),
  }
}
