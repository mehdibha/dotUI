'use client'

import { useCallback, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { ColorConfig, PaletteSeeds, TokenOverride } from '@/registry/theme'
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

  /** Update the color recipe (starting from the default palette). */
  const setColor = useCallback(
    (update: (base: ColorConfig) => ColorConfig) => {
      setDesignSystem((prev) => ({
        ...prev,
        color: update(prev.color ?? DEFAULT_COLOR_CONFIG),
      }))
    },
    [setDesignSystem],
  )

  /** Set one palette seed; `undefined` deletes it (→ engine auto/default). */
  const setColorSeed = useCallback(
    (seed: keyof PaletteSeeds, value: string | undefined) => {
      setColor((base) => {
        if (value === undefined && seed === 'accent') return base
        const seeds = { ...base.seeds }
        if (value === undefined) delete seeds[seed]
        else seeds[seed] = value
        return { ...base, seeds }
      })
    },
    [setColor],
  )

  /** Set one engine axis; `undefined` deletes it (→ engine default). */
  const setColorAxis = useCallback(
    (
      axis: 'vividness' | 'hueShift' | 'neutralTint',
      value: number | undefined,
    ) => {
      setColor((base) => {
        const next = { ...base }
        if (value === undefined) delete next[axis]
        else next[axis] = value
        return next
      })
    },
    [setColor],
  )

  /** Set one mode's app-background; `undefined` deletes it (→ engine default). */
  const setColorBackground = useCallback(
    <M extends 'light' | 'dark'>(
      mode: M,
      value: NonNullable<ColorConfig['background']>[M] | undefined,
    ) => {
      setColor((base) => {
        const background = { ...base.background }
        if (value === undefined) delete background[mode]
        else background[mode] = value
        const { background: _drop, ...rest } = base
        return Object.keys(background).length > 0
          ? { ...rest, background }
          : rest
      })
    },
    [setColor],
  )

  /** Remap one semantic token; `undefined` deletes it (→ default target). */
  const setColorTokenOverride = useCallback(
    (token: string, value: TokenOverride | undefined) => {
      setColor((base) => {
        const overrides = { ...base.overrides }
        if (value === undefined) delete overrides[token]
        else overrides[token] = value
        const { overrides: _drop, ...rest } = base
        return Object.keys(overrides).length > 0 ? { ...rest, overrides } : rest
      })
    },
    [setColor],
  )

  /** Set the guarantee policy; `undefined` deletes it (→ default policy). */
  const setColorGuaranteePolicy = useCallback(
    (policy: 'relaxed' | 'strict' | undefined) => {
      setColor((base) => {
        const { guaranteePolicy: _drop, ...rest } = base
        return policy === undefined
          ? rest
          : { ...rest, guaranteePolicy: policy }
      })
    },
    [setColor],
  )

  /**
   * Set one all-palette border target (the `'*'` key; per-palette entries
   * stay preset-level); `undefined` deletes it (→ skeleton placement).
   */
  const setColorBorderTarget = useCallback(
    (job: '400' | '500' | '600', value: number | undefined) => {
      setColor((base) => {
        const shared = { ...base.borders?.['*'] }
        if (value === undefined) delete shared[job]
        else shared[job] = value
        const borders = { ...base.borders }
        if (Object.keys(shared).length > 0) borders['*'] = shared
        else delete borders['*']
        const { borders: _drop, ...rest } = base
        return Object.keys(borders).length > 0 ? { ...rest, borders } : rest
      })
    },
    [setColor],
  )

  /** Pin (or unpin) the accent seed verbatim at the solid step. */
  const setColorPreserveSeed = useCallback(
    (value: boolean) => {
      setColor((base) => {
        const { preserveSeed: _drop, ...rest } = base
        return value ? { ...rest, preserveSeed: true } : rest
      })
    },
    [setColor],
  )

  /**
   * Pick the ramp primary-action tokens draw from. `undefined` (the neutral
   * default) deletes the field so an untouched recipe still encodes as the
   * default.
   */
  const setColorPrimary = useCallback(
    (source: 'accent' | undefined) => {
      setColor((base) => {
        const { primary: _drop, ...rest } = base
        return source === 'accent' ? { ...rest, primary: 'accent' } : rest
      })
    },
    [setColor],
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
    setColorAxis,
    setColorBackground,
    setColorTokenOverride,
    setColorGuaranteePolicy,
    setColorBorderTarget,
    setColorPreserveSeed,
    setColorPrimary,
    setCodeOption,
  }
}
