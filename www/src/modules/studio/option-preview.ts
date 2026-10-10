"use client"

// Options inside an opened panel popover preview on hover; inline rows don't.

import { createContext, useContext, useEffect } from "react"
import type { PointerEvent } from "react"
import { getInteractionModality } from "react-aria/private/interactions/useFocusVisible"

import { clearLive, clearSettled, previewSettled, showLive } from "./live"

/** Provided by PanelPopover: the options inside it preview. */
export const OptionPreviewScope = createContext(false)

/** PanelPopover's: leaving or closing it drops the preview at once. */
export const popoverPreviewProps = {
  ref: () => clearLive,
  onPointerLeave: () => clearSettled(),
}

/** Previews `run` once a mouse moving over the option settles, or on keyboard
 *  focus. A pressed pointer is dragging something else. */
export function optionPreviewProps(enabled: boolean, run: () => void) {
  if (!enabled) return {}
  return {
    onPointerMove: (e: PointerEvent<Element>) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
      if (e.buttons || e.currentTarget.hasAttribute("data-disabled")) return
      previewSettled(run)
    },
    // The next option's preview replaces the withdrawal.
    onPointerLeave: (e: PointerEvent) => {
      if (!e.buttons) showLive(null, { settle: true })
    },
    onFocus: () => {
      if (getInteractionModality() === "keyboard") previewSettled(run)
    },
  }
}

export function useOptionPreview() {
  const enabled = useContext(OptionPreviewScope)
  return (run: () => void) => optionPreviewProps(enabled, run)
}

/** Virtual focus fires no focus event: the keyboard highlight previews. */
export function useHighlightPreview(highlighted: boolean, run: () => void) {
  const enabled = useContext(OptionPreviewScope)
  useEffect(() => {
    if (!enabled || !highlighted) return
    previewSettled(run)
    return () => showLive(null, { settle: true })
    // Only the highlight arriving previews; `run` is new every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, highlighted])
}
