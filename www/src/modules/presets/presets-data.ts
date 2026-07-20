import type { ColorConfig } from '@/registry/theme'
import { DEFAULTS, type DesignSystem } from '@/modules/create/preset'

/**
 * A pre-built design system the gallery can browse and present.
 *
 * EXPERIMENT: this hand-authored list stands in for a real preset source so we
 * can validate the gallery UI. Each entry varies only the high-impact, low-risk
 * axes (palette seeds, engine axes, density, radius) off the builder defaults —
 * enough to read as a distinct design system in the scaled-down preview.
 */
export type Preset = {
  id: string
  name: string
  description: string
  /**
   * Illustrative accent for picker dots — curated, not derived from the seeds,
   * so each reads clearly on UI surfaces in both modes (e.g. Vercel's
   * near-black accent would vanish; it shows as a monochrome light dot).
   */
  swatch: string
  designSystem: DesignSystem
}

function makeDesignSystem(opts: {
  neutral: string
  accent: string
  density?: DesignSystem['density']
  /** Multiplier on every radius token (1 = builder default). */
  radiusFactor?: string
  /** Ramp the primary-action tokens draw from (default neutral black/white). */
  primary?: ColorConfig['primary']
  /** Chroma-curve scale (1 = engine default). */
  vividness?: ColorConfig['vividness']
}): DesignSystem {
  const { neutral, accent, density = 'default' } = opts
  return {
    ...DEFAULTS,
    density,
    tokens: opts.radiusFactor ? { '--radius-factor': opts.radiusFactor } : {},
    color: {
      v: 2,
      seeds: { accent, neutral },
      ...(opts.primary ? { primary: opts.primary } : {}),
      ...(opts.vividness !== undefined ? { vividness: opts.vividness } : {}),
    },
  }
}

export const PRESETS: Preset[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Monochrome, tight radii.',
    swatch: '#cbd5e1',
    designSystem: makeDesignSystem({
      neutral: '#737373',
      accent: '#171717',
      radiusFactor: '0.5',
      density: 'compact',
      // A pure-gray accent: zero vividness keeps the ramp from tinting back up
      // (Geist-style neutral primary).
      vividness: 0,
    }),
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Emerald on cool gray.',
    swatch: '#3ecf8e',
    designSystem: makeDesignSystem({
      neutral: '#6b7280',
      accent: '#3ecf8e',
      primary: 'accent',
      density: 'default',
    }),
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Blurple on cool slate.',
    swatch: '#7a73ff',
    designSystem: makeDesignSystem({
      neutral: '#687385',
      accent: '#635bff',
      primary: 'accent',
      radiusFactor: '0.75',
      density: 'default',
    }),
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Indigo, crisp and compact.',
    swatch: '#818cf8',
    designSystem: makeDesignSystem({
      neutral: '#8a8f98',
      accent: '#5e6ad2',
      primary: 'accent',
      density: 'compact',
    }),
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Warm coral on sand.',
    swatch: '#e0916f',
    designSystem: makeDesignSystem({
      neutral: '#8a8278',
      accent: '#d97757',
      primary: 'accent',
      radiusFactor: '1.5',
      density: 'default',
    }),
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Rausch pink, pill-round.',
    swatch: '#ff5c7c',
    designSystem: makeDesignSystem({
      neutral: '#717171',
      accent: '#ff385c',
      primary: 'accent',
      radiusFactor: '2',
      density: 'comfortable',
    }),
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Primer blue, sober gray.',
    swatch: '#54aeff',
    designSystem: makeDesignSystem({
      neutral: '#656d76',
      accent: '#0969da',
      primary: 'accent',
      density: 'default',
    }),
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Warm ink, quiet blue.',
    swatch: '#d4cec2',
    designSystem: makeDesignSystem({
      neutral: '#787774',
      accent: '#2383e2',
      radiusFactor: '0.75',
      density: 'compact',
    }),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Vivid green, pill-shaped.',
    swatch: '#1ed760',
    designSystem: makeDesignSystem({
      neutral: '#6a6a6a',
      accent: '#1db954',
      primary: 'accent',
      radiusFactor: '2',
      density: 'default',
    }),
  },
]
