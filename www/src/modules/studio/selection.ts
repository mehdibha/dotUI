"use client"

/* The one current design system, shared by the studio and the docs:
   `dotui:current` holds a view, the unsaved slot over one, or one of the
   user's systems, and the visit it was opened for. Every tab follows it. */

import { useMemo } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import { getPreset, ORIGIN } from "@/modules/presets"
import type { StudioState } from "@/modules/studio/axes"

import * as workspace from "./workspace"
import type { DesignSystemDoc, Unsaved, View, Workspace } from "./workspace"

export type { View }

export type Selection =
  | View
  | { kind: "system"; id: string }
  | { kind: "unsaved" }

/** What marks the slot's name, which never truncates away. */
export const UNSAVED_NOTE = "(unsaved)"

const ORIGIN_VIEW: View = { kind: "preset", id: ORIGIN.id }

function parseSelection(raw: unknown): Selection | undefined {
  if (typeof raw !== "object" || raw === null) return
  const sel = raw as Record<string, unknown>
  if (sel.kind === "unsaved") return { kind: "unsaved" }
  if (sel.kind === "system" && typeof sel.id === "string" && sel.id)
    return { kind: "system", id: sel.id }
  return workspace.parseView(raw)
}

interface Stored {
  sel: Selection
  /** New each time a design system is opened, in any tab: what this tab
   *  keeps for a visit (a view's undo history) never outlives it. */
  visit?: string
}

const store = createPersistedStore<Stored | null>("dotui:current", null, {
  // Unreadable is Origin: it's only a pointer, safe to write over.
  decode: (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw)
      const sel = parseSelection(parsed)
      const { visit } = parsed as { visit?: unknown }
      return sel
        ? { sel, visit: typeof visit === "string" ? visit : undefined }
        : null
    } catch {
      return null
    }
  },
  encode: (stored) =>
    stored ? JSON.stringify({ ...stored.sel, visit: stored.visit }) : null,
  onWriteError: workspace.storageFailed,
})

export const getSelection = (): Selection => store.get()?.sel ?? ORIGIN_VIEW

export const getVisit = () => store.get()?.visit

/** One key per selection: `preset:<id>`, `link:<id>`, `system:<id>` or
 *  `unsaved`. */
export const selectionKey = (sel: Selection) =>
  sel.kind === "unsaved" ? "unsaved" : `${sel.kind}:${sel.id}`

/** The preset or system a picker key stands for. */
export function keySelection(key: string): Selection {
  const id = key.slice(key.indexOf(":") + 1)
  return key.startsWith("system:")
    ? { kind: "system", id }
    : { kind: "preset", id }
}

/** Makes `sel` current, after writing any pending edit: other tabs never
 *  see a selection before what it shows. Opening a design system is
 *  history's `select`, which starts a visit and drops the slot; otherwise
 *  the visit goes on. */
export function setSelection(sel: Selection, visit = getVisit()): void {
  if (
    selectionKey(getSelection()) === selectionKey(sel) &&
    visit === getVisit()
  )
    return
  workspace.flush()
  store.set({ sel, visit })
}

export type Current = {
  sel: Selection
  key: string
  name: string
  swatch: string
  state: StudioState
  /** On the unsaved slot. */
  unsaved?: Unsaved
  /** What Share and Export snapshot; a view is shared as itself. */
  content?: { name: string; state: StudioState }
} & (
  | { doc: DesignSystemDoc; view?: undefined }
  /** The view on screen, or the one the unsaved slot edits. */
  | { doc?: undefined; view: View }
)

/** The base's swatch until the brand changes. */
const swatchOver = (
  state: StudioState,
  base?: { state: StudioState; swatch: string },
) => (base && state.brand === base.state.brand ? base.swatch : state.brand)

/** What a selection shows; a system or slot that no longer exists shows
 *  Origin. */
export function describe(sel: Selection, ws: Workspace): Current {
  const key = selectionKey(sel)
  if (sel.kind === "system") {
    const doc = ws.systems.find((s) => s.id === sel.id)
    if (doc)
      return {
        sel,
        key,
        name: doc.name,
        swatch: swatchOver(
          doc.state,
          doc.from ? getPreset(doc.from) : undefined,
        ),
        state: doc.state,
        doc,
        content: { name: doc.name, state: doc.state },
      }
  }
  if (sel.kind === "unsaved" && ws.unsaved) {
    const { from, state } = ws.unsaved
    const base = describe(from, ws)
    return {
      sel,
      key,
      name: `${workspace.unedited(base.name)} ${UNSAVED_NOTE}`,
      swatch: swatchOver(state, base),
      state,
      view: from,
      unsaved: ws.unsaved,
      content: {
        name: workspace.uniqueName(
          workspace.unedited(base.name),
          [],
          " (edited)",
        ),
        state,
      },
    }
  }
  if (sel.kind === "link")
    return {
      sel,
      key,
      name: sel.name,
      swatch: sel.state.brand,
      state: sel.state,
      view: sel,
    }
  const preset = (sel.kind === "preset" && getPreset(sel.id)) || ORIGIN
  const view: View = { kind: "preset", id: preset.id }
  return {
    sel: view,
    key: selectionKey(view),
    name: preset.name,
    swatch: preset.swatch,
    state: preset.state,
    view,
  }
}

export const getCurrent = () =>
  describe(getSelection(), workspace.getWorkspace())

export function useCurrent(): Current {
  const sel = store.useValue()?.sel ?? ORIGIN_VIEW
  const ws = workspace.useWorkspace()
  return useMemo(() => describe(sel, ws), [sel, ws])
}
