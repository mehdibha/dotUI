import type { ColorConfig } from '@/registry/theme'
import type { Density } from '@/registry/types'

export type { Density }

/**
 * Compact representation for URL serialization. Short keys keep the encoded
 * string small.
 *   p = component params (per-component values, e.g. { alert: { style: "sousse", radius: "--radius-md" } })
 *   t = global theme tokens (CSS vars not owned by any component, e.g. { "--radius-factor": "1.25" })
 *   d = density
 *   c = color config (algorithm + palette seeds); present only when it differs from the default
 */
export type DesignSystemState = {
  p?: Record<string, Record<string, string>>
  t?: Record<string, string>
  d?: Density
  c?: ColorConfig
}

/**
 * Readable representation used by the customizer and provider.
 */
export type DesignSystem = {
  /** Per-component param selections (covers what was previously styles + tokens + params). */
  componentParams: Record<string, Record<string, string>>
  /** Global CSS vars not owned by any component (radius factor, cursor, palette overrides, etc.). */
  tokens: Record<string, string>
  density: Density
  /** Generative color recipe; `undefined` means the default generated palette. */
  color?: ColorConfig
}

export function fromCompact(state: DesignSystemState): DesignSystem {
  return {
    componentParams: state.p ?? {},
    tokens: state.t ?? {},
    density: state.d ?? 'compact',
    color: state.c,
  }
}
