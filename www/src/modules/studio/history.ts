"use client"

/* Every change to the design on screen. Edits are undoable: each system, and
   each visit to a view, keeps an in-memory undo stack; edits within 500 ms,
   or within one pointer press (a slider drag), merge into one step. Editing
   a view fills the one unsaved slot, which lasts only while it differs from
   its view: undoing back to the view empties it. Opening anything else, in
   any tab, drops the slot and ends the visit, silently; Save makes the slot
   a system. Delete has an Undo toast. */

import { useEffect, useEffectEvent, useSyncExternalStore } from "react"

import { toastManager } from "@/registry/ui/toast"
import { getPreset, ORIGIN } from "@/modules/presets"

import { sameState } from "./axes"
import type { StudioState } from "./axes"
import { shortcutOf } from "./history-keys"
import type { Shortcut } from "./history-keys"
import {
  describe,
  getCurrent,
  getSelection,
  getVisit,
  selectionKey,
  setSelection,
  useCurrent,
} from "./selection"
import type { Current, Selection } from "./selection"
import * as workspace from "./workspace"
import type { DesignSystemDoc, Unsaved } from "./workspace"

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
  /** The state as this tab last left it: another tab's edit since makes the
   *  stack stale. */
  head: StudioState
}

// By target key.
const stacks = new Map<string, Stack>()
const listeners = new Set<() => void>()
// The pointer press in progress (0 when none), so a drag is one step.
let press = 0
let presses = 0
// The target each held pointer went down on: a drag never commits onto a
// design opened meanwhile.
const pressedOn = new Map<number, string>()

function emit() {
  for (const listener of listeners) listener()
}

function push(steps: StudioState[], state: StudioState) {
  steps.push(state)
  if (steps.length > UNDO_LIMIT) steps.shift()
}

