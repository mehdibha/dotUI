"use client"

/* The one current design system, shared by the studio and the docs:
   `dotui:current` holds a preset view, a shared view or one of the user's
   systems. Every tab follows it. Views are read-only; the studio turns the
   first edit of one into a draft (see history.ts). */

import { useMemo } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import { SNAPSHOT_ID } from "@/lib/snapshots/snapshot"
import { getPreset, ORIGIN } from "@/modules/presets"
import { validate } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import * as workspace from "./workspace"
import type { DesignSystemDoc, Workspace } from "./workspace"

export type Selection =
  | { kind: "preset"; id: string }
  | { kind: "shared"; id: string; name: string; state: StudioState }
  | { kind: "system"; id: string }

export type ViewSelection = Exclude<Selection, { kind: "system" }>

const ORIGIN_VIEW: Selection = { kind: "preset", id: ORIGIN.id }

function parseSelection(raw: unknown): Selection | undefined {
  if (typeof raw !== "object" || raw === null) return
  const sel = raw as Record<string, unknown>
  if (typeof sel.id !== "string") return
  if (sel.kind === "preset" && getPreset(sel.id))
    return { kind: "preset", id: sel.id }
  if (sel.kind === "system" && sel.id) return { kind: "system", id: sel.id }
  if (
    sel.kind === "shared" &&
    SNAPSHOT_ID.test(sel.id) &&
    workspace.isName(sel.name)
  ) {
    const state = validate(sel.state)
    if (state.ok)
      return { kind: "shared", id: sel.id, name: sel.name, state: state.state }
  }
}

const store = createPersistedStore<{ sel: Selection; at: number } | null>(
  "dotui:current",
  null,
  {
    decode: (raw) => {
      const parsed = JSON.parse(raw) as { sel?: unknown; at?: unknown }
      const sel = parseSelection(parsed.sel)
      return sel && typeof parsed.at === "number"
        ? { sel, at: parsed.at }
        : null
    },
    encode: (value) => (value ? JSON.stringify(value) : null),
    onWriteError: workspace.storageFailed,
  },
)

export const getSelection = (): Selection => store.get()?.sel ?? ORIGIN_VIEW

export const useSelection = (): Selection =>
  store.useValue()?.sel ?? ORIGIN_VIEW

/** One key per selection: `preset:<id>`, `shared:<id>` or `system:<id>`. */
export const selectionKey = (sel: Selection) => `${sel.kind}:${sel.id}`

/** Makes `sel` current, with no questions asked. A draft left unchanged is
 *  nothing to keep, so leaving it removes it. */
export function select(sel: Selection): void {
  workspace.flush()
  const previous = getSelection()
  if (selectionKey(previous) === selectionKey(sel)) return
  if (previous.kind === "system") {
    const doc = workspace.findSystem(previous.id)
    if (doc?.draft && !workspace.isChangedDraft(doc))
      workspace.remove(previous.id)
  }
  store.set({ sel, at: Date.now() })
}

export interface Current {
  sel: Selection
  key: string
  name: string
  swatch: string
  state: StudioState
  /** The user's system; absent on views. */
  doc?: DesignSystemDoc
  tag?: "Preset" | "Shared" | "Draft"
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
        swatch: doc.state.brand,
        state: doc.state,
        doc,
        tag: doc.draft ? "Draft" : undefined,
      }
  }
  if (sel.kind === "shared")
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
  const sel = useSelection()
  const ws = workspace.useWorkspace()
  return useMemo(() => describe(sel, ws), [sel, ws])
}

/** The studio link of a view. */
export function viewLink(sel: ViewSelection): string {
  const param = sel.kind === "preset" ? "preset" : "s"
  return `${window.location.origin}/studio?${param}=${sel.id}`
}
