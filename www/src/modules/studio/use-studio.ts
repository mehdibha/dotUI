"use client"

/* The studio's state hook: the design system being edited lives in the
   route's `?preset=` param (shareable, replace-navigated on every edit), and
   every consumer — the panel, the preview, export — reads the same decoded
   state and its resolved design system from here. */

import { useCallback, useMemo } from "react"
import { getRouteApi } from "@tanstack/react-router"

import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
} from "@/modules/create/preset/codec"
import type { StudioPreset } from "@/modules/create/preset/codec"
import type { DesignSystem } from "@/modules/create/preset/types"
import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"

import type { StudioState } from "./axes"
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

  const setPreset = useCallback(
    (next: StudioPreset) => {
      navigate({
        search: (prev) => ({ ...prev, preset: encodePreset(next) }),
        replace: true,
      })
    },
    [navigate],
  )

  const designSystem = useMemo(() => resolveDesignSystem(state), [state])

  return useMemo(() => {
    const setState = (next: StudioState) => setPreset({ ...preset, state: next })
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
      section,
    }
  }, [state, preset, encoded, designSystem, setPreset])
}