/** A 10 s toast whose Undo runs `restore`, then `afterUndo`. */
function undoToast(title: string, restore: () => void, afterUndo?: () => void) {
  const toast = toastManager.add({
    title,
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
}

const UNSAVED: Selection = { kind: "unsaved" }

/** What an edit changes: the system on screen, or the slot over the view on
 *  screen, empty on the view itself. The slot and its view share a key,
 *  which a new visit changes. */
interface Target {
  key: string
  state: StudioState
  /** False when the state was refused. */
  set: (state: StudioState) => boolean
}

function targetOf(current: Current): Target {
  const { state } = current
  if (current.doc) {
    const { id } = current.doc
    return {
      key: current.key,
      state,
      set: (next) => workspace.setState(id, next),
    }
  }
  const { view } = current
  return {
    key: `${selectionKey(view)}@${getVisit() ?? ""}`,
    state,
    set: (next) => {
      const back = sameState(
        next,
        describe(view, workspace.getWorkspace()).state,
      )
      if (!workspace.setUnsaved(back ? undefined : { from: view, state: next }))
        return false
      setSelection(back ? view : UNSAVED)
      return true
    },
  }
}

/** The target's stack, unless another tab changed its state since. */
function live(target: Target): Stack | undefined {
  const stack = stacks.get(target.key)
  if (stack && sameState(stack.head, target.state)) return stack
}

/** The target's live stack, else a new one: undo never steps back over
 *  another tab's edit. Only the view on screen keeps one. */
function stackOf(target: Target): Stack {
  let stack = live(target)
  if (!stack) {
    for (const key of stacks.keys())
      if (!key.startsWith("system:")) stacks.delete(key)
    stack = { past: [], future: [], editedAt: 0, press: 0, head: target.state }
    stacks.set(target.key, stack)
  }
  return stack
}

/** Merges the edit into the last step when it's close enough in time or
 *  in the same press; otherwise starts a step returning to `before`. */
function record(stack: Stack, before: StudioState, next: StudioState) {
  const now = Date.now()
  const merge =
    now - stack.editedAt <= MERGE_MS || (press !== 0 && stack.press === press)
  stack.head = next
  stack.editedAt = now
  stack.press = press
  const start = stack.past.at(-1)
  if (!merge) {
    push(stack.past, before)
    stack.future = []
    emit()
  } else if (start && sameState(start, next)) {
    // A step back where it began is none; the next edit starts another.
    stack.past.pop()
    stack.editedAt = 0
    stack.press = 0
    emit()
  }
}

/** Edits the design on screen as one undoable step, merged with the edits
 *  just before it. */
export function edit(next: StudioState): void {
  const target = targetOf(getCurrent())
  if (sameState(target.state, next)) return
  const e = typeof window === "undefined" ? undefined : window.event
  const on = e && "pointerId" in e && pressedOn.get(e.pointerId as number)
  if (on && on !== target.key) return
  if (target.set(next)) record(stackOf(target), target.state, next)
}

/** Steps the design on screen back or forth; false when it can't. */
function travel(from: "past" | "future", to: "past" | "future"): boolean {
  const target = targetOf(getCurrent())
  const stack = live(target)
  const state = stack?.[from].at(-1)
  if (!stack || !state || !target.set(state)) return false
  stack[from].pop()
  stack.editedAt = 0
  stack.press = 0
  push(stack[to], target.state)
  stack.head = state
  emit()
  return true
}

export const undo = () => void travel("past", "future")
export const redo = () => void travel("future", "past")

/** Opens `sel` for a new visit. Leaving a view, or the slot over it, drops
 *  the slot and the view's undo history: back there, it starts pristine. */
export function select(sel: Selection): void {
  if (selectionKey(getSelection()) === selectionKey(sel)) return
  workspace.setUnsaved(undefined)
  setSelection(sel, Math.random().toString(36).slice(2, 10))
}

/** Save's name for the slot: "My Linear", or "Untitled" from Origin or an
 *  "Untitled" link; free in the list. */
export function saveName({ from }: Unsaved, systems: DesignSystemDoc[]) {
  const base =
    from.kind === "link"
      ? workspace.unedited(from.name)
      : from.id === ORIGIN.id
        ? "Untitled"
        : (getPreset(from.id)?.name ?? "Untitled")
  return workspace.uniqueName(
    base === "Untitled" || base.startsWith("My ") ? base : `My ${base}`,
    systems,
  )
}

/** Creates a system named `name` from what `source` shows, and opens it.
 *  From the unsaved slot, that saves it: its undo history carries over. */
export function createFrom(
  name: string,
  source: Selection,
): DesignSystemDoc | undefined {
  const from = describe(source, workspace.getWorkspace())
  // Gone meanwhile.
  if (from.key !== selectionKey(source)) return
  const doc = workspace.create({
    name,
    from: from.doc
      ? from.doc.from
      : from.view.kind === "preset"
        ? from.view.id
        : undefined,
    state: from.state,
  })
  if (!doc) return
  const sel: Selection = { kind: "system", id: doc.id }
  const stack = from.unsaved && stacks.get(targetOf(from).key)
  if (stack) stacks.set(selectionKey(sel), stack)
  select(sel)
  return doc
}

/** Deletes the system with a toast whose Undo, which `afterUndo` follows,
 *  puts it back. Deleting the current one opens the next in the list, else
 *  the Origin view, whose undo history starts over: ⌘Z right after never
 *  touches it. Returns the toast's undo. */
export function remove(
  id: string,
  { afterUndo }: { afterUndo?: () => void } = {},
): () => void {
  const list = workspace.listed(workspace.getWorkspace())
  const sel: Selection = { kind: "system", id }
  const wasCurrent = selectionKey(getSelection()) === selectionKey(sel)
  const removed = workspace.remove(id)
  if (!removed) return () => {}
  const restore = () => {
    workspace.insert(removed.doc, removed.index)
    if (wasCurrent) select(sel)
  }
  undoToast(`Deleted ${quoted(removed.doc.name)}`, restore, afterUndo)
  if (wasCurrent) {
    const at = list.findIndex((s) => s.id === id)
    const next = list[at + 1] ?? list[at - 1]
    select(
      next
        ? { kind: "system", id: next.id }
        : { kind: "preset", id: ORIGIN.id },
    )
    stacks.delete(targetOf(getCurrent()).key)
    emit()
  }
  return restore
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const unsubscribe = workspace.subscribe(listener)
  return () => {
    listeners.delete(listener)
    unsubscribe()
  }
}

/** Whether the design on screen can be undone or redone here. */
export function useUndoRedo() {
  const current = useCurrent()
  // A primitive snapshot, so it is stable between changes.
  const flags = useSyncExternalStore(
    subscribe,
    () => {
      const entry = live(targetOf(current))
      return (entry?.past.length ? 1 : 0) | (entry?.future.length ? 2 : 0)
    },
    () => 0,
  )
  return { canUndo: (flags & 1) !== 0, canRedo: (flags & 2) !== 0 }
}

/** Runs `run` on a studio shortcut, pressed here or in the preview (which
 *  hands its keys up), in place of the browser's own action. */
export function useShortcut(shortcut: Shortcut, run: () => void) {
  const onShortcut = useEffectEvent(run)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shortcutOf(e) !== shortcut) return
      e.preventDefault()
      onShortcut()
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === "preview-shortcut" && e.data.action === shortcut)
        onShortcut()
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("message", onMessage)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("message", onMessage)
    }
  }, [shortcut])
}

/** The studio's history wiring: ⌘Z / ⇧⌘Z and press tracking. */
export function useHistory() {
  useShortcut("undo", undo)
  useShortcut("redo", redo)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => setPressed(true, e.pointerId)
    const onPointerUp = (e: PointerEvent) => setPressed(false, e.pointerId)
    // Capture: a press ends before the control's own pointerup handler runs.
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("pointercancel", onPointerUp, true)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("pointercancel", onPointerUp, true)
    }
  }, [])
}

/** A pointer press starting (`true`) or ending. */
export function setPressed(pressed: boolean, pointer?: number) {
  press = pressed ? ++presses : 0
  if (pointer === undefined) return
  if (pressed) pressedOn.set(pointer, targetOf(getCurrent()).key)
  // After the release's own handlers, which may commit the drag.
  else setTimeout(() => pressedOn.delete(pointer))
}
