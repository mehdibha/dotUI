"use client"

/* Undo/redo over the studio's `?preset=` param. Every edit replace-navigates
   the URL, so the history lives here, not in the browser's: `record` is
   called with the state an edit is about to replace. Edits within a short
   window (a color dragged, a slider nudged by keys) merge into one step. */

import { useEffect, useSyncExternalStore } from "react"

import { loadActivePresetId, saveActivePresetId } from "./preset/my-presets"
import { loadDesignSystemName, saveDesignSystemName } from "./preset/storage"

const MERGE_MS = 500
const LIMIT = 100

/** An encoded preset ("" is the untouched default) with the name and saved
 *  system it was shown under, so undoing a preset pick renames the header. */
interface Entry {
  state: string
  name: string
  activeId: string | undefined
}

function capture(state: string | undefined): Entry {
  return {
    state: state ?? "",
    name: loadDesignSystemName(),
    activeId: loadActivePresetId(),
  }
}

function apply(entry: Entry): string {
  saveDesignSystemName(entry.name)
  saveActivePresetId(entry.activeId)
  return entry.state
}

let past: Entry[] = []
let future: Entry[] = []
let lastRecordedAt = 0
let snapshot = { canUndo: false, canRedo: false }
const listeners = new Set<() => void>()

function emit() {
  snapshot = { canUndo: past.length > 0, canRedo: future.length > 0 }
  for (const listener of listeners) listener()
}

export function record(previous: string | undefined) {
  const now = Date.now()
  if (now - lastRecordedAt > MERGE_MS) {
    past = [...past, capture(previous)].slice(-LIMIT)
  }
  lastRecordedAt = now
  future = []
  emit()
}

/** Steps back from `current`; returns the state to show, or null. */
export function undo(current: string | undefined): string | null {
  const previous = past.at(-1)
  if (previous === undefined) return null
  past = past.slice(0, -1)
  future = [...future, capture(current)]
  lastRecordedAt = 0
  emit()
  return apply(previous)
}

export function redo(current: string | undefined): string | null {
  const next = future.at(-1)
  if (next === undefined) return null
  future = future.slice(0, -1)
  past = [...past, capture(current)]
  lastRecordedAt = 0
  emit()
  return apply(next)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const SERVER_SNAPSHOT = { canUndo: false, canRedo: false }

export function useHistory() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_SNAPSHOT,
  )
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, [contenteditable='true']") !== null)
  )
}

/** ⌘Z / Ctrl+Z undo, ⇧⌘Z / Ctrl+Y redo — outside text fields, which keep
 *  their own undo. */
export function useHistoryShortcuts(onUndo: () => void, onRedo: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || isEditable(e.target)) return
      const key = e.key.toLowerCase()
      if (key === "z" && !e.shiftKey) onUndo()
      else if ((key === "z" && e.shiftKey) || key === "y") onRedo()
      else return
      e.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onUndo, onRedo])
}
