"use client"

/* The studio's state hook: the document a tab edits lives in the route's URL
   (see doc.ts), and every consumer — the panel, the preview, export — reads
   the same document and its resolved design system from here. Edits
   replace-navigate; only a tab's own document autosaves to the working store,
   never a shared link someone opened. */

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react"
import { getRouteApi } from "@tanstack/react-router"

import type { DesignSystem } from "@/modules/studio/preset/types"

import type { StudioState } from "./axes"
import {
  docSearch,
  handOver,
  isDirty,
  ownerOf,
  readDoc,
  storedQuery,
} from "./doc"
import type { DocSearch, StudioDoc } from "./doc"
import { designOf, useSavedSystems } from "./preset/saved-systems"
import type { SavedSystem } from "./preset/saved-systems"
import { saveWorking, useWorking } from "./preset/storage"
import { resolveDesignSystem } from "./resolve"

const routeApi = getRouteApi("/_app/studio")

export interface Studio {
  doc: StudioDoc
  /** The document's canonical params. */
  search: DocSearch
  state: StudioState
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  /** This tab's own document, not a shared link it opened; unknown until
   *  hydrated, as the server can't read this browser's storage. */
  owned: boolean | undefined
  /** The saved system this tab edits. */
  saved: SavedSystem | undefined
  /** Unsaved work: past the saved system, else past the base preset. */
  dirty: boolean
  /** The header's name for the document. */
  label: string
  set: <K extends keyof StudioState>(key: K) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
  /** Moves the tab to `next`. An adopted document becomes the tab's own;
   *  otherwise ownership carries over from the current one. */
  commit: (next: DocSearch, options?: { adopt?: boolean }) => void
}

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

function labelOf(
  doc: StudioDoc,
  owned: boolean | undefined,
  saved: SavedSystem | undefined,
) {
  if (saved) return saved.name
  const name = doc.name ?? doc.baseName
  // Only shared links carry a name, so the server can already say so.
  if (owned === false || doc.name) return `${name} (shared)`
  return doc.modified ? `${name} (modified)` : name
}

export function useStudio(): Studio {
  const { preset, d, name, system } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const search = useMemo<DocSearch>(
    () => ({ preset, d, name, system }),
    [preset, d, name, system],
  )
  const doc = readDoc(search)
  const saved = useSavedSystems().find((s) => s.id === doc.system)
  const hydrated = useHydrated()
  const working = useWorking()
  const owned = hydrated
    ? ownerOf(search, { working, saved: saved !== undefined })
    : undefined
  const savedDesign = useMemo(
    () => (saved ? designOf(saved) : undefined),
    [saved],
  )

  // Read at call time: a toast's Undo runs long after its render.
  const current = useRef({ search, owned })
  current.current = { search, owned }

  const commit = useCallback(
    (next: DocSearch, { adopt = false } = {}) => {
      const { search: from, owned = false } = current.current
      if (handOver(from, owned, next, adopt)) saveWorking(storedQuery(next))
      void navigate({
        search: (prev) => ({
          ...prev,
          preset: next.preset,
          d: next.d,
          name: next.name,
          system: next.system,
          gallery: undefined,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setState = useCallback(
    (state: StudioState) =>
      commit(
        docSearch(state, doc.base, { name: doc.name, system: doc.system }),
      ),
    [commit, doc],
  )

  const designSystem = useMemo(() => resolveDesignSystem(doc.state), [doc])

  return useMemo(() => {
    const set =
      <K extends keyof StudioState>(key: K) =>
      (value: StudioState[K]) =>
        setState({ ...doc.state, [key]: value })
    return {
      doc,
      search,
      state: doc.state,
      designSystem,
      owned,
      saved,
      dirty: isDirty(doc, savedDesign),
      label: labelOf(doc, owned, saved),
      set,
      setState,
      commit,
    }
  }, [doc, search, designSystem, owned, saved, savedDesign, setState, commit])
}
