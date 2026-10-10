"use client"

/* The one current design system, shared by the studio and the docs, and
   every change to it. `dotui:current` holds a view, the unsaved slot over
   one, or one of the user's systems; every tab follows it. Editing a view
   fills the slot, which lasts while it differs from its view: Reset, Save,
   or opening anything else, in any tab, drops it silently. */

import { useMemo } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import { getPreset, ORIGIN } from "@/modules/presets"
import { sameState } from "@/modules/studio/axes"
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
const UNSAVED: Selection = { kind: "unsaved" }

function parseSelection(raw: unknown): Selection | undefined {
  if (typeof raw !== "object" || raw === null) return
  const sel = raw as Record<string, unknown>
  if (sel.kind === "unsaved") return { kind: "unsaved" }
  if (sel.kind === "system" && typeof sel.id === "string" && sel.id)
    return { kind: "system", id: sel.id }
  return workspace.parseView(raw)
}

// Origin is the fallback, never stored: see preview-pending.ts.
const store = createPersistedStore<Selection>("dotui:current", ORIGIN_VIEW, {
  // Unreadable is Origin: it's only a pointer, safe to write over.
  decode: (raw) => {
    try {
      return parseSelection(JSON.parse(raw)) ?? ORIGIN_VIEW
    } catch {
      return ORIGIN_VIEW
    }
  },
  encode: (sel) => JSON.stringify(sel, workspace.stampStates),
  onWriteError: workspace.storageFailed,
})

const getSelection = store.get

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
 *  see a selection before what it shows. */
function setSelection(sel: Selection): void {
  if (selectionKey(getSelection()) === selectionKey(sel)) return
  workspace.flush()
  store.set(sel)
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
  const sel = store.useValue()
  const ws = workspace.useWorkspace()
  return useMemo(() => describe(sel, ws), [sel, ws])
}

/** Edits the design on screen: a system saves itself; a view fills the
 *  slot, which empties once the edit lands back on the view. */
export function edit(next: StudioState): void {
  const current = getCurrent()
  if (sameState(current.state, next)) return
  if (current.doc) {
    workspace.setState(current.doc.id, next)
    return
  }
  const { view } = current
  if (sameState(next, describe(view, workspace.getWorkspace()).state))
    select(view)
  else if (workspace.setUnsaved({ from: view, state: next }))
    setSelection(UNSAVED)
}

/** Opens `sel`, dropping the slot: back on its view, it starts pristine.
 *  The slot goes after the selection: no tab is left on a missing slot. */
export function select(sel: Selection): void {
  if (selectionKey(getSelection()) === selectionKey(sel)) return
  setSelection(sel)
  workspace.setUnsaved(undefined)
  workspace.flush()
}

/** Drops the slot for its untouched view. */
export function reset(): void {
  const { unsaved } = getCurrent()
  if (unsaved) select(unsaved.from)
}

/** Creates a system named `name` from what `source` shows, and opens it:
 *  from the slot, that saves it. */
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
  if (doc) select({ kind: "system", id: doc.id })
  return doc
}

/** Deletes the system. Deleting the current one opens the next in the
 *  list, else Origin. */
export function remove(id: string): void {
  const list = workspace.listed(workspace.getWorkspace())
  const at = list.findIndex((s) => s.id === id)
  if (at === -1) return
  // Off it first: other tabs never show a selection that's gone.
  if (selectionKey(getSelection()) === `system:${id}`) {
    const next = list[at + 1] ?? list[at - 1]
    select(next ? { kind: "system", id: next.id } : ORIGIN_VIEW)
  }
  workspace.remove(id)
}
