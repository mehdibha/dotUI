"use client"

/* Undo, redo and checkpoints for the design systems in the workspace. Each
   system keeps an in-memory undo stack; edits within 500 ms, or within one
   pointer press (a slider drag), merge into one step. Checkpoints persist in
   `dotui:history:<id>`: written when the studio leaves a system (switching,
   hiding the page, navigating away) and after two idle minutes. */

import { useEffect, useSyncExternalStore } from "react"

import { sameState, validate } from "./axes"
import type { StudioState } from "./axes"
import * as workspace from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const MERGE_MS = 500
const UNDO_LIMIT = 100
const IDLE_MS = 2 * 60_000
const CHECKPOINT_LIMIT = 20

/** A state to return to, or the system a replacement closed. */
type Step = { state: StudioState } | { system: DesignSystemDoc }

interface Stack {
  past: Step[]
  future: Step[]
  editedAt: number
  press: number
}

const stacks = new Map<string, Stack>()
const listeners = new Set<() => void>()
// The pointer press in progress (0 when none), so a drag is one step.
let press = 0
let presses = 0
let idle: ReturnType<typeof setTimeout> | undefined

const find = (id: string) =>
  workspace.getWorkspace().systems.find((s) => s.id === id)

function stack(id: string): Stack {
  let entry = stacks.get(id)
  if (!entry) {
    entry = { past: [], future: [], editedAt: 0, press: 0 }
    stacks.set(id, entry)
  }
  return entry
}

function push(steps: Step[], step: Step) {
  steps.push(step)
  if (steps.length > UNDO_LIMIT) steps.shift()
}

function emit() {
  for (const listener of listeners) listener()
}

/** Starts a new undo step returning to `step`. */
function record(id: string, step: Step) {
  const entry = stack(id)
  push(entry.past, step)
  entry.future = []
  entry.editedAt = 0
  entry.press = 0
  emit()
}

/* -------------------------------- editing -------------------------------- */

/** Edits the system's state as one undoable step, merged with the edits
 *  just before it. */
export function edit(id: string, next: StudioState): void {
  const doc = find(id)
  if (!doc || sameState(doc.state, next)) return
  if (!workspace.setState(id, next)) return
  const entry = stack(id)
  const now = Date.now()
  const merge =
    now - entry.editedAt <= MERGE_MS || (press !== 0 && entry.press === press)
  if (!merge) record(id, { state: doc.state })
  entry.editedAt = now
  entry.press = press
  clearTimeout(idle)
  idle = setTimeout(() => checkpoint(id), IDLE_MS)
}

/** Returns the system to its initial state; returns an undo that applies
 *  only while nothing happened since. */
export function reset(id: string): () => void {
  const doc = find(id)
  if (!doc || sameState(doc.state, doc.initial)) return () => {}
  const step = { state: doc.state }
  record(id, step)
  workspace.reset(id)
  return () => stacks.get(id)?.past.at(-1) === step && undo(id)
}

/** Sets an earlier state, checkpointing the current one first. */
export function restore(id: string, state: StudioState): void {
  const doc = find(id)
  if (!doc) return
  checkpoint(id)
  if (sameState(doc.state, state) || !workspace.setState(id, state)) return
  record(id, { state: doc.state })
}

/** Runs a workspace change; if it replaced the open system (an untouched
 *  preset), undo brings that system back. */
function replacing(change: () => void) {
  const before = workspace.openDoc(workspace.getWorkspace())
  change()
  const after = workspace.openDoc(workspace.getWorkspace())
  if (after.id !== before.id && !find(before.id))
    record(after.id, { system: before })
}

export const createFromPreset = (presetId: string) =>
  replacing(() => workspace.createFromPreset(presetId))

export const importSnapshot = (
  ...args: Parameters<typeof workspace.importSnapshot>
) => replacing(() => workspace.importSnapshot(...args))

/** Deletes the system and its checkpoints; returns the undo. */
export function remove(id: string): () => void {
  const saved = readStorage(historyKey(id))
  writeStorage(historyKey(id), null)
  const undo = workspace.remove(id)
  return () => {
    undo()
    if (saved !== null && find(id)) writeStorage(historyKey(id), saved)
  }
}

