"use client"

/* Undo, redo and checkpoints. Each selection keeps an in-memory undo stack;
   edits within 500 ms, or within one pointer press (a slider drag), merge
   into one step. The first edit of a view forks it into a draft, and that
   step is the bottom of the draft's stack: undoing it removes the draft
   (unless it was kept or published) and returns to the view, whose redo
   brings it back with the same id. Nothing else ever adds or removes a
   system from undo: New, Duplicate and Keep are not steps, and Delete has
   its toast. Checkpoints persist in
   `dotui:history:<id>`: written when the studio leaves a system (switching,
   hiding the page, navigating away) and after two idle minutes. */

import { useEffect, useSyncExternalStore } from "react"

import { toastManager } from "@/registry/ui/toast"
import { ORIGIN } from "@/modules/presets"

import { sameState, validate } from "./axes"
import type { StudioState } from "./axes"
import { historyKey } from "./history-keys"
import {
  describe,
  getCurrent,
  getSelection,
  select,
  selectionKey,
} from "./selection"
import type { Selection, ViewSelection } from "./selection"
import { quoted, undoToast } from "./toasts"
import * as workspace from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const MERGE_MS = 500
const UNDO_LIMIT = 100
const IDLE_MS = 2 * 60_000
const CHECKPOINT_LIMIT = 20
const SEEN_DRAFT = "dotui:seen-draft"

/** A state to return to; the fork of the open draft, back to its view; or,
 *  on that view, the removed draft to bring back. */
type Step =
  | { state: StudioState }
  | { forked: ViewSelection }
  | { recreate: DesignSystemDoc; checkpoints: string | null }

interface Stack {
  past: Step[]
  future: Step[]
  editedAt: number
  press: number
  /** The system's state as this tab last left it: another tab's edit since
   *  makes the stack stale. */
  head?: StudioState
}

const stacks = new Map<string, Stack>()
const listeners = new Set<() => void>()
// The pointer press in progress (0 when none), so a drag is one step.
let press = 0
let presses = 0
let idle: ReturnType<typeof setTimeout> | undefined
// Each deleted system's toast, closed once it is restored or purged.
const deletedToasts = new Map<string, string>()

const systemKey = (id: string) => selectionKey({ kind: "system", id })

