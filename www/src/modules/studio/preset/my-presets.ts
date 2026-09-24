"use client"

import { createPersistedStore } from "@/lib/persisted-store"

/** A named design-system snapshot the user saved from /create. */
export interface SavedPreset {
  id: string
  name: string
  /** `encodeState()` output — the compact string, never the expanded object. */
  state: string
  createdAt: number
  updatedAt: number
}

function isSavedPreset(value: unknown): value is SavedPreset {
  if (typeof value !== "object" || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.state === "string" &&
    Number.isFinite(p.createdAt) &&
    Number.isFinite(p.updatedAt)
  )
}

function decodeSavedPresets(raw: string): SavedPreset[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isSavedPreset) : []
  } catch {
    return []
  }
}

// randomUUID only exists in secure contexts; LAN dev over http has none.
function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

const presetsStore = createPersistedStore<SavedPreset[]>(
  "dotui:my-presets",
  [],
  {
    decode: decodeSavedPresets,
    encode: (presets) => (presets.length > 0 ? JSON.stringify(presets) : null),
  },
)

/** The preset last saved or applied — highlighted in the gallery, targeted by Save's update path. */
const activeStore = createPersistedStore<string | undefined>(
  "dotui:active-saved-preset",
  undefined,
  {
    decode: (raw) => raw || undefined,
    encode: (id) => id ?? null,
  },
)

export function savePreset(name: string, state: string): void {
  const id = newId()
  const now = Date.now()
  presetsStore.update((presets) => [
    ...presets,
    { id, name, state, createdAt: now, updatedAt: now },
  ])
  activeStore.set(id)
}

export function updatePreset(id: string, state: string, name?: string): void {
  presetsStore.update((presets) =>
    presets.map((p) =>
      p.id === id
        ? { ...p, state, name: name ?? p.name, updatedAt: Date.now() }
        : p,
    ),
  )
  activeStore.set(id)
}

export function renamePreset(id: string, name: string): void {
  presetsStore.update((presets) =>
    presets.map((p) =>
      p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
    ),
  )
}

export function duplicatePreset(id: string): void {
  presetsStore.update((presets) => {
    const source = presets.find((p) => p.id === id)
    if (!source) return presets
    const now = Date.now()
    return [
      ...presets,
      {
        id: newId(),
        name: `${source.name} copy`,
        state: source.state,
        createdAt: now,
        updatedAt: now,
      },
    ]
  })
}

export function removePreset(id: string): void {
  presetsStore.update((presets) => presets.filter((p) => p.id !== id))
  activeStore.update((active) => (active === id ? undefined : active))
}

export function useMyPresets() {
  return {
    presets: presetsStore.useValue(),
    activeId: activeStore.useValue(),
    save: savePreset,
    update: updatePreset,
    rename: renamePreset,
    duplicate: duplicatePreset,
    remove: removePreset,
    setActive: activeStore.set,
  }
}
