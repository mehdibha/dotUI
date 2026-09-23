"use client"

import { useSyncExternalStore } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  cleanName,
  cleanSystem,
  docQuery,
  storedDesign,
} from "@/modules/studio/doc"
import type { DocSearch } from "@/modules/studio/doc"

import { isRef } from "./codec"

/** A named design system the user saved from the studio. */
export interface SavedSystem {
  id: string
  name: string
  /** Its design, as the studio's `preset=` and `d=` (see studio/doc.ts). */
  preset: string
  d?: string
  updatedAt: number
}

interface Store {
  v: 1
  systems: SavedSystem[]
}

const KEY = "dotui:systems"
const LEGACY_SYSTEMS = "dotui:my-presets"
const LEGACY_KEYS = [
  LEGACY_SYSTEMS,
  "dotui:design-system-name",
  "dotui:active-saved-preset",
]
const CODE = /^v\d+\.[\w-]+$/
const NONE: SavedSystem[] = []

const designFields = ({ preset, d }: DocSearch) => ({
  preset: preset as string,
  ...(d ? { d } : {}),
})

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

function toSystem(value: unknown): SavedSystem | undefined {
  if (!isObject(value)) return undefined
  const { id, name, preset, d, updatedAt } = value
  const cleanId = typeof id === "string" ? cleanSystem(id) : undefined
  const cleanedName = typeof name === "string" ? cleanName(name) : undefined
  if (
    !cleanId ||
    !cleanedName ||
    typeof preset !== "string" ||
    !isRef(preset) ||
    (d !== undefined && (typeof d !== "string" || !CODE.test(d))) ||
    typeof updatedAt !== "number" ||
    !Number.isFinite(updatedAt)
  )
    return undefined
  return d === undefined
    ? { id: cleanId, name: cleanedName, preset, updatedAt }
    : { id: cleanId, name: cleanedName, preset, d, updatedAt }
}

/** A store's valid records, first of each id; `undefined` if it isn't one. */
function readStore(value: unknown): SavedSystem[] | undefined {
  if (!isObject(value) || value.v !== 1 || !Array.isArray(value.systems))
    return undefined
  const systems: SavedSystem[] = []
  for (const item of value.systems) {
    const system = toSystem(item)
    if (system && !systems.some((s) => s.id === system.id)) systems.push(system)
  }
  return systems
}

function parse(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

const store = createPersistedStore<SavedSystem[]>(KEY, NONE, {
  decode: (raw) => readStore(parse(raw)) ?? NONE,
  encode: (systems) =>
    systems.length > 0
      ? JSON.stringify({ v: 1, systems } satisfies Store)
      : null,
})

// randomUUID only exists in secure contexts; LAN dev over http has none.
function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/** Records of the old `dotui:my-presets` array, their designs read through
 *  the legacy chain; records that no longer read are lost either way. */
function fromLegacy(raw: string): SavedSystem[] {
  const parsed = parse(raw)
  if (!Array.isArray(parsed)) return []
  const systems: SavedSystem[] = []
  for (const item of parsed) {
    if (!isObject(item) || typeof item.state !== "string") continue
    const design = storedDesign(item.state)
    if (!design) continue
    const id = typeof item.id === "string" ? cleanSystem(item.id) : undefined
    const updatedAt = item.updatedAt
    systems.push({
      id: id && !systems.some((s) => s.id === id) ? id : newId(),
      name:
        (typeof item.name === "string" ? cleanName(item.name) : undefined) ??
        "Untitled",
      ...designFields(design),
      updatedAt:
        typeof updatedAt === "number" && Number.isFinite(updatedAt)
          ? updatedAt
          : Date.now(),
    })
  }
  return systems
}

let migrated = false

/** Moves the old keys into the store, once; they go only once it holds
 *  their records (a failed write retries on the next load). */
function migrate() {
  if (migrated || typeof window === "undefined") return
  migrated = true
  try {
    const raw = window.localStorage.getItem(LEGACY_SYSTEMS)
    const legacy = raw === null ? [] : fromLegacy(raw)
    if (legacy.length > 0) {
      store.update((systems) => [
        ...systems,
        ...legacy.filter((r) => !systems.some((s) => s.id === r.id)),
      ])
      const kept = readStore(parse(window.localStorage.getItem(KEY) ?? ""))
      if (!legacy.every((r) => kept?.some((s) => s.id === r.id))) return
    }
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key)
  } catch {
    // Storage unavailable: nothing to move.
  }
}

function update(fn: (systems: SavedSystem[]) => SavedSystem[]) {
  migrate()
  store.update(fn)
}

/** A record's design, canonical; `undefined` once it no longer reads. */
export const designOf = (system: SavedSystem): DocSearch | undefined =>
  storedDesign(docQuery({ preset: system.preset, d: system.d }))

/** Saves a new record and returns its id. */
export function saveSystem(name: string, design: DocSearch): string {
  const id = newId()
  const system = {
    id,
    name: cleanName(name) ?? "Untitled",
    ...designFields(design),
    updatedAt: Date.now(),
  }
  update((systems) => [...systems, system])
  return id
}

export function updateSystem(id: string, design: DocSearch): void {
  update((systems) =>
    systems.map((s) =>
      s.id === id
        ? { id, name: s.name, ...designFields(design), updatedAt: Date.now() }
        : s,
    ),
  )
}

export function renameSystem(id: string, name: string): void {
  const clean = cleanName(name)
  if (!clean) return
  update((systems) =>
    systems.map((s) =>
      s.id === id ? { ...s, name: clean, updatedAt: Date.now() } : s,
    ),
  )
}

export function duplicateSystem(id: string): void {
  update((systems) => {
    const source = systems.find((s) => s.id === id)
    if (!source) return systems
    const name = cleanName(`${source.name} copy`) ?? source.name
    return [...systems, { ...source, id: newId(), name, updatedAt: Date.now() }]
  })
}

/** Deletes a record; returns its undo, which puts it back where it was. */
export function removeSystem(id: string): (() => void) | undefined {
  let removed: { system: SavedSystem; index: number } | undefined
  update((systems) => {
    const index = systems.findIndex((s) => s.id === id)
    if (index === -1) return systems
    removed = { system: systems[index] as SavedSystem, index }
    return systems.filter((s) => s.id !== id)
  })
  if (!removed) return undefined
  const { system, index } = removed
  return () =>
    update((systems) =>
      systems.some((s) => s.id === system.id)
        ? systems
        : [...systems.slice(0, index), system, ...systems.slice(index)],
    )
}

/** Every record, as a file `importSystems` reads back. */
export function exportSystems(): string {
  migrate()
  return JSON.stringify({ v: 1, systems: store.get() } satisfies Store, null, 2)
}

/** Adds an export's records; returns how many, or `undefined` when `json`
 *  isn't an export. Records already here are skipped; an id clash with a
 *  different record imports it under a new id. */
export function importSystems(json: string): number | undefined {
  const incoming = readStore(parse(json))
  if (!incoming) return undefined
  let added = 0
  update((systems) => {
    const next = [...systems]
    for (const system of incoming) {
      const clash = next.find((s) => s.id === system.id)
      if (
        clash?.name === system.name &&
        clash.preset === system.preset &&
        clash.d === system.d
      )
        continue
      next.push(clash ? { ...system, id: newId() } : system)
      added++
    }
    return added > 0 ? next : systems
  })
  return added
}

function subscribe(onChange: () => void) {
  migrate()
  return store.subscribe(onChange)
}

function get() {
  migrate()
  return store.get()
}

export const useSavedSystems = (): SavedSystem[] =>
  useSyncExternalStore(subscribe, get, () => NONE)
