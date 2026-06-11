import { deflateRaw, inflateRaw } from 'pako'

import {
  DEFAULT_COLOR_CONFIG,
  GENERATIVE_ALGORITHMS,
  type ColorConfig,
} from '@/registry/theme'

import { DEFAULTS } from './defaults'
import { fromCompact } from './types'
import type { DesignSystem, DesignSystemState } from './types'

/* ----------------------------- base64url helpers ----------------------------- */

function toBase64Url(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str: string): Uint8Array {
  const padded =
    str.replace(/-/g, '+').replace(/_/g, '/') +
    '=='.slice(0, (4 - (str.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

/* ------------------------------ diff helpers ------------------------------ */

/** Remove entries that match defaults, returning only overrides. */
function diffRecords(
  current: Record<string, string>,
  defaults: Record<string, string>,
): Record<string, string> | undefined {
  const result: Record<string, string> = {}
  let hasEntries = false
  for (const [key, value] of Object.entries(current)) {
    if (value !== defaults[key]) {
      result[key] = value
      hasEntries = true
    }
  }
  return hasEntries ? result : undefined
}

function diffNestedRecords(
  current: Record<string, Record<string, string>>,
  defaults: Record<string, Record<string, string>>,
): Record<string, Record<string, string>> | undefined {
  const result: Record<string, Record<string, string>> = {}
  let hasEntries = false
  for (const [outer, inner] of Object.entries(current)) {
    const innerDiff = diffRecords(inner, defaults[outer] ?? {})
    if (innerDiff) {
      result[outer] = innerDiff
      hasEntries = true
    }
  }
  return hasEntries ? result : undefined
}

function mergeNested(
  defaults: Record<string, Record<string, string>>,
  overrides: Record<string, Record<string, string>>,
): Record<string, Record<string, string>> {
  const merged: Record<string, Record<string, string>> = {}
  const keys = new Set([...Object.keys(defaults), ...Object.keys(overrides)])
  for (const key of keys) {
    merged[key] = { ...(defaults[key] ?? {}), ...(overrides[key] ?? {}) }
  }
  return merged
}

/* --------------------------------- encode --------------------------------- */

/**
 * Encode a DesignSystem into a compact URL-safe string.
 * Returns `undefined` when all values match defaults (no preset needed).
 */
export function encodePreset(ds: DesignSystem): string | undefined {
  const compact: DesignSystemState = {}

  const paramDiff = diffNestedRecords(
    ds.componentParams,
    DEFAULTS.componentParams,
  )
  if (paramDiff) compact.p = paramDiff

  const tokenDiff = diffRecords(ds.tokens, DEFAULTS.tokens)
  if (tokenDiff) compact.t = tokenDiff

  if (ds.density !== DEFAULTS.density) compact.d = ds.density

  // Store the whole (small) color recipe only when it differs from the default palette.
  if (
    ds.color &&
    JSON.stringify(ds.color) !== JSON.stringify(DEFAULT_COLOR_CONFIG)
  )
    compact.c = ds.color

  if (!compact.p && !compact.t && !compact.d && !compact.c) return undefined

  const json = JSON.stringify(compact)
  const compressed = deflateRaw(json, { level: 9 })
  return toBase64Url(compressed)
}

/* --------------------------------- decode --------------------------------- */

/**
 * Drop a decoded color recipe whose algorithm isn't seed-generative (e.g. a stale or
 * crafted `fixed` preset that would otherwise throw inside `resolveColorConfig`).
 */
function sanitizeColor(
  color: ColorConfig | undefined,
): ColorConfig | undefined {
  if (!color) return undefined
  return (GENERATIVE_ALGORITHMS as readonly string[]).includes(color.algorithm)
    ? color
    : undefined
}

/**
 * Decode a preset string back into a full DesignSystem.
 * Falls back to defaults on any error.
 */
export function decodePreset(encoded: string): DesignSystem {
  try {
    const bytes = fromBase64Url(encoded)
    const json = inflateRaw(bytes, { to: 'string' })
    const partial: DesignSystemState = JSON.parse(json)
    const ds = fromCompact(partial)
    return {
      componentParams: mergeNested(
        DEFAULTS.componentParams,
        ds.componentParams,
      ),
      tokens: { ...DEFAULTS.tokens, ...ds.tokens },
      density: ds.density,
      color: sanitizeColor(ds.color),
    }
  } catch {
    return DEFAULTS
  }
}
