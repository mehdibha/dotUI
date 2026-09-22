"use client"

/* The studio's state hook: the design system being edited lives in the
   route's `?preset=` param (shareable, replace-navigated on every edit), and
   every consumer — the panel, the preview, export — reads the same decoded
   state and its resolved design system from here. */

import { useCallback, useMemo } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
} from "@/modules/studio/preset/codec"
import type { StudioPreset } from "@/modules/studio/preset/codec"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { StudioState } from "./axes"
import { record, redo, undo, useHistory } from "./history"
import { resolveDesignSystem } from "./resolve"

const routeApi = getRouteApi("/_app/studio")

export interface Studio {
  state: StudioState
  /** The whole preset (state + code style), and its encoded form. */
  preset: StudioPreset
  encoded: string | undefined
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  set: <K extends keyof StudioState>(key: K) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
  setPreset: (preset: StudioPreset) => void
  codeOptions: CodeOptions
  setCodeOption: <K extends keyof CodeOptions>(
    key: K,
    value: CodeOptions[K],
  ) => void
  /** Steps through edits; see history.ts. */
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  /** Modified-vs-default and reset for one section, from its defaults slice. */
  section: (defaults: Partial<StudioState>) => {
    modified: boolean
    onReset: () => void
  }
}

const decodeCache = new Map<string, StudioPreset>()
function decodeCached(encoded: string | undefined): StudioPreset {
  if (!encoded) return DEFAULT_PRESET
  let preset = decodeCache.get(encoded)
  if (!preset) {
    preset = decodePreset(encoded)
    decodeCache.set(encoded, preset)
  }
  return preset
}

export function useStudio(): Studio {
  const { preset: encoded } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const preset = decodeCached(encoded)
  const { state } = preset

  const history = useHistory()

  const show = useCallback(
    (next: string | undefined) =>
      navigate({
        search: (prev) => ({ ...prev, preset: next || undefined }),
        replace: true,
      }),
    [navigate],
  )

  const setPreset = useCallback(
    (next: StudioPreset) => {
      const nextEncoded = encodePreset(next)
      if (nextEncoded === encoded) return
      // No preset yet means the page is still seeding its first state.
      if (encoded !== undefined) record(encoded)
      show(nextEncoded)
    },
    [encoded, show],
  )

  const designSystem = useMemo(() => resolveDesignSystem(state), [state])

  return useMemo(() => {
    const setState = (next: StudioState) =>
      setPreset({ ...preset, state: next })
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
    const codeOptions = preset.codeOptions ?? DEFAULT_CODE_OPTIONS
    const setCodeOption = <K extends keyof CodeOptions>(
      key: K,
      value: CodeOptions[K],
    ) => setPreset({ ...preset, codeOptions: { ...codeOptions, [key]: value } })
    const step = (move: typeof undo) => () => {
      const next = move(encoded)
      if (next !== null) show(next)
    }
    return {
      state,
      preset,
      encoded,
      designSystem,
      set,
      setState,
      setPreset,
      codeOptions,
      setCodeOption,
      undo: step(undo),
      redo: step(redo),
      canUndo: history.canUndo,
      canRedo: history.canRedo,
      section,
    }
  }, [state, preset, encoded, designSystem, setPreset, show, history])
}
