'use client'

import { useEffect, useId, useSyncExternalStore } from 'react'

import {
  getValue,
  registerControl,
  subscribe,
  unregisterControl,
} from './store'
import type { TweakConfig, TweakValue } from './types'

type UseTweak = <const C extends TweakConfig>(
  label: string,
  config: C,
) => TweakValue<C>

function useTweakDev<const C extends TweakConfig>(
  label: string,
  config: C,
): TweakValue<C> {
  const ownerToken = useId()
  const group = config.group ?? 'default'
  const id = `${group}::${label}`
  // Inline config literals change identity every render; key the register effect by
  // a stable hash so it doesn't re-register (and churn the panel) on every render.
  const hash = JSON.stringify(config)

  const value = useSyncExternalStore(
    subscribe,
    () => {
      const v = getValue(id)
      return (v === undefined ? config.default : v) as TweakValue<C>
    },
    () => config.default as TweakValue<C>,
  )

  useEffect(() => {
    registerControl(label, config, ownerToken)
    return () => unregisterControl(id)
    // oxlint-disable-next-line react/exhaustive-deps -- keyed by `hash`/`id`, which derive from label+config
  }, [id, hash, ownerToken])

  return value
}

function useTweakNoop<const C extends TweakConfig>(
  _label: string,
  config: C,
): TweakValue<C> {
  return config.default as TweakValue<C>
}

/**
 * Read a live, user-tweakable value while exploring a design in dev.
 *
 * Dev + Vercel previews only: an AI agent adds these to a feature component while
 * you explore it, and the floating Tweaker panel (mounted in `__root.tsx`) lets you
 * flip the value live. In production this compiles to a no-op that returns
 * `config.default`, and the whole tweaker (store + panel) tree-shakes away. See
 * ./README.md for the full workflow.
 *
 * @example
 * const layout = useTweak('Layout', {
 *   type: 'select',
 *   options: ['centered', 'split', 'fullbleed'],
 *   default: 'centered',
 *   group: 'Hero',
 * })
 * // → typed 'centered' | 'split' | 'fullbleed'
 */
export const useTweak: UseTweak =
  import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview'
    ? useTweakDev
    : useTweakNoop
