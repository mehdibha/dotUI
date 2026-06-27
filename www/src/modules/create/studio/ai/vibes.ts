import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { AlgorithmId, ColorConfig } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../../layout'
import type { Density, DesignSystem } from '../../preset'

/* ----------------------------------------------------------------------------
 * Vibes — the AI's curated palette of whole-system directions.
 *
 * Each vibe is a recognizable look the prompt / copilot can land on. Applying
 * one mutates the *real* DesignSystem (accent, neutral, radius, density,
 * algorithm + a few forward-looking stub tokens), so the live preview actually
 * transforms. This is the UI of an AI feature; a real model would emit the same
 * shape from a server function (the codebase already exposes that pattern).
 * -------------------------------------------------------------------------- */

export interface Vibe {
  id: string
  label: string
  /** One-line description shown on the result card and chips. */
  summary: string
  /** Match terms for the prompt / copilot intent matcher. */
  tags: string[]
  accent: string
  neutral: string
  radius: string
  density: Density
  algorithm: AlgorithmId
  /** Forward-looking axes the preview doesn't consume yet (honest stubs). */
  tokens?: Record<string, string>
  /** Two swatch hexes for the chip's mini gradient. */
  swatch: [string, string]
}

export const STYLE_FAMILY_VAR = '--ds-elevation-style'
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const DEFAULT_MODE_VAR = '--ds-default-mode'
export const BG_TEXTURE_VAR = '--ds-bg-texture'

