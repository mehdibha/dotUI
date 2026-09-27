"use client"

/* The one current design system, shared by the studio and the docs:
   `dotui:current` holds a view or one of the user's systems. Every tab
   follows it. Views are read-only; the studio forks the first edit of one
   into a system (see history.ts). */

import { useMemo } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import { SNAPSHOT_ID } from "@/lib/snapshots/snapshot"
import { getPreset, ORIGIN } from "@/modules/presets"
import { salvageState, sameState } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import * as workspace from "./workspace"
import type { DesignSystemDoc, Workspace } from "./workspace"

/** A read-only starting point: a preset, or a shared link's snapshot. */
export type View =
  | { kind: "preset"; id: string }
  | { kind: "link"; id: string; name: string; state: StudioState }

export type Selection = View | { kind: "system"; id: string }

const ORIGIN_VIEW: Selection = { kind: "preset", id: ORIGIN.id }

function parseSelection(raw: unknown): Selection | undefined {
  if (typeof raw !== "object" || raw === null) return
  const sel = raw as Record<string, unknown>
  if (typeof sel.id !== "string") return
  if (sel.kind === "preset" && getPreset(sel.id))
    return { kind: "preset", id: sel.id }
  if (sel.kind === "system" && sel.id) return { kind: "system", id: sel.id }
  if (
    sel.kind === "link" &&
    SNAPSHOT_ID.test(sel.id) &&
    workspace.isName(sel.name)
  )
    return {
      kind: "link",
      id: sel.id,
      name: sel.name,
      state: salvageState(sel.state),
    }
}

/** A system as a fork made it, before any change. */
type Fork = Pick<DesignSystemDoc, "id" | "state">

interface Stored {
  sel: Selection
  at: number
  /** Set while the current selection is a fork no one kept yet. */
  fork?: Fork
}

function parseFork(raw: unknown): Fork | undefined {
  if (typeof raw !== "object" || raw === null) return
  const fork = raw as Record<string, unknown>
  if (typeof fork.id === "string")
    return { id: fork.id, state: salvageState(fork.state) }
}

const store = createPersistedStore<Stored | null>("dotui:current", null, {
  // Unreadable is Origin: it's only a pointer, safe to write over.
  decode: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      const sel = parseSelection(parsed.sel)
      if (!sel || typeof parsed.at !== "number") return null
      return { sel, at: parsed.at, fork: parseFork(parsed.fork) }
    } catch {
      return null
    }
  },
  encode: (value) => (value ? JSON.stringify(value) : null),
  onWriteError: workspace.storageFailed,
})

export const getSelection = (): Selection => store.get()?.sel ?? ORIGIN_VIEW

/** One key per selection: `preset:<id>`, `link:<id>` or `system:<id>`. */
export const selectionKey = (sel: Selection) => `${sel.kind}:${sel.id}`

/** Makes `sel` current; `made` marks it as a fork just made. Leaving a fork
 *  still unchanged and never kept removes it. */
export function select(sel: Selection, made?: Fork): void {
  workspace.flush()
  const previous = store.get()
  if (selectionKey(previous?.sel ?? ORIGIN_VIEW) === selectionKey(sel)) return
  const fork = previous?.fork
  const doc = fork && workspace.findSystem(fork.id)
  if (doc && sameState(doc.state, fork.state)) workspace.remove(doc.id)
  store.set({
    sel,
    at: Date.now(),
    fork: made && { id: made.id, state: made.state },
  })
}

/** Keeps the system on leave even unchanged: the user renamed or copied it. */
export function keep(id: string): void {
  const value = store.get()
  if (value?.fork?.id === id) store.set({ ...value, fork: undefined })
}

export interface Current {
  sel: Selection
  key: string
  name: string
  swatch: string
  state: StudioState
  /** The user's system; absent on views. */
  doc?: DesignSystemDoc
  tag?: "Preset" | "Shared"
}

/** What a selection shows; a system that no longer exists shows Origin. */
export function describe(sel: Selection, ws: Workspace): Current {
  if (sel.kind === "system") {
    const doc = ws.systems.find((s) => s.id === sel.id)
    if (doc)
      return {
        sel,
        key: selectionKey(sel),
        name: doc.name,
        swatch: workspace.swatchOf(doc),
        state: doc.state,
        doc,
      }
  }
  if (sel.kind === "link")
    return {
      sel,
      key: selectionKey(sel),
      name: sel.name,
      swatch: sel.state.brand,
      state: sel.state,
      tag: "Shared",
    }
  const preset = (sel.kind === "preset" && getPreset(sel.id)) || ORIGIN
  const view: Selection = { kind: "preset", id: preset.id }
  return {
    sel: view,
    key: selectionKey(view),
    name: preset.name,
    swatch: preset.swatch,
    state: preset.state,
    tag: "Preset",
  }
}

export const getCurrent = () =>
  describe(getSelection(), workspace.getWorkspace())

export function useCurrent(): Current {
  const sel = store.useValue()?.sel ?? ORIGIN_VIEW
  const ws = workspace.useWorkspace()
  return useMemo(() => describe(sel, ws), [sel, ws])
}
