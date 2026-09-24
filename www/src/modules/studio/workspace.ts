"use client"

/* The user's design systems, kept in this browser. Every record is validated
   on read (invalid ones are dropped) and every write re-reads storage first,
   so tabs never clobber each other. The open system's edits land in memory at
   once and in storage at most every 200 ms. */

import { useSyncExternalStore } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  MAX_NAME_LENGTH,
  parseSnapshot,
  SNAPSHOT_ID,
  snapshotId,
} from "@/lib/snapshots/snapshot"
import type { Snapshot, SnapshotContent } from "@/lib/snapshots/snapshot"
import { closestPreset, getPreset, ORIGIN } from "@/modules/presets"
import { sameState, validate } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

export type Origin =
  | { kind: "preset"; id: string }
  | { kind: "snapshot"; id: string }
  | { kind: "copy"; of: string }

export interface DesignSystemDoc {
  id: string
  name: string
  origin: Origin
  /** What Reset returns to; set once. */
  initial: StudioState
  state: StudioState
  published: { id: string; at: number }[]
  createdAt: number
  updatedAt: number
}

export interface Workspace {
  schema: 1
  openId: string
  systems: DesignSystemDoc[]
}

const KEY = "dotui:design-systems"
const WRITE_INTERVAL = 200

// randomUUID only exists in secure contexts; LAN dev over http has none.
function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function newDoc(
  fields: Pick<DesignSystemDoc, "name" | "origin" | "state"> &
    Partial<Pick<DesignSystemDoc, "published">>,
): DesignSystemDoc {
  const now = Date.now()
  return {
    id: newId(),
    published: [],
    ...fields,
    initial: fields.state,
    createdAt: now,
    updatedAt: now,
  }
}

const originDoc = () =>
  newDoc({
    name: ORIGIN.name,
    origin: { kind: "preset", id: ORIGIN.id },
    state: ORIGIN.state,
  })

function freshWorkspace(): Workspace {
  const doc = originDoc()
  return { schema: 1, openId: doc.id, systems: [doc] }
}

/* -------------------------------- reading -------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

const isName = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim() === value &&
  value.length > 0 &&
  value.length <= MAX_NAME_LENGTH

function parseOrigin(raw: unknown): Origin | undefined {
  if (!isRecord(raw)) return
  if (raw.kind === "preset" && typeof raw.id === "string")
    return { kind: "preset", id: raw.id }
  if (raw.kind === "snapshot" && typeof raw.id === "string")
    return { kind: "snapshot", id: raw.id }
  if (raw.kind === "copy" && typeof raw.of === "string")
    return { kind: "copy", of: raw.of }
}

function parseDoc(raw: unknown): DesignSystemDoc | undefined {
  if (!isRecord(raw)) return
  const { id, name, published, createdAt, updatedAt } = raw
  const origin = parseOrigin(raw.origin)
  const initial = validate(raw.initial)
  const state = validate(raw.state)
  if (
    typeof id !== "string" ||
    !id ||
    !isName(name) ||
    !origin ||
    !initial.ok ||
    !state.ok ||
    !isTime(createdAt) ||
    !isTime(updatedAt) ||
    !Array.isArray(published) ||
    !published.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.id === "string" &&
        SNAPSHOT_ID.test(entry.id) &&
        isTime(entry.at),
    )
  )
    return
  return {
    id,
    name,
    origin,
    initial: initial.state,
    state: state.state,
    published: published.map(({ id, at }) => ({ id, at })),
    createdAt,
    updatedAt,
  }
}

/** Invalid records are dropped; an empty workspace starts over on Origin. */
export function parseWorkspace(raw: string): Workspace {
  const parsed: unknown = JSON.parse(raw)
  if (!isRecord(parsed) || parsed.schema !== 1)
    throw new Error("not a workspace")
  const systems: DesignSystemDoc[] = []
  for (const entry of Array.isArray(parsed.systems) ? parsed.systems : []) {
    const doc = parseDoc(entry)
    if (doc && !systems.some((s) => s.id === doc.id)) systems.push(doc)
  }
  if (systems.length === 0) throw new Error("empty workspace")
  const openId = systems.some((s) => s.id === parsed.openId)
    ? (parsed.openId as string)
    : latest(systems).id
  return { schema: 1, openId, systems }
}

const latest = (systems: DesignSystemDoc[]) =>
  systems.reduce((a, b) => (b.updatedAt > a.updatedAt ? b : a))

// Created once, so the untouched Origin keeps its id until the first write.
const FALLBACK = freshWorkspace()