export const VIBES: Vibe[] = [
  {
    id: 'linear',
    label: 'Linear',
    summary: 'Crisp, fast, focused — indigo on a cool near-black.',
    tags: [
      'linear',
      'crisp',
      'fast',
      'focused',
      'productivity',
      'saas',
      'sharp',
    ],
    accent: '#5e6ad2',
    neutral: '#6b7280',
    radius: '0.7',
    density: 'compact',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'flat',
      [FONT_HEADING_VAR]: 'Inter',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#5e6ad2', '#1c1c28'],
  },
  {
    id: 'geist',
    label: 'Geist',
    summary: 'Stark monochrome — black, hairline borders, maximum contrast.',
    tags: [
      'geist',
      'vercel',
      'mono',
      'monochrome',
      'black',
      'minimal',
      'stark',
      'clean',
    ],
    accent: '#171717',
    neutral: '#808080',
    radius: '0.5',
    density: 'compact',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'flat',
      [FONT_HEADING_VAR]: 'Geist',
      [FONT_BODY_VAR]: 'Geist',
    },
    swatch: ['#171717', '#a3a3a3'],
  },
  {
    id: 'stripe',
    label: 'Stripe',
    summary: 'Trustworthy fintech polish — indigo, soft shadows, rounded.',
    tags: [
      'stripe',
      'fintech',
      'finance',
      'trust',
      'corporate',
      'payment',
      'professional',
    ],
    accent: '#635bff',
    neutral: '#6772a9',
    radius: '1.1',
    density: 'default',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'soft',
      [FONT_HEADING_VAR]: 'Söhne',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#635bff', '#0a2540'],
  },
  {
    id: 'editorial',
    label: 'Editorial',
    summary: 'Magazine feel — forest green, serif headings, generous space.',
    tags: [
      'editorial',
      'magazine',
      'blog',
      'serif',
      'reading',
      'content',
      'elegant',
      'warm',
    ],
    accent: '#0f766e',
    neutral: '#78716c',
    radius: '0.3',
    density: 'comfortable',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'flat',
      [FONT_HEADING_VAR]: 'Lora',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#0f766e', '#44403c'],
  },
  {
    id: 'playful',
    label: 'Playful',
    summary: 'Friendly and rounded — rose pink, big radius, airy.',
    tags: [
      'playful',
      'fun',
      'friendly',
      'rounded',
      'consumer',
      'bubbly',
      'soft',
      'pink',
    ],
    accent: '#f43f5e',
    neutral: '#7c7c8a',
    radius: '1.8',
    density: 'comfortable',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'soft',
      [FONT_HEADING_VAR]: 'Satoshi',
      [FONT_BODY_VAR]: 'Satoshi',
    },
    swatch: ['#f43f5e', '#fb923c'],
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    summary: 'Raw and sharp — pure black, zero radius, vivid accents.',
    tags: [
      'brutalist',
      'raw',
      'sharp',
      'square',
      'bold',
      'harsh',
      'edgy',
      'punk',
    ],
    accent: '#1d4ed8',
    neutral: '#737373',
    radius: '0',
    density: 'compact',
    algorithm: 'tailwind',
    tokens: {
      [STYLE_FAMILY_VAR]: 'flat',
      [FONT_HEADING_VAR]: 'Geist',
      [FONT_BODY_VAR]: 'Mono',
    },
    swatch: ['#1d4ed8', '#000000'],
  },
  {
    id: 'supabase',
    label: 'Developer',
    summary: 'Dev-grade — emerald green on a dark, dense grid.',
    tags: [
      'developer',
      'supabase',
      'green',
      'emerald',
      'terminal',
      'dev',
      'technical',
      'dark',
    ],
    accent: '#3ecf8e',
    neutral: '#64748b',
    radius: '0.6',
    density: 'compact',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'flat',
      [DEFAULT_MODE_VAR]: 'dark',
      [FONT_HEADING_VAR]: 'Geist',
      [FONT_BODY_VAR]: 'Geist',
    },
    swatch: ['#3ecf8e', '#11181c'],
  },
  {
    id: 'neon',
    label: 'Neon',
    summary: 'Neon on black — electric cyan, vivid ramps, glow.',
    tags: [
      'neon',
      'cyberpunk',
      'cyber',
      'electric',
      'glow',
      'vivid',
      'futuristic',
      'cyan',
      'dark',
    ],
    accent: '#22d3ee',
    neutral: '#5b6472',
    radius: '0.9',
    density: 'default',
    algorithm: 'tailwind',
    tokens: {
      [STYLE_FAMILY_VAR]: 'glass',
      [DEFAULT_MODE_VAR]: 'dark',
      [FONT_HEADING_VAR]: 'Geist',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#22d3ee', '#a855f7'],
  },
  {
    id: 'warm',
    label: 'Warm',
    summary: 'Warm and inviting — sunset amber, brand-tinted grays.',
    tags: [
      'warm',
      'sunset',
      'amber',
      'orange',
      'cozy',
      'inviting',
      'earthy',
      'golden',
    ],
    accent: '#ea7317',
    neutral: '#a8907a',
    radius: '1.2',
    density: 'default',
    algorithm: 'oklch',
    tokens: {
      [STYLE_FAMILY_VAR]: 'soft',
      [FONT_HEADING_VAR]: 'Satoshi',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#ea7317', '#f59e0b'],
  },
  {
    id: 'material',
    label: 'Material',
    summary: 'Google Material baseline — blue, tonal ramps, soft depth.',
    tags: [
      'material',
      'google',
      'android',
      'tonal',
      'baseline',
      'blue',
      'corporate',
    ],
    accent: '#1a73e8',
    neutral: '#5f6368',
    radius: '1.4',
    density: 'default',
    algorithm: 'material',
    tokens: {
      [STYLE_FAMILY_VAR]: 'depth',
      [FONT_HEADING_VAR]: 'Inter',
      [FONT_BODY_VAR]: 'Inter',
    },
    swatch: ['#1a73e8', '#7baaf7'],
  },
]

/** Build a DesignSystem updater from a vibe — merges onto whatever's current. */
export function vibeToMutate(vibe: Vibe) {
  return (prev: DesignSystem): DesignSystem => {
    const baseColor: ColorConfig = prev.color ?? DEFAULT_COLOR_CONFIG
    return {
      ...prev,
      density: vibe.density,
      tokens: {
        ...prev.tokens,
        [RADIUS_FACTOR_VAR]: vibe.radius,
        ...vibe.tokens,
      },
      color: {
        ...baseColor,
        algorithm: vibe.algorithm,
        seeds: {
          ...baseColor.seeds,
          accent: vibe.accent,
          neutral: vibe.neutral,
        },
      },
    }
  }
}
