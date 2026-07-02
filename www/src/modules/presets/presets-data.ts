import { DEFAULT_COLOR_CONFIG, type ColorConfig } from '@/registry/theme'
import { DEFAULTS, type DesignSystem } from '@/modules/create/preset'

/**
 * A pre-built design system the gallery can browse and present.
 *
 * EXPERIMENT: this hand-authored list stands in for a real preset source so we
 * can validate the gallery UI. Each entry varies only the high-impact, low-risk
 * axes (palette seeds, algorithm, density, radius) off the builder defaults —
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
  algorithm?: ColorConfig['algorithm']
  neutral: string
  accent: string
  density?: DesignSystem['density']
  /** Multiplier on every radius token (1 = builder default). */
  radiusFactor?: string
  /** Per-producer tuning (e.g. force a gray accent to stay gray). */
  knobs?: ColorConfig['knobs']
}): DesignSystem {
  const { algorithm = 'oklch', neutral, accent, density = 'compact' } = opts
  return {
    ...DEFAULTS,
    density,
    tokens: opts.radiusFactor ? { '--radius-factor': opts.radiusFactor } : {},
    color: {
      algorithm,
      seeds: { ...DEFAULT_COLOR_CONFIG.seeds, neutral, accent },
      ...(opts.knobs ? { knobs: opts.knobs } : {}),
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
      // A pure-gray accent: kill chroma so the producer doesn't floor it back
      // up to a tinted ramp (Geist-style neutral primary).
      knobs: { chromaMult: 0, minChroma: 0 },
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
      density: 'default',
    }),
  },
  {
    id: 'material',
    name: 'Material You',
    description: 'Soft purple, generous round.',
    swatch: '#a78bfa',
    designSystem: makeDesignSystem({
      algorithm: 'material',
      neutral: '#79747e',
      accent: '#6750a4',
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
      radiusFactor: '2',
      density: 'comfortable',
    }),
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'APCA-tuned emerald.',
    swatch: '#34d399',
    designSystem: makeDesignSystem({
      algorithm: 'contrast',
      neutral: '#71717a',
      accent: '#059669',
      radiusFactor: '0.75',
      density: 'default',
    }),
  },
]