function travel(id: string, from: "past" | "future", to: "past" | "future") {
  const doc = find(id)
  const entry = stacks.get(id)
  const step = doc && entry?.[from].pop()
  if (!doc || !entry || !step) return
  entry.editedAt = 0
  entry.press = 0
  if ("state" in step) {
    workspace.setState(id, step.state)
    push(entry[to], { state: doc.state })
  } else {
    workspace.reinstate(step.system)
    push(stack(step.system.id)[to], { system: doc })
  }
  emit()
}

export const undo = (id: string) => travel(id, "past", "future")
export const redo = (id: string) => travel(id, "future", "past")

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUndoRedo(id: string) {
  // A primitive snapshot, so it is stable between changes.
  const flags = useSyncExternalStore(
    subscribe,
    () => {
      const entry = stacks.get(id)
      return (entry?.past.length ? 1 : 0) | (entry?.future.length ? 2 : 0)
    },
    () => 0,
  )
  return { canUndo: (flags & 1) !== 0, canRedo: (flags & 2) !== 0 }
}

/* ------------------------------ checkpoints ------------------------------ */

export interface Checkpoint {
  at: number
  state: StudioState
}

const historyKey = (id: string) => `dotui:history:${id}`

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Best effort: checkpoints are a convenience.
  }
}

/** The system's checkpoints, oldest first; invalid entries are dropped. */
export function checkpoints(id: string): Checkpoint[] {
  const raw = readStorage(historyKey(id))
  if (!raw) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  return parsed.flatMap((entry: unknown) => {
    if (typeof entry !== "object" || entry === null) return []
    const { at, state } = entry as Record<string, unknown>
    const valid = validate(state)
    return typeof at === "number" && Number.isFinite(at) && valid.ok
      ? [{ at, state: valid.state }]
      : []
  })
}

/** Records the system's state unless it equals the latest checkpoint (or,
 *  before the first, the state Reset returns to). Keeps the last 20. */
export function checkpoint(id: string): void {
  const doc = find(id)
  if (!doc) return
  const list = checkpoints(id)
  const last = list.at(-1)?.state ?? doc.initial
  if (sameState(last, doc.state)) return
  const next = [...list, { at: Date.now(), state: doc.state }]
  writeStorage(historyKey(id), JSON.stringify(next.slice(-CHECKPOINT_LIMIT)))
}

/* --------------------------------- wiring -------------------------------- */

const TEXT_ENTRY =
  "textarea, [contenteditable]:not([contenteditable='false']), input:not([type='range'], [type='checkbox'], [type='radio'], [type='button'], [type='color'])"

/** The studio's history wiring: ⌘Z / ⇧⌘Z outside text fields (which keep
 *  their own undo), press tracking, and checkpoints on leaving a system. */
export function useHistory(openId: string) {
  useEffect(() => () => checkpoint(openId), [openId])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return
      if (e.target instanceof Element && e.target.closest(TEXT_ENTRY)) return
      const key = e.key.toLowerCase()
      const id = workspace.getWorkspace().openId
      if (key === "z" && !e.shiftKey) undo(id)
      else if ((key === "z" && e.shiftKey) || (key === "y" && e.ctrlKey))
        redo(id)
      else return
      e.preventDefault()
    }
    const onPointerDown = () => setPressed(true)
    const onPointerUp = () => setPressed(false)
    const onLeave = () => checkpoint(workspace.getWorkspace().openId)
    const onHide = () => document.visibilityState === "hidden" && onLeave()
    // Capture: a press ends before the control's own pointerup handler runs.
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("pointercancel", onPointerUp, true)
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("pagehide", onLeave)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("pointercancel", onPointerUp, true)
      document.removeEventListener("visibilitychange", onHide)
      window.removeEventListener("pagehide", onLeave)
    }
  }, [])
}

/** A pointer press starting (`true`) or ending. */
export function setPressed(pressed: boolean) {
  press = pressed ? ++presses : 0
}
