"use client"

/* The user's design systems, kept in this browser. Every record is validated
   on read (invalid ones are dropped) and every write re-reads storage first,
   so tabs never clobber each other. Edits land in memory at once and in
   storage at most every 200 ms. What is on screen lives in `selection.ts`. */

import { useEffect, useState, useSyncExternalStore } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  MAX_NAME_LENGTH,
  parseSnapshot,
  SNAPSHOT_ID,
  snapshotId,
} from "@/lib/snapshots/snapshot"
import type { Snapshot, SnapshotContent } from "@/lib/snapshots/snapshot"
import { toastManager } from "@/registry/ui/toast"
import { closestPreset } from "@/modules/presets"
import { formatIssues, sameState, validate } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

export type Origin =
  | { kind: "preset"; id: string }
  | { kind: "snapshot"; id: string }
  | { kind: "copy"; of: string }

export interface DesignSystemDoc {
  id: string
  name: string
  /** Made by editing a preset or a shared link; kept once named. */
  draft: boolean
  origin: Origin
  /** What Reset returns to; set once. */
  initial: StudioState
  state: StudioState
  published: { id: string; at: number }[]
  createdAt: number
  updatedAt: number
}

export interface Workspace {
  schema: 2
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

/* -------------------------------- reading -------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

export const isName = (value: unknown): value is string =>
  typeof value === "string" && value === cleanName(value) && value.length > 0

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
  const { id, name, draft, published, createdAt, updatedAt } = raw
  const origin = parseOrigin(raw.origin)
  const initial = validate(raw.initial)
  const state = validate(raw.state)
  if (
    typeof id !== "string" ||
    !id ||
    !isName(name) ||
    typeof draft !== "boolean" ||
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
    draft,
    origin,
    initial: initial.state,
    state: state.state,
    published: published.map(({ id, at }) => ({ id, at })),
    createdAt,
    updatedAt,
  }
}

/** Invalid records are dropped; anything but schema 2 reads as empty. */
export function parseWorkspace(raw: string): Workspace {
  const parsed: unknown = JSON.parse(raw)
  const systems: DesignSystemDoc[] = []
  if (!isRecord(parsed) || parsed.schema !== 2) return EMPTY
  for (const entry of Array.isArray(parsed.systems) ? parsed.systems : []) {
    const doc = parseDoc(entry)
    if (doc && !systems.some((s) => s.id === doc.id)) systems.push(doc)
  }
  return { schema: 2, systems }
}

const EMPTY: Workspace = { schema: 2, systems: [] }

export function storageFailed() {
  toastManager.add({
    id: "storage-failed",
    title: "Changes can't be saved in this browser",
    type: "warning",
    timeout: 0,
  })
}

const store = createPersistedStore<Workspace>(KEY, EMPTY, {
  decode: parseWorkspace,
  encode: (workspace) => JSON.stringify(workspace),
  onWriteError: storageFailed,
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

export const findSystem = (id: string) =>
  getWorkspace().systems.find((s) => s.id === id)

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
  useSyncExternalStore(subscribe, getWorkspace, () => EMPTY)

/** The list as pickers show it: the draft first, then newest first. */
export const listed = (workspace: Workspace): DesignSystemDoc[] =>
  [...workspace.systems]
    .reverse()
    .sort((a, b) => Number(b.draft) - Number(a.draft))

/** A draft with changes worth keeping. */
export const isChangedDraft = (doc: DesignSystemDoc | undefined) =>
  !!doc?.draft && !sameState(doc.state, doc.initial)

/* ------------------------------ operations ------------------------------ */

function accepts(state: StudioState): boolean {
  // An invalid record would be dropped on the next read: refuse it here.
  const valid = validate(state)
  if (!valid.ok) console.error(formatIssues(valid.issues))
  return valid.ok
}

/** Edits the system's state; storage catches up within 200 ms. Returns
 *  whether the state was accepted. */
export function setState(id: string, state: StudioState): boolean {
  if (!accepts(state)) return false
  if (pending && pending.id !== id) flush()
  pending = { id, state }
  timer ??= setTimeout(flush, WRITE_INTERVAL)
  for (const listener of listeners) listener()
  return true
}

function update(fn: (workspace: Workspace) => Workspace) {
  flush()
  store.update(fn)
}

// In UTF-16 units, as the server counts, without splitting a character.
function cut(text: string, max: number): string {
  let out = ""
  for (const char of text) {
    if (out.length + char.length > max) break
    out += char
  }
  return out
}

/** Trimmed, control and zero-width characters stripped, at most 64
 *  characters. */
export const cleanName = (name: string) =>
  cut(
    name
      .normalize("NFC")
      .replace(/[\p{Cc}\p{Cf}]/gu, "")
      .trim(),
    MAX_NAME_LENGTH,
  ).trim()

/** `name` + `suffix`, then " 2", " 3"… until free; the base is cut so the
 *  result stays a valid name. */
export function uniqueName(
  name: string,
  systems: DesignSystemDoc[],
  suffix = "",
): string {
  const taken = new Set(systems.map((s) => s.name))
  const base = cleanName(name) || "Untitled"
  const fit = (end: string) =>
    cut(base, MAX_NAME_LENGTH - end.length).trimEnd() + end
  let candidate = fit(suffix)
  for (let n = 2; taken.has(candidate); n++) candidate = fit(`${suffix} ${n}`)
  return candidate
}

/** What keeping a draft named after its source suggests: "My Linear". */
export const keptName = (doc: DesignSystemDoc) =>
  uniqueName(
    `My ${doc.name}`,
    getWorkspace().systems.filter((s) => s.id !== doc.id),
  )

export function create(
  fields: Pick<DesignSystemDoc, "name" | "origin" | "initial" | "state"> & {
    draft?: boolean
  },
): DesignSystemDoc | undefined {
  if (!accepts(fields.initial) || !accepts(fields.state)) return
  const now = Date.now()
  const doc: DesignSystemDoc = {
    id: newId(),
    draft: false,
    published: [],
    ...fields,
    name: uniqueName(fields.name, fields.draft ? [] : getWorkspace().systems),
    createdAt: now,
    updatedAt: now,
  }
  update((workspace) => ({
    ...workspace,
    systems: [...workspace.systems, doc],
  }))
  return doc
}

/** Where history.ts keeps a system's checkpoints; they go with the system. */
export const checkpointsKey = (id: string) => `dotui:history:${id}`

interface Removed {
  doc: DesignSystemDoc
  index: number
  checkpoints: string | null
}

/** Puts a removed system back (same id), at its old position, with its
 *  checkpoints. */
export function insert(
  doc: DesignSystemDoc,
  index?: number,
  checkpoints: string | null = null,
): void {
  update((workspace) => {
    if (workspace.systems.some((s) => s.id === doc.id)) return workspace
    const systems = [...workspace.systems]
    systems.splice(index ?? systems.length, 0, doc)
    return { ...workspace, systems }
  })
  if (checkpoints === null) return
  try {
    window.localStorage.setItem(checkpointsKey(doc.id), checkpoints)
  } catch {
    // Best effort: checkpoints are a convenience.
  }
}

/** Removes the system and its checkpoints; returns them and where it was. */
export function remove(id: string): Removed | undefined {
  let removed: Omit<Removed, "checkpoints"> | undefined
  update((workspace) => {
    const index = workspace.systems.findIndex((s) => s.id === id)
    if (index === -1) return workspace
    removed = { doc: workspace.systems[index]!, index }
    return {
      ...workspace,
      systems: workspace.systems.filter((s) => s.id !== id),
    }
  })
  if (!removed) return
  let checkpoints: string | null = null
  try {
    checkpoints = window.localStorage.getItem(checkpointsKey(id))
    window.localStorage.removeItem(checkpointsKey(id))
  } catch {
    // Best effort, as above.
  }
  return { ...removed, checkpoints }
}

/** Names the system; a draft that gets a new name is kept. */
export function rename(id: string, name: string): void {
  const clean = cleanName(name)
  if (clean && findSystem(id)?.name !== clean) keep(id, clean)
}

/** Keeps a draft under `name`. */
export function keep(id: string, name: string): void {
  const clean = cleanName(name)
  if (!clean) return
  update((workspace) =>
    withDoc(workspace, id, (doc) =>
      doc.name === clean && !doc.draft
        ? doc
        : { ...doc, name: clean, draft: false, updatedAt: Date.now() },
    ),
  )
}

/** Returns the system to its initial state. */
export function reset(id: string): void {
  update((workspace) =>
    withDoc(workspace, id, (doc) => withState(doc.initial)(doc)),
  )
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

/** `hasUnpublishedChanges` for the UI; `undefined` until first known, then
 *  the previous answer while the next one is computed. */
export function useUnpublishedChanges(
  doc: DesignSystemDoc | undefined,
): boolean | undefined {
  const [unpublished, setUnpublished] = useState<boolean>()
  useEffect(() => {
    if (!doc) return
    let live = true
    void hasUnpublishedChanges(doc).then(
      (value) => live && setUnpublished(value),
    )
    return () => {
      live = false
    }
  }, [doc])
  return doc ? unpublished : undefined
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
  const doc = findSystem(id)
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
