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
    id: 'default',
    name: 'Default',
    description: 'dotUI out of the box.',
    swatch: '#a1a1aa',
    designSystem: { ...DEFAULTS },
  },
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
    id: 'material',
    name: 'Material You',
    description: 'Soft purple, generous round.',
    swatch: '#a78bfa',
    designSystem: makeDesignSystem({
      neutral: '#79747e',
      accent: '#6750a4',
      primary: 'accent',
      radiusFactor: '1.75',
      density: 'comfortable',
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
    id: 'rose',
    name: 'Rosé',
    description: 'Pink, pill-soft radii.',
    swatch: '#fb7185',
    designSystem: makeDesignSystem({
      neutral: '#7d7d7d',
      accent: '#e11d48',
      primary: 'accent',
      radiusFactor: '2',
      density: 'comfortable',
    }),
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'Vivid emerald, sharp corners.',
    swatch: '#34d399',
    designSystem: makeDesignSystem({
      neutral: '#71717a',
      accent: '#059669',
      primary: 'accent',
      vividness: 1.33,
      radiusFactor: '0.75',
      density: 'default',
    }),
  },
]
