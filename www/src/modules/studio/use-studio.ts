"use client"

/* The studio's state hook: the design system being edited lives in the
   route's `?preset=` param (shareable, replace-navigated on every edit), and
   every consumer — the panel, the preview, export — reads the same decoded
   state and its resolved design system from here. */

import { useCallback, useMemo } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { decodeState, encodeState } from "@/modules/studio/preset/codec"
import type { DesignSystem } from "@/modules/studio/preset/types"

import { DEFAULT_STATE, formatIssues } from "./axes"
import type { StudioState } from "./axes"
import { resolveDesignSystem } from "./resolve"

const routeApi = getRouteApi("/_app/studio")

export interface Studio {
  state: StudioState
  /** The state's `?preset=` encoding; `undefined` for the defaults. */
  encoded: string | undefined
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  set: <K extends keyof StudioState>(key: K) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
  /** Modified-vs-default and reset for one section, from its defaults slice. */
  section: (defaults: Partial<StudioState>) => {
    modified: boolean
    onReset: () => void
  }
}

const decodeCache = new Map<string, StudioState>()
function decodeCached(encoded: string | undefined): StudioState {
  if (!encoded) return DEFAULT_STATE
  let state = decodeCache.get(encoded)
  if (!state) {
    const result = decodeState(encoded)
    if (!result.ok)
      console.warn(`Ignoring ?preset=: ${formatIssues(result.issues)}`)
    state = result.ok ? result.state : DEFAULT_STATE
    decodeCache.set(encoded, state)
  }
  return state
}

export function useStudio(): Studio {
  const { preset: encoded } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const state = decodeCached(encoded)

  const setState = useCallback(
    (next: StudioState) => {
      navigate({
        search: (prev) => ({ ...prev, preset: encodeState(next) }),
        replace: true,
      })
    },
    [navigate],
  )

  const designSystem = useMemo(() => resolveDesignSystem(state), [state])

  return useMemo(() => {
    const set =
      <K extends keyof StudioState>(key: K) =>
      (value: StudioState[K]) =>
        setState({ ...state, [key]: value })
    const section = (defaults: Partial<StudioState>) => ({
      modified: Object.entries(defaults).some(
        ([key, value]) =>
          JSON.stringify(state[key as keyof StudioState]) !==
          JSON.stringify(value),
      ),
      onReset: () => setState({ ...state, ...defaults }),
    })
    return { state, encoded, designSystem, set, setState, section }
  }, [state, encoded, designSystem, setState])
}