const store = createPersistedStore<Workspace>(KEY, FALLBACK, {
  decode: parseWorkspace,
  encode: (workspace) => JSON.stringify(workspace),
})

/* --------------------------- the pending edit --------------------------- */

type Edit = { id: string; state: StudioState }

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
    overlay = {
      base,
      edit: pending,
      value: withDoc(base, pending.id, withState(pending.state)),
    }
  return overlay.value
}

/** Writes the pending edit now. Every other operation flushes first. */
export function flush(): void {
  clearTimeout(timer)
  timer = undefined
  if (!pending) return
  const { id, state } = pending
  pending = null
  store.update((workspace) => withDoc(workspace, id, withState(state)))
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  const unsubscribe = store.subscribe(onChange)
  return () => {
    listeners.delete(onChange)
    unsubscribe()
  }
}

export const useWorkspace = (): Workspace =>
  useSyncExternalStore(subscribe, getWorkspace, () => FALLBACK)

export const openDoc = (workspace: Workspace): DesignSystemDoc =>
  workspace.systems.find((s) => s.id === workspace.openId)!

export const useOpenSystem = () => openDoc(useWorkspace())

/* ------------------------------ operations ------------------------------ */

/** Edits the system's state; storage catches up within 200 ms. */
export function setState(id: string, state: StudioState): void {
  if (pending && pending.id !== id) flush()
  pending = { id, state }
  timer ??= setTimeout(flush, WRITE_INTERVAL)
  for (const listener of listeners) listener()
}

function update(fn: (workspace: Workspace) => Workspace) {
  flush()
  store.update(fn)
}

export function uniqueName(name: string, systems: DesignSystemDoc[]): string {
  const taken = new Set(systems.map((s) => s.name))
  if (!taken.has(name)) return name
  let n = 2
  while (taken.has(`${name} ${n}`)) n++
  return `${name} ${n}`
}

/** Opened from a preset and never changed, renamed or published: picking
 *  something else may replace it. */
export function isUntouched(doc: DesignSystemDoc): boolean {
  const preset = doc.origin.kind === "preset" && getPreset(doc.origin.id)
  return (
    !!preset &&
    doc.published.length === 0 &&
    sameState(doc.state, doc.initial) &&
    doc.name.startsWith(preset.name) &&
    /^( \d+)?$/.test(doc.name.slice(preset.name.length))
  )
}

/** Adds `doc` and opens it, replacing the open system if it is untouched. */
function addAndOpen(workspace: Workspace, doc: DesignSystemDoc): Workspace {
  const open = openDoc(workspace)
  const systems = isUntouched(open)
    ? workspace.systems.filter((s) => s !== open)
    : workspace.systems
  return {
    ...workspace,
    openId: doc.id,
    systems: [...systems, { ...doc, name: uniqueName(doc.name, systems) }],
  }
}

/** A new system from a built-in, named "Linear", "Linear 2"… */
export function createFromPreset(presetId: string): void {
  const preset = getPreset(presetId)
  if (!preset) return
  update((workspace) => {
    const open = openDoc(workspace)
    if (
      isUntouched(open) &&
      open.origin.kind === "preset" &&
      open.origin.id === presetId
    )
      return workspace
    return addAndOpen(
      workspace,
      newDoc({
        name: preset.name,
        origin: { kind: "preset", id: preset.id },
        state: preset.state,
      }),
    )
  })
}

export function open(id: string): void {
  update((workspace) =>
    workspace.openId === id || !workspace.systems.some((s) => s.id === id)
      ? workspace
      : { ...workspace, openId: id },
  )
}

export function rename(id: string, name: string): void {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH).trim()
  if (!trimmed) return
  update((workspace) =>
    withDoc(workspace, id, (doc) =>
      doc.name === trimmed
        ? doc
        : { ...doc, name: trimmed, updatedAt: Date.now() },
    ),
  )
}

/** Opens a copy of the system. */
export function duplicate(id: string): void {
  update((workspace) => {
    const source = workspace.systems.find((s) => s.id === id)
    if (!source) return workspace
    const copy = newDoc({
      name: uniqueName(`${source.name} copy`, workspace.systems),
      origin: { kind: "copy", of: source.id },
      state: source.state,
    })
    return {
      ...workspace,
      openId: copy.id,
      systems: [...workspace.systems, copy],
    }
  })
}

/** Deletes the system and returns its undo. Deleting the last one opens a
 *  fresh Origin. */
