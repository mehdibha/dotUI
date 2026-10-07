"use client"

/* What the panel is working on, for the preview to show: the open page, or
   the row whose popover is open. */

import { useContext, useEffect, useSyncExternalStore } from "react"
import {
  OverlayTriggerStateContext,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components"

export interface PreviewFocus {
  /** A board id: the open page, else the chapter the row sits in. */
  board: string
  /** The member section the row sits in. */
  member?: string
  /** The key the row edits. */
  axis?: string
  /** A panel popover is open. */
  popover: boolean
}

/** The part of a trigger element focus is read from. */
interface Trigger {
  closest(selector: string): {
    getAttribute(name: string): string | null
  } | null
}

let page: string | null = null
let popovers: { id: symbol; focus: PreviewFocus }[] = []
let current: PreviewFocus | null = null
const listeners = new Set<() => void>()

function update() {
  current =
    popovers.at(-1)?.focus ?? (page ? { board: page, popover: false } : null)
  for (const listener of listeners) listener()
}

export function setPageFocus(id: string | null) {
  if (page === id) return
  page = id
  update()
}

/** A popover's focus, read off its trigger. A trigger outside any page or
 *  chapter sits in another popover: it keeps that popover's board. */
export function focusOf(
  trigger: Trigger,
  outer: PreviewFocus | null,
): PreviewFocus | null {
  const board =
    trigger.closest("[data-page]")?.getAttribute("data-page") ??
    trigger.closest("[data-chapter]")?.getAttribute("data-chapter")
  const row = trigger.closest("[data-axis], [data-holds]")
  const axis =
    row?.getAttribute("data-axis") ??
    row?.getAttribute("data-holds")?.split(" ")[0]
  if (board)
    return {
      board,
      member:
        trigger.closest("[data-member]")?.getAttribute("data-member") ??
        undefined,
      axis: axis || undefined,
      popover: true,
    }
  if (!outer?.popover) return null
  return { ...outer, axis: axis || outer.axis }
}

/** Pushes a popover's focus until the returned cleanup runs. */
export function pushPopoverFocus(trigger: Trigger) {
  const focus = focusOf(trigger, popovers.at(-1)?.focus ?? null)
  if (!focus) return () => {}
  const id = Symbol()
  popovers = [...popovers, { id, focus }]
  update()
  return () => {
    popovers = popovers.filter((entry) => entry.id !== id)
    update()
  }
}

/** In a panel popover: its trigger's focus while it is open. */
export function usePopoverFocus() {
  const state = useContext(OverlayTriggerStateContext)
  const triggerRef = useSlottedContext(PopoverContext)?.triggerRef
  const isOpen = state?.isOpen ?? false
  useEffect(() => {
    const trigger = triggerRef?.current
    if (!isOpen || !trigger) return
    return pushPopoverFocus(trigger)
  }, [isOpen, triggerRef])
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const previewFocus = () => current

export const usePreviewFocus = () =>
  useSyncExternalStore(subscribe, previewFocus, () => null)
