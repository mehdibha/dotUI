"use client"

import { useSyncExternalStore } from "react"

interface PersistedStoreCodec<T> {
  decode: (raw: string) => T
  /** Return null to clear the key instead of storing. */
  encode: (value: T) => string | null
  /** Called when a write can't reach storage: `unreadable` when the stored
   *  value is one `decode` rejected, else private mode or quota. */
  onWriteError?: (unreadable: boolean) => void
}

/**
 * A localStorage-backed value as a `useSyncExternalStore` hook. Memory mirrors
 * the last raw string seen in storage: it re-reads whenever nothing keeps it in
 * sync (no subscriber, so no `storage` listener) and before every `update`, so
 * a write never sends back a value another tab has since replaced. A stored
 * value `decode` throws on reads as `fallback` and is never overwritten. Writes
 * still apply in memory when persistence fails. The server and the first
 * client render see `fallback` so hydration matches. `fallback` itself is
 * never stored: a present key always means another value.
 */
export function createPersistedStore<T>(
  key: string,
  fallback: T,
  { decode, encode, onWriteError }: PersistedStoreCodec<T>,
) {
  const encodedFallback = encode(fallback)
  const listeners = new Set<() => void>()
  let value = fallback
  // undefined until storage was first read; null when the key is absent.
  let raw: string | null | undefined
  let unreadable = false

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
    unreadable = false
    try {
      value = next === null ? fallback : decode(next)
    } catch {
      value = fallback
      unreadable = true
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

  /** Returns whether `next` reached storage; it applies in memory anyway. */
  function set(next: T): boolean {
    // Baseline `raw` so a failed write isn't undone by the next re-read.
    if (raw === undefined) sync()
    value = next
    let saved = false
    try {
      if (unreadable) throw new Error(`${key} holds a value this can't read`)
      const encoded = encode(next)
      const stored = encoded === encodedFallback ? null : encoded
      if (stored === null) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, stored)
      raw = stored
      saved = true
    } catch {
      onWriteError?.(unreadable)
    }
    emit()
    return saved
  }

  /** Read-modify-write against the latest stored value. Returns whether the
   *  result is in storage. */
  function update(fn: (current: T) => T): boolean {
    const changed = sync()
    const next = fn(value)
    if (next !== value) return set(next)
    if (changed) emit()
    return !unreadable
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

  /** Decodes the stored value again, as if it had changed. */
  function reload() {
    raw = undefined
    if (sync()) emit()
  }

  /** Whether the stored value is one `decode` rejected. */
  function isUnreadable(): boolean {
    get()
    return unreadable
  }

  return { get, set, update, subscribe, useValue, reload, isUnreadable }
}

/** Codec for a closed string set. Unknown stored values decode to the fallback. */
export function enumCodec<T extends string>(
  values: readonly T[],
  fallback: T,
): PersistedStoreCodec<T> {
  const valid = new Set<string>(values)
  return {
    decode: (raw) => (valid.has(raw) ? (raw as T) : fallback),
    encode: (value) => value,
  }
}
