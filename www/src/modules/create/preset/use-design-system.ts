'use client'

import { useCallback, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { AlgorithmId, ColorKnobs, PaletteSeeds } from '@/registry/theme'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'
import type { CodeOptions } from '@/publisher/code-options'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'
import type { Density, DesignSystem } from './types'

const routeApi = getRouteApi('/_app/create')

export function useDesignSystem() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const designSystem: DesignSystem = useMemo(() => {
    if (!preset) return DEFAULTS
    return decodePreset(preset)
  }, [preset])

  const setDesignSystem = useCallback(
    (updater: DesignSystem | ((prev: DesignSystem) => DesignSystem)) => {
      const next =
        typeof updater === 'function' ? updater(designSystem) : updater
      const encoded = encodePreset(next)
      navigate({
        search: (prev) => ({ ...prev, preset: encoded }),
        replace: true,
      })
    },
    [designSystem, navigate],
  )

  const setComponentParam = useCallback(
    (componentName: string, paramName: string, value: string) => {
      setDesignSystem((prev) => ({
        ...prev,
        componentParams: {
          ...prev.componentParams,
          [componentName]: {
            ...(prev.componentParams[componentName] ?? {}),
            [paramName]: value,
          },
        },
      }))
    },
    [setDesignSystem],
  )

  const setToken = useCallback(
    (tokenName: string, value: string) => {
      setDesignSystem((prev) => ({
        ...prev,
        tokens: { ...prev.tokens, [tokenName]: value },
      }))
    },
    [setDesignSystem],
  )

  const setDensity = useCallback(
    (density: Density) => {
      setDesignSystem((prev) => ({ ...prev, density }))
    },
    [setDesignSystem],
  )

  /** Update one palette seed of the color recipe (starting from the default palette). */
  const setColorSeed = useCallback(
    (seed: keyof PaletteSeeds, value: string) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          color: { ...base, seeds: { ...base.seeds, [seed]: value } },
        }
      })
    },
    [setDesignSystem],
  )

  /** Switch the generation algorithm of the color recipe. */
  const setColorAlgorithm = useCallback(
    (algorithm: AlgorithmId) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return { ...prev, color: { ...base, algorithm } }
      })
    },
    [setDesignSystem],
  )

  /** Set one per-producer tuning knob of the color recipe. */
  const setColorKnob = useCallback(
    <K extends keyof ColorKnobs>(key: K, value: ColorKnobs[K]) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          color: { ...base, knobs: { ...base.knobs, [key]: value } },
        }
      })
    },
    [setDesignSystem],
  )

  /** Set one exported-code style option (starting from the default code style). */
  const setCodeOption = useCallback(
    <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]) => {
      setDesignSystem((prev) => {
        const base = prev.codeOptions ?? DEFAULT_CODE_OPTIONS
        return { ...prev, codeOptions: { ...base, [key]: value } }
      })
    },
    [setDesignSystem],
  )

  return {
    designSystem,
    setDesignSystem,
    setComponentParam,
    setToken,
    setDensity,
    setColorSeed,
    setColorAlgorithm,
    setColorKnob,
    setCodeOption,
  }
}
