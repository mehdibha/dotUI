"use client"

/* The user's design systems, and the one unsaved slot, kept in this browser.
   Records are read leniently (a bad field takes its default) and every write
   re-reads storage first, so tabs never clobber each other. Edits land in
   memory at once and in storage at most every 200 ms. What is on screen
   lives in `selection.ts`. */

import { useSyncExternalStore } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  cleanName,
  cutName,
  MAX_NAME_LENGTH,
  SNAPSHOT_ID,
  stripName,
} from "@/lib/snapshots/snapshot"
import { toastManager } from "@/registry/ui/toast"
import { getPreset, ORIGIN } from "@/modules/presets"
import {
  formatIssues,
  salvageState,
  sameState,
  validate,
} from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

/** A read-only starting point: a preset, or a shared link's snapshot. */
export type View =
  | { kind: "preset"; id: string }
  | { kind: "link"; id: string; name: string; state: StudioState }

export interface DesignSystemDoc {
  id: string
  name: string
  /** The preset it started from, whose swatch it shows until the brand
   *  changes. */
  from?: string
  state: StudioState
  updatedAt: number
}

/** Edits to a view, not saved as a system yet. */
export interface Unsaved {
  from: View
  state: StudioState
}

export interface Workspace {
  schema: 2
  systems: DesignSystemDoc[]
  unsaved?: Unsaved
}

const KEY = "dotui:design-systems"
const WRITE_INTERVAL = 200

// randomUUID only exists in secure contexts; LAN dev over http has none.
function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/* -------------------------------- reading -------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

const isName = (value: unknown): value is string =>
  typeof value === "string" && value === cleanName(value) && value.length > 0

export function parseView(raw: unknown): View | undefined {
  if (!isRecord(raw) || typeof raw.id !== "string") return
  if (raw.kind === "preset" && getPreset(raw.id))
    return { kind: "preset", id: raw.id }
  if (raw.kind === "link" && SNAPSHOT_ID.test(raw.id) && isName(raw.name))
    return {
      kind: "link",
      id: raw.id,
      name: raw.name,
      state: salvageState(raw.state),
    }
}

function parseDoc(raw: unknown): DesignSystemDoc | undefined {
  if (!isRecord(raw) || typeof raw.id !== "string" || !raw.id) return
  return {
    id: raw.id,
    name: (typeof raw.name === "string" && cleanName(raw.name)) || "Untitled",
    from:
      typeof raw.from === "string" && getPreset(raw.from)
        ? raw.from
        : undefined,
    state: salvageState(raw.state),
    updatedAt: isTime(raw.updatedAt) ? raw.updatedAt : 0,
  }
}

function parseUnsaved(raw: unknown): Unsaved | undefined {
  if (!isRecord(raw)) return
  const from = parseView(raw.from)
  if (from) return { from, state: salvageState(raw.state) }
}

/** A record without an id is dropped. Anything but schema 2 throws, so the
 *  store never writes over it. */
export function parseWorkspace(raw: string): Workspace {
  const parsed: unknown = JSON.parse(raw)
  if (!isRecord(parsed) || parsed.schema !== 2)
    throw new Error("Unknown design systems format")
  const systems: DesignSystemDoc[] = []
  for (const entry of Array.isArray(parsed.systems) ? parsed.systems : []) {
    const doc = parseDoc(entry)
    if (doc && !systems.some((s) => s.id === doc.id)) systems.push(doc)
  }
  return { schema: 2, systems, unsaved: parseUnsaved(parsed.unsaved) }
}

const EMPTY: Workspace = { schema: 2, systems: [] }

/** Stays until dismissed; the next failed write shows it again. */
export function storageFailed(unreadable = false) {
  const id = "storage-failed"
  toastManager.add({
    id,
    title: unreadable
      ? "Your saved design systems can't be read"
      : "Changes can't be saved in this browser",
    description: unreadable
      ? "They're left as they are, and new changes aren't saved."
      : undefined,
    type: "warning",
    timeout: 0,
    actionProps: {
      children: "Dismiss",
      onClick: () => toastManager.close(id),
    },
  })
}

const store = createPersistedStore<Workspace>(KEY, EMPTY, {
  decode: parseWorkspace,
  encode: (workspace) => JSON.stringify(workspace),
  onWriteError: storageFailed,
})

/** Whether stored systems can't be read: none are listed, and none is
 *  written over. */
export const isUnreadable = store.isUnreadable

/* --------------------------- the pending edit --------------------------- */

/** An edit to a system's state, or to the slot (`id` null). */
interface Edit {
  id: string | null
  apply: (workspace: Workspace) => Workspace
}

let pending: Edit | null = null
let timer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()
let overlay: { base: Workspace; edit: Edit; value: Workspace } | undefined

function withDoc(
  workspace: Workspace,
  id: string,
  change: (doc: DesignSystemDoc) => DesignSystemDoc,
): Workspace {
  const index = workspace.systems.findIndex((s) => s.id === id)
  if (index === -1) return workspace
  const systems = [...workspace.systems]
  systems[index] = change(systems[index]!)
  return { ...workspace, systems }
}

const withState = (state: StudioState) => (doc: DesignSystemDoc) =>
  sameState(doc.state, state) ? doc : { ...doc, state, updatedAt: Date.now() }

/** The workspace as the UI sees it: storage plus the unwritten edit. */
export function getWorkspace(): Workspace {
  const base = store.get()
  if (!pending) return base
  if (overlay?.base !== base || overlay.edit !== pending)
    overlay = { base, edit: pending, value: pending.apply(base) }
  return overlay.value
}

export const findSystem = (id: string) =>
  getWorkspace().systems.find((s) => s.id === id)

