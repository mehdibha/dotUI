"use client"

// What a drag or hover would commit, shown in the preview; never persisted.

import { useSyncExternalStore } from "react"

import { sameState } from "./axes"
import type { StudioState } from "./axes"
import type { PreviewAssets } from "./preset/iframe-sync"

const SETTLE_MS = 50
const LIFT = ["pointerup", "pointercancel"] as const

let live: StudioState | null = null
let settleTimer: ReturnType<typeof setTimeout> | undefined
let capture: ((next: StudioState | null) => void) | undefined
// Hovers fire mid-drag (RAC sliders don't capture the pointer): drags win.
let dragging = false
const listeners = new Set<() => void>()

function show(next: StudioState | null) {
  clearTimeout(settleTimer)
  if (next === live || (next && live && sameState(next, live))) return
  live = next
  for (const listener of listeners) listener()
}

export const getLive = () => live

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
  if (dragging) {
    dragging = false
    for (const type of LIFT) window.removeEventListener(type, lift, true)
  }
  show(null)
}

/** Shows `next` over the committed design (null: the committed design);
 *  with `settle`, once nothing replaces it for SETTLE_MS. */
export function showLive(next: StudioState | null, { settle = false } = {}) {
  if (!settle) return show(next)
  if (dragging) return
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => show(next), SETTLE_MS)
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

// After the release's own handlers: a drag that didn't commit drops.
function lift() {
  setTimeout(() => dragging && clearLive())
}

/** Previews what `run` would commit, at once: a drag tick. */
export function previewNow(run: () => void) {
  const next = captured(run)
  if (next === undefined) return
  if (!dragging) {
    dragging = true
    for (const type of LIFT) window.addEventListener(type, lift, true)
  }
  show(next)
}

/** Previews what `run` would commit once it settles: a hover or a keyboard
 *  highlight. */
export function previewSettled(run: () => void) {
  if (dragging) return
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
