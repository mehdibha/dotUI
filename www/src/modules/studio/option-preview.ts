"use client"

// Options inside an opened panel popover preview on hover; inline rows don't.

import { createContext, useContext, useEffect } from "react"
import type { FocusEvent, RefObject } from "react"
import type { HoverEvent } from "react-aria"
import { getInteractionModality } from "react-aria/private/interactions/useFocusVisible"

import { clearLive, previewSettled, showLive } from "./live"

/** Provided by PanelPopover: the options inside it preview. */
export const OptionPreviewScope = createContext(false)

// Per popover element (a Select also renders a hidden item copy outside it):
// keyboard previews arm on a navigation key, hover ones on a pointer move.
const keyed = new WeakSet<Element>()
const moved = new WeakSet<Element>()
// Focus that Tab moves previews nothing.
let lastKey = ""
// The option a still pointer rests on as its popover opens: it previews once
// the pointer moves, with the run its latest render gave it.
let resting: Element | null = null
const runs = new WeakMap<Element, () => void>()
// The option whose keyboard focus previews: leaving it withdraws the preview.
let focused: Element | null = null

const NAVIGATION = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
])

function hover(run: () => void) {
  resting = null
  focused = null
  previewSettled(run)
}

const navigates = (e: KeyboardEvent) =>
  NAVIGATION.has(e.key) ||
  (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)

function within(armed: WeakSet<Element>, el: Element | null) {
  for (; el; el = el.parentElement) if (armed.has(el)) return true
  return false
}

/** PanelPopover's ref: arms previews once a key navigates or the pointer
 *  moves in it, and drops any preview as it closes. */
export function watchPopover(popover: HTMLElement | null) {
  if (!popover) return
  // On the window, capturing: toolbars and lists stop the keys they handle.
  const onKeyDown = (e: KeyboardEvent) => {
    lastKey = e.key
    if (navigates(e) && popover.contains(e.target as Node)) keyed.add(popover)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
    moved.add(popover)
    popover.removeEventListener("pointermove", onPointerMove)
    const run = resting && popover.contains(resting) && runs.get(resting)
    if (run) hover(run)
  }
  window.addEventListener("keydown", onKeyDown, true)
  popover.addEventListener("pointermove", onPointerMove)
  return () => {
    window.removeEventListener("keydown", onKeyDown, true)
    popover.removeEventListener("pointermove", onPointerMove)
    keyed.delete(popover)
    moved.delete(popover)
    if (resting && popover.contains(resting)) resting = null
    clearLive()
  }
}

export interface OptionPreviewProps {
  ref?: (option: Element | null) => void
  onHoverStart?: (e: HoverEvent) => void
  onHoverEnd?: (e: HoverEvent) => void
  onFocus?: (e: FocusEvent<Element>) => void
  onBlur?: (e: FocusEvent<Element>) => void
}

/** Previews `run` on hover once the pointer has moved, or on keyboard focus
 *  once a key has navigated: never on what a popover opens with. */
export function optionPreviewProps(
  enabled: boolean,
  run: (() => void) | undefined,
): OptionPreviewProps {
  if (!enabled || !run) return {}
  return {
    ref: (option) => {
      if (option) runs.set(option, run)
    },
    onHoverStart: (e) => {
      if (within(moved, e.target)) hover(run)
      else resting = e.target
    },
    onHoverEnd: (e) => {
      if (resting === e.target) resting = null
    },
    onFocus: (e) => {
      if (
        getInteractionModality() !== "keyboard" ||
        lastKey === "Tab" ||
        !within(keyed, e.currentTarget)
      )
        return
      focused = e.currentTarget
      previewSettled(run)
    },
    // The next option's focus or hover replaces the clear.
    onBlur: (e) => {
      if (e.currentTarget !== focused) return
      focused = null
      showLive(null, { settle: true })
    },
  }
}

export function useOptionPreview() {
  const enabled = useContext(OptionPreviewScope)
  return (run: (() => void) | undefined) => optionPreviewProps(enabled, run)
}

/** Virtual focus (Autocomplete) fires no focus event: `option`'s highlight
 *  previews once a key has navigated, until it moves on. */
export function useHighlightPreview(
  option: RefObject<Element | null>,
  highlighted: boolean,
  run: () => void,
) {
  const enabled = useContext(OptionPreviewScope)
  useEffect(() => {
    if (!enabled || !highlighted) return
    return highlightPreview(option.current, run)
    // Only the highlight arriving previews; `run` is new every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, highlighted])
}

/** The highlight's preview, and what withdraws it as it moves on. */
export function highlightPreview(option: Element | null, run: () => void) {
  if (!within(keyed, option)) return
  previewSettled(run)
  return () => showLive(null, { settle: true })
}
