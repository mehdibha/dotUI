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
  /** App-background lightness per mode (engine axis; dark accepts 0–20 or 'oled'). */
  background?: ColorConfig['background']
  /** Per-token semantic remaps (palette + job, optionally per-mode). */
  colorOverrides?: ColorConfig['overrides']
  /** Google font families for the typography tokens (default Geist / match body). */
  fonts?: { heading?: string; body?: string; mono?: string }
  /** Per-component param overrides on top of the builder defaults. */
  components?: Record<string, Record<string, string>>
  /** Raw token overrides (semantic color roles, etc.). */
  tokens?: Record<string, string>
}): DesignSystem {
  const { neutral, accent, density = 'default' } = opts
  const tokens: Record<string, string> = { ...opts.tokens }
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
      ...(opts.background ? { background: opts.background } : {}),
      ...(opts.colorOverrides ? { overrides: opts.colorOverrides } : {}),
    },
  }
}

export const PRESETS: Preset[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Monochrome, hairline borders.',
    swatch: '#cbd5e1',
    designSystem: makeDesignSystem({
      neutral: '#737373',
      accent: '#171717',
      // Geist runs a 14px/32px UI scale at 6px radii — our defaults, not compact/0.5
      // (verified against live computed styles; see issue #484 Phase 1 audit).
      density: 'default',
      // A pure-gray accent: zero vividness keeps the ramp from tinting back up
      // (Geist-style neutral primary).
      vividness: 0,
      // Vercel dark runs a true-black page with #0a0a0a panels; dark:0 lands
      // n50 (the card step) on 0x0a0a0a exactly.
      background: { dark: 0 },
      colorOverrides: {
        // Geist hairlines sit two ramp steps lighter than our border default.
        'color-border': { palette: 'neutral', job: 'ui-hover' },
        // Light mode inverts our elevation: white cards float on a #fafafa page.
        'color-bg': { light: { palette: 'neutral', job: 'subtle-bg' } },
        'color-card': { light: { palette: 'neutral', job: 'app-bg' } },
        'color-popover': { light: { palette: 'neutral', job: 'app-bg' } },
      },
      components: {
        command: { style: '3' },
        badge: { radius: '--radius-full' },
      },
      tokens: {
        // Vercel's focus ring is opaque blue, not the monochrome accent.
        '--color-border-focus': '#0072f5',
      },
    }),
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Emerald on cool gray.',
    swatch: '#3ecf8e',
    designSystem: makeDesignSystem({
      // Supabase grays are near-neutral with a faint green cast (hue ~159), not
      // cool blue; measured on production docs CSS (issue #484 audit).
      neutral: '#6d726f',
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
      // Stripe controls measure ~8px radius — rounder than default, not tighter.
      radiusFactor: '1.33',
      density: 'default',
      // Stripe's UI font is Söhne (proprietary); Inter is the closest free grotesque.
      fonts: { body: 'Inter' },
    }),
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Indigo, crisp hairlines.',
    swatch: '#818cf8',
    designSystem: makeDesignSystem({
      neutral: '#8a8f98',
      accent: '#5e6ad2',
      primary: 'accent',
      // Linear controls measure 32px/12px — our default scale, not compact.
      density: 'default',
      // Linear ships Inter (verified against live production CSS).
      fonts: { body: 'Inter' },
      // Linear's dark-first page is near-black #08090a.
      background: { dark: 2 },
      // Hairlines are far softer than our border default.
      colorOverrides: {
        'color-border': { palette: 'neutral', job: 'ui-hover' },
      },
    }),
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Warm coral on sand.',
    swatch: '#e0916f',
    designSystem: makeDesignSystem({
      // Claude neutrals are yellow-warm beige (hue ~96), not orange (issue #484 audit).
      neutral: '#84806f',
      accent: '#d97757',
      primary: 'accent',
      radiusFactor: '1.5',
      density: 'default',
      // Anthropic Sans is a neutral grotesque (Inter is closest free); Anthropic
      // Serif is a calm book serif (Source Serif 4, not display-contrast Fraunces).
      fonts: { heading: 'Source Serif 4', body: 'Inter' },
      // Claude's signature cream page (#faf9f5 ≈ L* 98, warm hue from the seed).
      background: { light: 98 },
    }),
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Rausch accents, ink actions.',
    swatch: '#ff5c7c',
    designSystem: makeDesignSystem({
      neutral: '#717171',
      accent: '#ff385c',
      // Airbnb's primary CTA and selection controls are near-black (#222); Rausch
      // stays the accent for badges, links, prices (issue #484 audit).
      // Controls measure 8px radius, not 12.
      radiusFactor: '1.33',
      density: 'comfortable',
      // Airbnb Cereal is proprietary; Plus Jakarta Sans is the closest free match.
      fonts: { body: 'Plus Jakarta Sans' },
      components: { badge: { radius: '--radius-full' } },
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
      // GitHub dark sits on blue-black #0d1117.
      background: { dark: 4.5 },
      // Inputs are canvas-white in light but a raised panel in dark.
      colorOverrides: {
        'color-field': {
          light: { palette: 'neutral', job: 'app-bg' },
          dark: { palette: 'neutral', job: 'ui-rest' },
        },
      },
      // Labels/counters are pills; focus ring is a brighter blue than link blue.
      components: { badge: { radius: '--radius-full' } },
      tokens: { '--color-border-focus': '#1f6feb' },
    }),
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Warm ink, quiet blue.',
    swatch: '#d4cec2',
    designSystem: makeDesignSystem({
      neutral: '#787774',
      // The blue actually measured on Notion CTAs/links; #2383e2 rendered too light.
      accent: '#0075de',
      primary: 'accent',
      radiusFactor: '0.75',
      // Notion chrome text is 14px — our default, not compact (issue #484 audit).
      density: 'default',
      // Notion ships NotionInter, a customized Inter.
      fonts: { body: 'Inter' },
      colorOverrides: {
        'color-border': { palette: 'neutral', job: 'ui-hover' },
      },
    }),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Vivid green, pill-shaped.',
    swatch: '#1ed760',
    designSystem: makeDesignSystem({
      neutral: '#6a6a6a',
      // Spotify's interactive green (buttons, Play) — brighter than the logo green.
      accent: '#1ed760',
      primary: 'accent',
      radiusFactor: '2',
      density: 'default',
      // Spotify Circular is proprietary; Figtree is the closest free geometric.
      fonts: { body: 'Figtree' },
      components: {
        badge: { radius: '--radius-full' },
        input: { style: 'filled' },
      },
    }),
  },
]
