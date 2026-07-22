'use client'

import { createPersistedStore } from '@/lib/persisted-store'

/** A named design-system snapshot the user saved from /create. */
export interface SavedPreset {
  id: string
  name: string
  /** `encodePreset()` output — the compact string, never the expanded object. */
  state: string
  createdAt: number
  updatedAt: number
}

const presetsStore = createPersistedStore<SavedPreset[]>(
  'dotui:my-presets',
  [],
  {
    decode: (raw) => {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? (parsed as SavedPreset[]) : []
      } catch {
        return []
      }
    },
    encode: (presets) => (presets.length > 0 ? JSON.stringify(presets) : null),
  },
)

/** The preset last saved or applied — highlighted in the gallery, targeted by Save's update path. */
const activeStore = createPersistedStore<string | undefined>(
  'dotui:active-saved-preset',
  undefined,
  {
    decode: (raw) => raw || undefined,
    encode: (id) => id ?? null,
  },
)

export function useMyPresets() {
  const presets = presetsStore.useValue()
  const activeId = activeStore.useValue()

  function save(name: string, state: string): string {
    const id = crypto.randomUUID()
    const now = Date.now()
    presetsStore.set([
      ...presetsStore.get(),
      { id, name, state, createdAt: now, updatedAt: now },
    ])
    activeStore.set(id)
    return id
  }

  function update(id: string, state: string, name?: string) {
    presetsStore.set(
      presetsStore
        .get()
        .map((p) =>
          p.id === id
            ? { ...p, state, name: name ?? p.name, updatedAt: Date.now() }
            : p,
        ),
    )
    activeStore.set(id)
  }

  function rename(id: string, name: string) {
    presetsStore.set(
      presetsStore
        .get()
        .map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)),
    )
  }

  function duplicate(id: string): string | undefined {
    const source = presetsStore.get().find((p) => p.id === id)
    if (!source) return undefined
    const newId = crypto.randomUUID()
    const now = Date.now()
    presetsStore.set([
      ...presetsStore.get(),
      {
        id: newId,
        name: `${source.name} copy`,
        state: source.state,
        createdAt: now,
        updatedAt: now,
      },
    ])
    return newId
  }

  function remove(id: string) {
    presetsStore.set(presetsStore.get().filter((p) => p.id !== id))
    if (activeStore.get() === id) activeStore.set(undefined)
  }

  function setActive(id: string | undefined) {
    activeStore.set(id)
  }

  return {
    presets,
    activeId,
    save,
    update,
    rename,
    duplicate,
    remove,
    setActive,
  }
}
