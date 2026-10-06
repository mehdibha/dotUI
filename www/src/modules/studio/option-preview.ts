"use client"

// Options inside an opened panel popover preview on hover; inline rows don't.

import { createContext, useContext, useEffect } from "react"
import type { FocusEvent } from "react"
import { getInteractionModality } from "react-aria/private/interactions/useFocusVisible"

import { clearLive, previewSettled } from "./live"

/** Provided by PanelPopover: the options inside it preview. */
export const OptionPreviewScope = createContext(false)

// Keyed-in popovers, per element: a Select also renders a hidden item copy.
const navigated = new WeakSet<Element>()

function inNavigated(el: Element | null) {
  for (; el; el = el.parentElement) if (navigated.has(el)) return true
  return false
}

/** PanelPopover's ref: arms keyboard previews once a key goes down in it,
 *  and drops any preview as it closes. */
export function watchPopover(popover: HTMLElement | null) {
  if (!popover) return
  const onKeyDown = () => navigated.add(popover)
  popover.addEventListener("keydown", onKeyDown, true)
  return () => {
    popover.removeEventListener("keydown", onKeyDown, true)
    navigated.delete(popover)
    clearLive()
  }
}

export interface OptionPreviewProps {
  onHoverStart?: () => void
  onFocus?: (e: FocusEvent<Element>) => void
}

/** Previews `run` on hover, or on keyboard focus after a keypress: never on
 *  the focus a popover opens with. */
export function optionPreviewProps(
  enabled: boolean,
  run: (() => void) | undefined,
): OptionPreviewProps {
  if (!enabled || !run) return {}
  return {
    onHoverStart: () => previewSettled(run),
    onFocus: (e) => {
      if (
        getInteractionModality() === "keyboard" &&
        inNavigated(e.currentTarget)
      )
        previewSettled(run)
    },
  }
}

export function useOptionPreview() {
  const enabled = useContext(OptionPreviewScope)
  return (run: (() => void) | undefined) => optionPreviewProps(enabled, run)
}

/** Virtual focus (Autocomplete) fires no focus event: preview on highlight. */
export function useHighlightPreview(highlighted: boolean, run: () => void) {
  const enabled = useContext(OptionPreviewScope)
  useEffect(() => {
    if (enabled && highlighted) previewSettled(run)
    // Only the highlight arriving previews; `run` is new every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, highlighted])
}
