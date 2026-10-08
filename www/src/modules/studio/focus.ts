"use client"

// What the panel is editing, for the preview to show: the open page or popover row.

import { useContext, useEffect, useSyncExternalStore } from "react"
import {
  OverlayTriggerStateContext,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components"

interface PreviewFocus {
  /** A board id: the open page, else the chapter the row sits in. */
  board: string
  /** The member section the row sits in. */
  member?: string
  /** The key the row edits. */
  axis?: string
  /** Every key the row edits, when it edits several. */
  holds?: string[]
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

/** A trigger outside any page or chapter sits in another popover: it keeps that one's board. */
export function focusOf(
  trigger: Trigger,
  outer: PreviewFocus | null,
): PreviewFocus | null {
  const board =
    trigger.closest("[data-page]")?.getAttribute("data-page") ??
    trigger.closest("[data-chapter]")?.getAttribute("data-chapter")
  const row = trigger.closest("[data-axis], [data-holds]")
  const holds = row?.getAttribute("data-holds")?.split(" ").filter(Boolean)
  const axis = row?.getAttribute("data-axis") || holds?.[0]
  const keys = { axis, ...(holds && holds.length > 1 && { holds }) }
  if (board)
    return {
      board,
      member:
        trigger.closest("[data-member]")?.getAttribute("data-member") ??
        undefined,
      ...keys,
      popover: true,
    }
  if (!outer?.popover) return null
  return axis ? { ...outer, holds: undefined, ...keys } : outer
}

/** Pushes a popover's focus until the returned cleanup runs. */
export function pushPopoverFocus(trigger: Trigger, popover = true) {
  const focus = focusOf(trigger, popovers.at(-1)?.focus ?? null)
  if (!focus) return () => {}
  if (!popover) focus.popover = popovers.length > 0
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

let held: { row: Element; release: () => void } | null = null

/** A row edited in place (segmented, slider): its focus until the pointer or keyboard moves off it. */
export function holdEditFocus(row: Element | null) {
  if (!row || held?.row === row) return
  held?.release()
  const pop = pushPopoverFocus(row, false)
  const leave = (event: Event) => {
    const to =
      event.type === "pointerout"
        ? (event as PointerEvent).relatedTarget
        : event.target
    if (row.isConnected && to instanceof Node && row.contains(to)) return
    release()
  }
  const events = ["pointerout", "pointerdown", "focusin"] as const
  const release = () => {
    for (const type of events) document.removeEventListener(type, leave, true)
    pop()
    held = null
  }
  for (const type of events) document.addEventListener(type, leave, true)
  held = { row, release }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const previewFocus = () => current

export const usePreviewFocus = () =>
  useSyncExternalStore(subscribe, previewFocus, () => null)
