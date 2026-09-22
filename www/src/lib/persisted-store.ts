"use client"

import { useSyncExternalStore } from "react"

interface PersistedStoreCodec<T> {
  decode: (raw: string) => T
  /** Return null to clear the key instead of storing. */
  encode: (value: T) => string | null
}

/**
 * A localStorage-backed value as a `useSyncExternalStore` hook. Memory mirrors
 * the last raw string seen in storage: it re-reads whenever nothing keeps it in
 * sync (no subscriber, so no `storage` listener) and before every `update`, so
 * a write never sends back a value another tab has since replaced. Writes still
 * apply in memory when persistence fails (private mode, quota). The server and
 * the first client render see `fallback` so hydration matches.
 */
export function createPersistedStore<T>(
  key: string,
  fallback: T,
  { decode, encode }: PersistedStoreCodec<T>,
) {
  const listeners = new Set<() => void>()
  let value = fallback
  // undefined until storage was first read; null when the key is absent.
  let raw: string | null | undefined

  function sync(): boolean {
    if (typeof window === "undefined") return false
    let next: string | null
    try {
      next = window.localStorage.getItem(key)
    } catch {
      return false
    }
    if (next === raw) return false
    raw = next
    try {
      value = next === null ? fallback : decode(next)
    } catch {
      value = fallback
    }
    return true
  }

  function emit() {
    for (const listener of listeners) listener()
  }

  function onStorage(e: StorageEvent) {
    if ((e.key === null || e.key === key) && sync()) emit()
  }

  function get(): T {
    if (listeners.size === 0) sync()
    return value
  }

  function set(next: T): void {
    // Baseline `raw` so a failed write isn't undone by the next re-read.
    if (raw === undefined) sync()
    value = next
    try {
      const encoded = encode(next)
      if (encoded === null) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, encoded)
      raw = encoded
    } catch {
      // Best-effort persistence; the in-memory value still applies.
    }
    emit()
  }

  /** Read-modify-write against the latest stored value. */
  function update(fn: (current: T) => T): void {
    const changed = sync()
    const next = fn(value)
    if (next !== value) set(next)
    else if (changed) emit()
  }

  function subscribe(onChange: () => void): () => void {
    if (listeners.size === 0) {
      sync()
      window.addEventListener("storage", onStorage)
    }
    listeners.add(onChange)
    return () => {
      listeners.delete(onChange)
      if (listeners.size === 0) window.removeEventListener("storage", onStorage)
    }
  }

  const useValue = (): T => useSyncExternalStore(subscribe, get, () => fallback)

  return { get, set, update, subscribe, useValue }
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