/** Writes the pending edit now. Every other operation flushes first. */
export function flush(): void {
  clearTimeout(timer)
  timer = undefined
  if (!pending) return
  const { apply } = pending
  pending = null
  store.update(apply)
}

function schedule(edit: Edit) {
  if (pending && pending.id !== edit.id) flush()
  pending = edit
  timer ??= setTimeout(flush, WRITE_INTERVAL)
  for (const listener of listeners) listener()
}

export function subscribe(onChange: () => void) {
  listeners.add(onChange)
  const unsubscribe = store.subscribe(onChange)
  return () => {
    listeners.delete(onChange)
    unsubscribe()
  }
}

export const useWorkspace = (): Workspace =>
  useSyncExternalStore(subscribe, getWorkspace, () => EMPTY)

/** The list as pickers show it: the latest edited first. */
export const listed = (workspace: Workspace): DesignSystemDoc[] =>
  [...workspace.systems].reverse().sort((a, b) => b.updatedAt - a.updatedAt)

/* ------------------------------ operations ------------------------------ */

function accepts(state: StudioState): boolean {
  // An invalid record would be dropped on the next read: refuse it here.
  const valid = validate(state)
  if (!valid.ok) console.error(formatIssues(valid.issues))
  return valid.ok
}

/** Edits the system's state; storage catches up within 200 ms. */
export function setState(id: string, state: StudioState): void {
  if (!accepts(state)) return
  schedule({
    id,
    apply: (workspace) => withDoc(workspace, id, withState(state)),
  })
}

const sameView = (a: View, b: View) => a.kind === b.kind && a.id === b.id

/** Fills or, with undefined, empties the slot; storage catches up within
 *  200 ms. Returns whether the state was accepted. */
export function setUnsaved(unsaved: Unsaved | undefined): boolean {
  if (unsaved && !accepts(unsaved.state)) return false
  schedule({
    id: null,
    apply: (workspace) => {
      const current = workspace.unsaved
      const same = unsaved
        ? current &&
          sameView(current.from, unsaved.from) &&
          sameState(current.state, unsaved.state)
        : !current
      return same ? workspace : { ...workspace, unsaved }
    },
  })
  return true
}

function update(fn: (workspace: Workspace) => Workspace) {
  flush()
  store.update(fn)
}

/** `name` + `suffix`, then " 2", " 3"… until free; the base is cut, at a
 *  word's start when it has spaces, so the result stays a valid name. */
export function uniqueName(
  name: string,
  systems: DesignSystemDoc[],
  suffix = "",
): string {
  const taken = new Set(systems.map((s) => s.name))
  const base = stripName(name) || "Untitled"
  const fit = (end: string) => {
    const head = cutName(base, MAX_NAME_LENGTH - end.length)
    const midWord = /\S/.test(base.charAt(head.length))
    return (midWord ? head.replace(/\s+\S*$/, "") : head).trimEnd() + end
  }
  let candidate = fit(suffix)
  for (let n = 2; taken.has(candidate); n++) candidate = fit(`${suffix} ${n}`)
  return candidate
}

export function create(
  fields: Pick<DesignSystemDoc, "name" | "from" | "state">,
): DesignSystemDoc | undefined {
  if (!accepts(fields.state)) return
  const doc: DesignSystemDoc = {
    id: newId(),
    ...fields,
    name: uniqueName(fields.name, getWorkspace().systems),
    updatedAt: Date.now(),
  }
  update((workspace) => ({
    ...workspace,
    systems: [...workspace.systems, doc],
  }))
  return doc
}

/** The name a view with changes was shared under, without its " (edited)":
 *  shared again, it is never "(edited) (edited)". */
export const unedited = (name: string) => name.replace(/ \(edited\)$/, "")

/** Save's name for the slot: "My Linear", or "Untitled" from Origin or an
 *  "Untitled" link; free in the list. */
export function saveName(from: View): string {
  const base =
    from.kind === "link"
      ? unedited(from.name)
      : from.id === ORIGIN.id
        ? "Untitled"
        : (getPreset(from.id)?.name ?? "Untitled")
  return uniqueName(
    base === "Untitled" || base.startsWith("My ") ? base : `My ${base}`,
    getWorkspace().systems,
  )
}

/** "Acme copy", free in the list; a copy of a copy is never "copy copy". */
export const copyName = (name: string) =>
  uniqueName(name.replace(/ copy( \d+)?$/, ""), getWorkspace().systems, " copy")

interface Removed {
  doc: DesignSystemDoc
  index: number
}

/** Puts a removed system back (same id), at its old position. */
export function insert(doc: DesignSystemDoc, index?: number): void {
  update((workspace) => {
    if (workspace.systems.some((s) => s.id === doc.id)) return workspace
    const systems = [...workspace.systems]
    systems.splice(index ?? systems.length, 0, doc)
    return { ...workspace, systems }
  })
}

/** Removes the system; returns it and where it was. */
export function remove(id: string): Removed | undefined {
  let removed: Removed | undefined
  update((workspace) => {
    const index = workspace.systems.findIndex((s) => s.id === id)
    if (index === -1) return workspace
    removed = { doc: workspace.systems[index]!, index }
    return {
      ...workspace,
      systems: workspace.systems.filter((s) => s.id !== id),
    }
  })
  return removed
}

/** Renames in place: the list stays in the order of edits to the design. */
export function rename(id: string, name: string): void {
  const clean = cleanName(name)
  if (!clean) return
  update((workspace) =>
    withDoc(workspace, id, (doc) =>
      doc.name === clean ? doc : { ...doc, name: clean },
    ),
  )
}
