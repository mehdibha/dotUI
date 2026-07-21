import {
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
  fontStack,
} from '@/lib/fonts'
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
  /** Google font families for the typography tokens (default Geist / match body). */
  fonts?: { heading?: string; body?: string; mono?: string }
  /** Per-component param overrides on top of the builder defaults. */
  components?: Record<string, Record<string, string>>
}): DesignSystem {
  const { neutral, accent, density = 'default' } = opts
  const tokens: Record<string, string> = {}
  if (opts.radiusFactor) tokens['--radius-factor'] = opts.radiusFactor
  if (opts.fonts?.heading)
    tokens[FONT_HEADING_VAR] = fontStack(opts.fonts.heading)
  if (opts.fonts?.body) tokens[FONT_SANS_VAR] = fontStack(opts.fonts.body)
  if (opts.fonts?.mono) tokens[FONT_MONO_VAR] = fontStack(opts.fonts.mono)
  const componentParams = { ...DEFAULTS.componentParams }
  for (const [component, overrides] of Object.entries(opts.components ?? {})) {
    componentParams[component] = { ...componentParams[component], ...overrides }
  }
  return {
    ...DEFAULTS,
    componentParams,
    density,
    tokens,
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
      components: { command: { style: '3' } },
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
      // Verified against live production CSS: Supabase ships Inter.
      fonts: { body: 'Inter' },
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
      // Stripe's UI font is Söhne (proprietary); Inter is the closest free grotesque.
      fonts: { body: 'Inter' },
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
      // Linear ships Inter (verified against live production CSS).
      fonts: { body: 'Inter' },
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
      // Anthropic Sans is proprietary; Space Grotesk stands in, with a warm
      // Fraunces heading to show the heading axis on an editorial system.
      fonts: { heading: 'Fraunces', body: 'Space Grotesk' },
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
      // Airbnb Cereal is proprietary; Plus Jakarta Sans is the closest free match.
      fonts: { body: 'Plus Jakarta Sans' },
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
      // GitHub's brand font, open-sourced and on Google Fonts.
      fonts: { body: 'Mona Sans' },
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
      // Spotify Circular is proprietary; Figtree is the closest free geometric.
      fonts: { body: 'Figtree' },
    }),
  },
]