export function remove(id: string): () => void {
  let removed:
    | { doc: DesignSystemDoc; index: number; wasOpen: boolean }
    | undefined
  let replacement: string | undefined
  update((workspace) => {
    const index = workspace.systems.findIndex((s) => s.id === id)
    if (index === -1) return workspace
    removed = {
      doc: workspace.systems[index]!,
      index,
      wasOpen: workspace.openId === id,
    }
    let systems = workspace.systems.filter((s) => s.id !== id)
    if (systems.length === 0) {
      const doc = originDoc()
      replacement = doc.id
      systems = [doc]
    }
    const openId = removed.wasOpen ? latest(systems).id : workspace.openId
    return { ...workspace, openId, systems }
  })
  return () => {
    if (!removed) return
    const { doc, index, wasOpen } = removed
    update((workspace) => {
      if (workspace.systems.some((s) => s.id === doc.id)) return workspace
      const systems = workspace.systems.filter(
        (s) => s.id !== replacement || !isUntouched(s),
      )
      systems.splice(Math.min(index, systems.length), 0, doc)
      const openId =
        wasOpen || !systems.some((s) => s.id === workspace.openId)
          ? doc.id
          : workspace.openId
      return { ...workspace, openId, systems }
    })
  }
}

/** Returns the system to its initial state; returns the undo. */
export function reset(id: string): () => void {
  let before: StudioState | undefined
  update((workspace) =>
    withDoc(workspace, id, (doc) => {
      before = doc.state
      return withState(doc.initial)(doc)
    }),
  )
  return () => {
    if (!before) return
    const state = before
    update((workspace) =>
      withDoc(workspace, id, (doc) =>
        sameState(doc.state, doc.initial) ? withState(state)(doc) : doc,
      ),
    )
  }
}

/** What publishing the system would store. */
export function snapshotContent(doc: DesignSystemDoc): SnapshotContent {
  return {
    schema: 1,
    name: doc.name,
    base: closestPreset(doc.state).id,
    state: doc.state,
  }
}

/** Whether the content differs from the latest published version. Hashing
 *  needs a secure context; without one, everything counts as unpublished. */
export async function hasUnpublishedChanges(
  doc: DesignSystemDoc,
): Promise<boolean> {
  const last = doc.published.at(-1)
  if (!last) return true
  try {
    return (await snapshotId(snapshotContent(doc))) !== last.id
  } catch {
    return true
  }
}

type Post = (body: Omit<SnapshotContent, "schema">) => Promise<string>

async function postSnapshot(body: Omit<SnapshotContent, "schema">) {
  const response = await fetch("/api/snapshots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`POST /api/snapshots → ${response.status}`)
  const { id } = (await response.json()) as { id: unknown }
  if (typeof id !== "string" || !SNAPSHOT_ID.test(id))
    throw new Error("POST /api/snapshots returned no id")
  return id
}

/** Publishes the system as a snapshot and returns its id; a no-op when
 *  nothing changed since the latest published version. */
export async function publish(id: string, post: Post = postSnapshot) {
  flush()
  const doc = getWorkspace().systems.find((s) => s.id === id)
  if (!doc) throw new Error(`No design system ${id}`)
  const last = doc.published.at(-1)
  if (last && !(await hasUnpublishedChanges(doc))) return last.id
  const { schema: _, ...body } = snapshotContent(doc)
  const snapshot = await post(body)
  update((workspace) =>
    withDoc(workspace, id, (current) =>
      current.published.at(-1)?.id === snapshot
        ? current
        : {
            ...current,
            published: [...current.published, { id: snapshot, at: Date.now() }],
          },
    ),
  )
  return snapshot
}

/** Opens the system a shared snapshot became, importing a copy the first
 *  time. */
export function importSnapshot(id: string, snapshot: Snapshot): void {
  update((workspace) => {
    const existing = workspace.systems.find(
      (s) =>
        (s.origin.kind === "snapshot" && s.origin.id === id) ||
        s.published.some((p) => p.id === id),
    )
    if (existing) return { ...workspace, openId: existing.id }
    return addAndOpen(
      workspace,
      newDoc({
        name: snapshot.name,
        origin: { kind: "snapshot", id },
        state: snapshot.state,
        published: [{ id, at: snapshot.createdAt }],
      }),
    )
  })
}

/** A snapshot fetched by id, validated like the server's own read. */
export async function fetchSnapshot(id: string): Promise<Snapshot> {
  if (!SNAPSHOT_ID.test(id)) throw new Error("Invalid snapshot id")
  const response = await fetch(`/api/snapshots/${id}`)
  if (!response.ok)
    throw new Error(`GET /api/snapshots/${id} → ${response.status}`)
  const snapshot = parseSnapshot(await response.json())
  if (!snapshot.ok) throw new Error(`Snapshot ${id} is invalid`)
  return snapshot.value
}
