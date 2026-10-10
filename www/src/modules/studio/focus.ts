"use client"

// What the panel is editing, for the preview to show: the open page or popover row.

import { useContext, useEffect, useSyncExternalStore } from "react"
import {
  OverlayTriggerStateContext,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components"

import type { BoardId } from "./preview/boards/titles"

/** A board, at a member's section. */
export interface Place {
  board: BoardId
  member?: string
}

interface PreviewFocus extends Place {
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

// A component page's section on its board carries the page's id.
const on = (board: BoardId, ...pages: string[]) =>
  Object.fromEntries(pages.map((page) => [page, { board, member: page }]))

/** Each panel page's place in the preview. */
export const PAGE_PLACES: Record<string, Place> = {
  color: { board: "color" },
  typography: { board: "typography" },
  shape: { board: "shape" },
  interaction: { board: "states" },
  ...on("buttons", "button", "segmented-control"),
  ...on("inputs", "field", "select", "number-field", "otp-field"),
  ...on("selection", "checkbox", "radio", "switch", "slider", "choice-card"),
  ...on("dates", "calendar"),
  ...on("menus", "menu", "popover", "tooltip", "command"),
  ...on("dialogs", "dialog", "sheet"),
  ...on("nav", "link", "tabs", "sidebar", "breadcrumbs", "pagination"),
  ...on("display", "accordion", "card", "table", "avatar", "kbd"),
  ...on("charts", "chart"),
  ...on(
    "feedback",
    "badge",
    "alert",
    "toast",
    "progress",
    "spinner",
    "skeleton",
  ),
}

/** Main-page chapters: where their one-key component rows show. */
export const CHAPTER_PLACES: Record<string, Place> = {
  actions: { board: "buttons" },
  forms: { board: "inputs" },
  overlays: { board: "menus" },
  navigation: { board: "nav" },
  data: { board: "display" },
  feedback: { board: "feedback" },
}

/** Keys shown on a board of their own, wherever their row sits. */
export const KEY_BOARDS: Record<string, BoardId> = {
  style: "buttons",
  brand: "color",
  neutralTint: "color",
  neutralHue: "color",
  bodyFont: "typography",
  radiusPx: "shape",
  density: "space",
  iconLibrary: "icons",
  motion: "motion",
  mobilePickers: "menus",
}

let page: string | null = null
let popovers: { id: symbol; focus: PreviewFocus }[] = []
let current: PreviewFocus | null = null
const listeners = new Set<() => void>()

function update() {
  const place = page ? PAGE_PLACES[page] : undefined
  current =
    popovers.at(-1)?.focus ?? (place ? { ...place, popover: false } : null)
  for (const listener of listeners) listener()
}

export function setPageFocus(id: string | null) {
  if (page === id) return
  page = id
  update()
}

/** A panel row's place: its key's own board, else its page's or chapter's. */
function placeOf(
  axis: string | undefined,
  page: string | null | undefined,
  chapter: string | null | undefined,
): Place | undefined {
  const board = axis ? KEY_BOARDS[axis] : undefined
  if (board) return { board }
  if (page) return PAGE_PLACES[page]
  if (chapter) return CHAPTER_PLACES[chapter]
}

/** A trigger outside any page or chapter sits in another popover: it keeps that one's place. */
export function focusOf(
  trigger: Trigger,
  outer: PreviewFocus | null,
): PreviewFocus | null {
  const page = trigger.closest("[data-page]")?.getAttribute("data-page")
  const chapter = trigger
    .closest("[data-chapter]")
    ?.getAttribute("data-chapter")
  const row = trigger.closest("[data-axis], [data-holds]")
  const holds = row?.getAttribute("data-holds")?.split(" ").filter(Boolean)
  const axis = row?.getAttribute("data-axis") || holds?.[0]
  const keys = { axis, ...(holds && holds.length > 1 && { holds }) }
  if (page || chapter) {
    const place = placeOf(axis, page, chapter)
    return place ? { ...place, ...keys, popover: true } : null
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
