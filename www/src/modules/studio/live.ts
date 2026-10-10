"use client"

// What a drag or hover would commit, shown in the preview; never persisted.

import { useRef, useSyncExternalStore } from "react"
import type { PointerEvent } from "react"

import { sameState } from "./axes"
import type { StudioState } from "./axes"
import type { PreviewAssets } from "./preset/iframe-sync"

const SETTLE_MS = 50

let live: StudioState | null = null
let settleTimer: ReturnType<typeof setTimeout> | undefined
let capture: ((next: StudioState | null) => void) | undefined
// A drag's preview holds until its commit or drop.
let dragging = false
// The preview shows a drag's tick, or the commit or drop that ends it.
let fromDrag = false
const listeners = new Set<() => void>()

function show(next: StudioState | null) {
  clearTimeout(settleTimer)
  if (next === live || (next && live && sameState(next, live))) return
  live = next
  for (const listener of listeners) listener()
}

export const getLive = () => live

/** Whether the preview shows a drag's tick, or the commit or drop that
 *  ends it: those paint at once. */
export const isDragPreview = () => fromDrag

export function subscribeLive(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useLive = () =>
  useSyncExternalStore(subscribeLive, getLive, () => null)

/** Drops the overlay, and any preview about to show, at once. */
export function clearLive() {
  fromDrag = dragging
  dragging = false
  show(null)
}

/** Drops the overlay unless a drag holds it. */
export function clearSettled() {
  if (!dragging) clearLive()
}

/** Shows `next` over the committed design (null: the committed design);
 *  with `settle`, once nothing replaces it for SETTLE_MS. */
export function showLive(next: StudioState | null, { settle = false } = {}) {
  clearTimeout(settleTimer)
  const apply = () => {
    dragging = fromDrag = false
    show(next)
  }
  if (settle) settleTimer = setTimeout(apply, SETTLE_MS)
  else apply()
}

/** What `run` commits through edit(): undefined if it doesn't edit, null if
 *  the edit lands on the committed state. */
function captured(run: () => void): StudioState | null | undefined {
  let caught: StudioState | null | undefined
  const outer = capture
  capture = (next) => {
    caught = next
  }
  try {
    run()
  } finally {
    capture = outer
  }
  return caught
}

/** Previews what `run` would commit, at once: a drag's tick. */
export function previewNow(run: () => void) {
  const next = captured(run)
  if (next === undefined) return
  dragging = fromDrag = true
  show(next)
}

/** A RAC slider's changes: a pointer's drag previews them and commits on
 *  release; a key or assistive-tech step commits at once. */
export function useSliderPreview<T>(commit: (value: T) => void) {
  const held = useRef(false)
  return {
    // RAC drags only on an unmodified primary press.
    onPointerDownCapture: (e: PointerEvent) => {
      held.current = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.altKey
    },
    onChange: (value: T) =>
      held.current ? previewNow(() => commit(value)) : commit(value),
    onChangeEnd: (value: T) => {
      held.current = false
      commit(value)
    },
  }
}

/** Previews what `run` would commit once it settles: a hover or a keyboard
 *  highlight. */
export function previewSettled(run: () => void) {
  const next = captured(run)
  if (next !== undefined) showLive(next, { settle: true })
}

/** edit()'s hook: takes `next` while a preview captures it. */
export function captureEdit(next: StudioState, committed: StudioState) {
  if (!capture) return false
  capture(sameState(next, committed) ? null : next)
  return true
}

const warmers = new Set<(assets: PreviewAssets) => void>()

/** Starts loading `assets` in the preview now, so a hover that lands on them
 *  shows no fallback. */
export function warmPreview(assets: PreviewAssets) {
  for (const warm of warmers) warm(assets)
}

export function onWarmPreview(warm: (assets: PreviewAssets) => void) {
  warmers.add(warm)
  return () => {
    warmers.delete(warm)
  }
}
