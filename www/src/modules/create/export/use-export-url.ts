import { useEffect, useMemo, useState } from 'react'

import { useDesignSystem } from '../preset'
import { encodePreset } from '../preset/codec'
import type { PresetUrl } from './types'

const DEFAULT_REGISTRY_HOST = 'https://dotui.com'

/**
 * The origin to build registry URLs against. v0 and the shadcn CLI fetch these
 * URLs server-side, so on localhost (or a `file:`/null origin) we point back at
 * the deployed host — fetching `http://localhost` would fail for them.
 */
function getRegistryHost(): string {
  if (typeof window === 'undefined') return DEFAULT_REGISTRY_HOST
  const { origin } = window.location
  if (
    origin === 'null' ||
    origin === 'http://localhost' ||
    origin.startsWith('file:')
  ) {
    return DEFAULT_REGISTRY_HOST
  }
  return origin
}

/**
 * Returns a `presetUrl(path)` builder that resolves a registry path against the
 * right host and appends the current design system as `?preset=<encoded>` —
 * e.g. `presetUrl('/r/init')` → `https://host/r/init?preset=…`.
 *
 * The host hydrates in an effect (SSR renders the default host, the client then
 * swaps to the live origin) so the URL stays stable across hydration.
 */
export function useExportUrl(): PresetUrl {
  const { designSystem } = useDesignSystem()
  const [host, setHost] = useState(DEFAULT_REGISTRY_HOST)

  useEffect(() => {
    setHost(getRegistryHost())
  }, [])

  return useMemo(() => {
    const encoded = encodePreset(designSystem)
    return (path: string) => {
      const base = `${host}${path}`
      return encoded ? `${base}?preset=${encoded}` : base
    }
  }, [designSystem, host])
}