function stack(key: string): Stack {
  let entry = stacks.get(key)
  if (!entry) {
    entry = { past: [], future: [], editedAt: 0, press: 0 }
    stacks.set(key, entry)
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
function record(key: string, step: Step) {
  const entry = stack(key)
  push(entry.past, step)
  entry.future = []
  entry.editedAt = 0
  entry.press = 0
  emit()
}

/* --------------------------------- drafts -------------------------------- */

/** Keeps every draft but `except` under its default name, so at most one
 *  draft exists. */
function keepOtherDrafts(except?: string) {
  for (const doc of workspace.getWorkspace().systems) {
    if (!doc.draft || doc.id === except) continue
    const name = workspace.keptName(doc)
    workspace.keep(doc.id, name)
    toastManager.add({ title: `Kept "${name}"` })
  }
}

function fork(view: ViewSelection, next: StudioState) {
  const { name, state } = getCurrent()
  keepOtherDrafts()
  const doc = workspace.create({
    draft: true,
    name,
    origin:
      view.kind === "preset"
        ? { kind: "preset", id: view.id }
        : { kind: "snapshot", id: view.id },
    initial: state,
    state: next,
  })
  if (!doc) return
  stacks.delete(selectionKey(view))
  select({ kind: "system", id: doc.id })
  record(systemKey(doc.id), { forked: view })
  // The rest of this gesture merges into the fork.
  const entry = stack(systemKey(doc.id))
  entry.head = next
  entry.editedAt = Date.now()
  entry.press = press
  try {
    if (window.localStorage.getItem(SEEN_DRAFT)) return
    window.localStorage.setItem(SEEN_DRAFT, "1")
  } catch {
    return
  }
  // Closed if the draft goes (undone, or left unchanged).
  const stop = workspace.subscribe(() => {
    if (workspace.findSystem(doc.id)) return
    stop()
    toastManager.close(toastId)
  })
  const toastId = toastManager.add({
    title: "Your changes are saved in this browser.",
    onRemove: stop,
  })
}

/* -------------------------------- editing -------------------------------- */

/** Edits the current design system as one undoable step, merged with the
 *  edits just before it. On a view, the first edit creates a draft. */
export function edit(next: StudioState): void {
  const current = getCurrent()
  if (sameState(current.state, next)) return
  if (!current.doc) return fork(current.sel as ViewSelection, next)
  const { id, state } = current.doc
  if (!workspace.setState(id, next)) return
  const entry = stack(systemKey(id))
  const now = Date.now()
  const merge =
    now - entry.editedAt <= MERGE_MS || (press !== 0 && entry.press === press)
  if (!merge) record(systemKey(id), { state })
  entry.head = next
  entry.editedAt = now
  entry.press = press
  clearTimeout(idle)
  idle = setTimeout(() => checkpoint(id), IDLE_MS)
}

/** Returns the system to its initial state; returns an undo that applies
 *  only while nothing happened since. */
export function reset(id: string): () => void {
  const doc = workspace.findSystem(id)
  if (!doc || sameState(doc.state, doc.initial)) return () => {}
  const step = { state: doc.state }
  record(systemKey(id), step)
  workspace.reset(id)
  stack(systemKey(id)).head = doc.initial
  return () => stacks.get(systemKey(id))?.past.at(-1) === step && undo()
}

/** Sets an earlier state, checkpointing the current one first. */
export function restore(id: string, state: StudioState): void {
  const doc = workspace.findSystem(id)
  if (!doc) return
  checkpoint(id)
  if (sameState(doc.state, state) || !workspace.setState(id, state)) return
  record(systemKey(id), { state: doc.state })
  stack(systemKey(id)).head = state
}

/** Creates "Untitled" from Origin and opens it; returns its id. */
export function newSystem(): string | undefined {
  const doc = workspace.create({
    name: "Untitled",
    origin: { kind: "preset", id: ORIGIN.id },
    initial: ORIGIN.state,
    state: ORIGIN.state,
  })
  if (doc) select({ kind: "system", id: doc.id })
  return doc?.id
}

/** Opens a kept copy of a row: "My Linear" from a preset, "Acme copy" from
 *  a system, the link's name from a shared view. Returns its id. */
export function duplicate(sel: Selection): string | undefined {
  const source = describe(sel, workspace.getWorkspace())
  if (sel.kind === "system" && !source.doc) return
  const doc = workspace.create({
    name:
      sel.kind === "preset"
        ? `My ${source.name}`
        : sel.kind === "system"
          ? workspace.uniqueName(
              source.name.replace(/ copy( \d+)?$/, ""),
              workspace.getWorkspace().systems,
              " copy",
            )
          : source.name,
    origin:
      sel.kind === "preset"
        ? { kind: "preset", id: sel.id }
        : sel.kind === "shared"
          ? { kind: "snapshot", id: sel.id }
          : { kind: "copy", of: sel.id },
    initial: source.state,
    state: source.state,
  })
  if (doc) select({ kind: "system", id: doc.id })
  return doc?.id
}

/** Moves the system to Recently deleted with a toast (`Deleted "Acme"`, or
 *  `verb`) whose Undo, which `afterUndo` follows, brings it back. Deleting
 *  the current one opens the next in the list, else the Origin view, whose
 *  undo history starts over: ⌘Z right after never touches it. Returns the
 *  toast's undo. */
export function remove(
  id: string,
  {
    verb = "Deleted",
    afterUndo,
  }: { verb?: string; afterUndo?: () => void } = {},
): () => void {
  const list = workspace.listed(workspace.getWorkspace())
  const wasCurrent = selectionKey(getSelection()) === systemKey(id)
  const deleted = workspace.trash(id)
  if (!deleted) return () => {}
  const { name, published } = deleted.doc
  deletedToasts.set(
    id,
    undoToast(
      `${verb} ${quoted(name)}`,
      () => {
        recover(id, wasCurrent)
        afterUndo?.()
      },
      published.length ? "Its published links keep working." : undefined,
    ),
  )
  if (wasCurrent) {
    const at = list.findIndex((s) => s.id === id)
    const next = list[at + 1] ?? list[at - 1]
    const sel: Selection = next
      ? { kind: "system", id: next.id }
      : { kind: "preset", id: ORIGIN.id }
    select(sel)
    stacks.delete(selectionKey(sel))
    emit()
  }
  return () => recover(id, wasCurrent)
}

function closeDeletedToast(id: string) {
  const toast = deletedToasts.get(id)
  if (toast === undefined) return
  deletedToasts.delete(id)
  toastManager.close(toast)
}

/** Brings a system back from Recently deleted; `open` makes it current.
 *  Returns whether it was there. */
export function recover(id: string, open = false): boolean {
  closeDeletedToast(id)
  const doc = workspace.recover(id)
  if (!doc) return false
  if (doc.draft) keepOtherDrafts(id)
  if (open) select({ kind: "system", id })
  return true
}

/** Deletes a system from Recently deleted for good. */
export function purge(id: string): void {
  closeDeletedToast(id)
  workspace.purge(id)
}

function travel(from: "past" | "future", to: "past" | "future") {
  const sel = getSelection()
  const key = selectionKey(sel)
  const entry = stacks.get(key)
  const step = entry?.[from].pop()
  if (!entry || !step) return
  entry.editedAt = 0
  entry.press = 0
  const doc = sel.kind === "system" ? workspace.findSystem(sel.id) : undefined

  // Last write wins across tabs: undo never rolls back another tab's edit.
  if (doc && entry.head && !sameState(doc.state, entry.head)) {
    stacks.delete(key)
    emit()
    toastManager.add({
      title: `${quoted(doc.name)} was changed in another tab`,
      description: "Undo history here starts again from its latest version.",
    })
    return
  }

  if ("recreate" in step) {
    const { recreate, checkpoints } = step
    workspace.insert(recreate, undefined, checkpoints)
    keepOtherDrafts(recreate.id)
    select({ kind: "system", id: recreate.id })
    const forked = stack(systemKey(recreate.id))
    push(forked[to], { forked: sel as ViewSelection })
    forked.head = recreate.state
  } else if (!doc) {
    return
  } else if ("state" in step) {
    workspace.setState(doc.id, step.state)
    push(entry[to], { state: doc.state })
    entry.head = step.state
  } else if (!doc.draft || doc.published.length > 0) {
    // A fork kept, renamed or published since: only its changes go.
    workspace.setState(doc.id, doc.initial)
    push(entry[to], { state: doc.state })
    entry.head = doc.initial
  } else {
    // The fork itself: the draft goes, and its view can bring it back.
    workspace.flush()
    const checkpoints = workspace.remove(doc.id)?.checkpoints ?? null
    select(step.forked)
    push(stack(selectionKey(step.forked))[to], { recreate: doc, checkpoints })
  }
  emit()
}

export const undo = () => travel("past", "future")
export const redo = () => travel("future", "past")

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUndoRedo(key: string) {
  // A primitive snapshot, so it is stable between changes.
  const flags = useSyncExternalStore(
    subscribe,
    () => {
      const entry = stacks.get(key)
      return (entry?.past.length ? 1 : 0) | (entry?.future.length ? 2 : 0)
    },
    () => 0,
  )
  const recreates = useSyncExternalStore(
    subscribe,
    () => {
      const step = stacks.get(key)?.future.at(-1)
      return step && "recreate" in step ? step.recreate.name : undefined
    },
    () => undefined,
  )
  return {
    canUndo: (flags & 1) !== 0,
    canRedo: (flags & 2) !== 0,
    redoLabel: recreates ? `Redo · recreate the ${recreates} draft` : "Redo",
  }
}

/* ------------------------------ checkpoints ------------------------------ */

export interface Checkpoint {
  at: number
  state: StudioState
}

/** The system's checkpoints, oldest first; invalid entries are dropped. */
export function checkpoints(id: string): Checkpoint[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(
      window.localStorage.getItem(workspace.checkpointsKey(id)) ?? "[]",
    )
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
  const doc = workspace.findSystem(id)
  if (!doc) return
  const list = checkpoints(id)
  const last = list.at(-1)?.state ?? doc.initial
  if (sameState(last, doc.state)) return
  const next = [...list, { at: Date.now(), state: doc.state }]
  try {
    window.localStorage.setItem(
      workspace.checkpointsKey(id),
      JSON.stringify(next.slice(-CHECKPOINT_LIMIT)),
    )
  } catch {
    // Best effort: checkpoints are a convenience.
  }
}

/* --------------------------------- wiring -------------------------------- */

const checkpointCurrent = () => {
  const { doc } = getCurrent()
  if (doc) checkpoint(doc.id)
}

/** The studio's history wiring: ⌘Z / ⇧⌘Z outside text fields (which keep
 *  their own undo), here or in the preview, press tracking, and checkpoints
 *  on leaving a system. */
export function useHistory(systemId: string | undefined) {
  useEffect(
    () => () => {
      if (systemId) checkpoint(systemId)
    },
    [systemId],
  )

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
    const onHide = () =>
      document.visibilityState === "hidden" && checkpointCurrent()
    // Capture: a press ends before the control's own pointerup handler runs.
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("message", onMessage)
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("pointercancel", onPointerUp, true)
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("pagehide", checkpointCurrent)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("message", onMessage)
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("pointercancel", onPointerUp, true)
      document.removeEventListener("visibilitychange", onHide)
      window.removeEventListener("pagehide", checkpointCurrent)
    }
  }, [])
}

/** A pointer press starting (`true`) or ending. */
export function setPressed(pressed: boolean) {
  press = pressed ? ++presses : 0
}
