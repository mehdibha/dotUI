"use client"

/* Undo and redo. Each system keeps an in-memory undo stack; edits within
   500 ms, or within one pointer press (a slider drag), merge into one step.
   The first edit of a view forks it into a new system whose first step
   returns to the view's state. Nothing else is a step: Delete has its own
   Undo toast, and resets the stack so ⌘Z never touches another system. */

import { useEffect, useSyncExternalStore } from "react"

import { toastManager } from "@/registry/ui/toast"
import { ORIGIN } from "@/modules/presets"

import { sameState } from "./axes"
import type { StudioState } from "./axes"
import { historyKey } from "./history-keys"
import { getCurrent, getSelection, select, selectionKey } from "./selection"
import type { Selection } from "./selection"
import * as workspace from "./workspace"

/** A design system's name in a toast title: quoted, cut at 32 characters. */
function quoted(name: string): string {
  const chars = [...name]
  return `“${chars.length > 32 ? `${chars.slice(0, 31).join("")}…` : name}”`
}

const MERGE_MS = 500
const UNDO_LIMIT = 100

interface Stack {
  past: StudioState[]
  future: StudioState[]
  editedAt: number
  press: number
  /** The system's state as this tab last left it: another tab's edit since
   *  makes the stack stale. */
  head: StudioState
}

// By system id.
const stacks = new Map<string, Stack>()
const listeners = new Set<() => void>()
// The pointer press in progress (0 when none), so a drag is one step.
let press = 0
let presses = 0

/** The system's stack, unless another tab edited the system since. */
function live(id: string): Stack | undefined {
  const entry = stacks.get(id)
  const doc = workspace.findSystem(id)
  if (entry && doc && sameState(doc.state, entry.head)) return entry
}

function push(steps: StudioState[], state: StudioState) {
  steps.push(state)
  if (steps.length > UNDO_LIMIT) steps.shift()
}

function emit() {
  for (const listener of listeners) listener()
}

/** Merges the edit into the last step when it's close enough in time or
 *  in the same press; otherwise starts a step returning to `before`. */
function recordEdit(id: string, before: StudioState, next: StudioState) {
  // Undo never steps back over another tab's edit: a stale stack restarts.
  const last = stacks.get(id)
  const entry =
    last && sameState(last.head, before)
      ? last
      : { past: [], future: [], editedAt: 0, press: 0, head: before }
  stacks.set(id, entry)
  const now = Date.now()
  const merge =
    now - entry.editedAt <= MERGE_MS || (press !== 0 && entry.press === press)
  if (!merge) {
    push(entry.past, before)
    entry.future = []
    emit()
  }
  entry.head = next
  entry.editedAt = now
  entry.press = press
}

/** "My Linear", or "Untitled" from Origin or an "Untitled" link. */
function forkName({ sel, name }: ReturnType<typeof getCurrent>): string {
  const base = sel.id === ORIGIN.id ? "Untitled" : name
  return base === "Untitled" || base.startsWith("My ") ? base : `My ${base}`
}

function fork(next: StudioState) {
  const current = getCurrent()
  const doc = workspace.create({
    name: forkName(current),
    from: current.sel.kind === "preset" ? current.sel.id : undefined,
    state: current.state,
  })
  if (!doc) return
  select({ kind: "system", id: doc.id }, doc)
  if (!workspace.setState(doc.id, next)) return
  recordEdit(doc.id, doc.state, next)
  if (workspace.isSaved())
    toastManager.add({ title: `Saved as ${quoted(doc.name)} in this browser.` })
}

/** Edits the current design system as one undoable step, merged with the
 *  edits just before it. On a view, the first edit forks it. */
export function edit(next: StudioState): void {
  const current = getCurrent()
  if (sameState(current.state, next)) return
  if (!current.doc) return fork(next)
  const { id, state } = current.doc
  if (workspace.setState(id, next)) recordEdit(id, state, next)
}

/** Deletes the system with a toast whose Undo, which `afterUndo` follows,
 *  puts it back. Deleting the current one opens the next in the list, else
 *  the Origin view. The current selection's undo history then starts over:
 *  ⌘Z right after never touches another system. Returns the toast's undo. */
export function remove(
  id: string,
  { afterUndo }: { afterUndo?: () => void } = {},
): () => void {
  const list = workspace.listed(workspace.getWorkspace())
  const wasCurrent =
    selectionKey(getSelection()) === selectionKey({ kind: "system", id })
  const removed = workspace.remove(id)
  if (!removed) return () => {}
  const restore = () => {
    workspace.insert(removed.doc, removed.index)
    if (wasCurrent) select({ kind: "system", id })
  }
  const toast = toastManager.add({
    title: `Deleted ${quoted(removed.doc.name)}`,
    timeout: 10_000,
    actionProps: {
      children: "Undo",
      onClick: () => {
        toastManager.close(toast)
        restore()
        afterUndo?.()
      },
    },
  })
  if (wasCurrent) {
    const at = list.findIndex((s) => s.id === id)
    const next = list[at + 1] ?? list[at - 1]
    const sel: Selection = next
      ? { kind: "system", id: next.id }
      : { kind: "preset", id: ORIGIN.id }
    select(sel)
  }
  stacks.delete(getSelection().id)
  emit()
  return restore
}

function travel(from: "past" | "future", to: "past" | "future") {
  const sel = getSelection()
  const entry = sel.kind === "system" ? live(sel.id) : undefined
  const state = entry?.[from].pop()
  const doc = workspace.findSystem(sel.id)
  if (!entry || !state || !doc) return
  entry.editedAt = 0
  entry.press = 0
  workspace.setState(doc.id, state)
  push(entry[to], doc.state)
  entry.head = state
  emit()
}

export const undo = () => travel("past", "future")
export const redo = () => travel("future", "past")

function subscribe(listener: () => void) {
  listeners.add(listener)
  const unsubscribe = workspace.subscribe(listener)
  return () => {
    listeners.delete(listener)
    unsubscribe()
  }
}

/** Whether the system's edits can be undone or redone here. */
export function useUndoRedo(id: string | undefined) {
  // A primitive snapshot, so it is stable between changes.
  const flags = useSyncExternalStore(
    subscribe,
    () => {
      const entry = id ? live(id) : undefined
      return (entry?.past.length ? 1 : 0) | (entry?.future.length ? 2 : 0)
    },
    () => 0,
  )
  return { canUndo: (flags & 1) !== 0, canRedo: (flags & 2) !== 0 }
}

/** The studio's history wiring: ⌘Z / ⇧⌘Z outside text fields (which keep
 *  their own undo), here or in the preview, and press tracking. */
export function useHistory() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = historyKey(e)
      if (!action) return
      e.preventDefault()
      if (action === "undo") undo()
      else redo()
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type !== "preview-history") return
      if (e.data.action === "undo") undo()
      else if (e.data.action === "redo") redo()
    }
    const onPointerDown = () => setPressed(true)
    const onPointerUp = () => setPressed(false)
    // Capture: a press ends before the control's own pointerup handler runs.
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("message", onMessage)
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("pointercancel", onPointerUp, true)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("message", onMessage)
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("pointercancel", onPointerUp, true)
    }
  }, [])
}

/** A pointer press starting (`true`) or ending. */
export function setPressed(pressed: boolean) {
  press = pressed ? ++presses : 0
}
