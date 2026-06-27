import {
  BoxIcon,
  type LucideIcon,
  LayersIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import type { Density } from '../preset'

/* ----------------------------------------------------------------------------
 * Chapters — the spine of the studio. Each is a coherent slice of the design
 * system the inspector renders one at a time, navigated from the icon rail.
 * -------------------------------------------------------------------------- */

export type ChapterId =
  | 'brand'
  | 'color'
  | 'typography'
  | 'layout'
  | 'material'
  | 'motion'
  | 'icons'
  | 'components'
  | 'interaction'

export interface Chapter {
  id: ChapterId
  label: string
  /** One-line subtitle shown atop the chapter. */
  blurb: string
  icon: LucideIcon
  /** Rail grouping — a thin divider separates groups. */
  group: 'foundations' | 'surface' | 'parts'
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'brand',
    label: 'Brand',
    blurb: 'Seed one color — get a whole system.',
    icon: SparklesIcon,
    group: 'foundations',
  },
  {
    id: 'color',
    label: 'Color',
    blurb: 'Seeds, generation, semantics, and contrast.',
    icon: PaletteIcon,
    group: 'foundations',
  },
  {
    id: 'typography',
    label: 'Typography',
    blurb: 'Type faces, scale, and rhythm.',
    icon: TypeIcon,
    group: 'foundations',
  },
  {
    id: 'layout',
    label: 'Shape & density',
    blurb: 'Corner radius, borders, and spacing.',
    icon: RulerIcon,
    group: 'foundations',
  },
  {
    id: 'material',
    label: 'Material',
    blurb: 'The big re-skin: flat, soft, elevated, or glass.',
    icon: LayersIcon,
    group: 'surface',
  },
  {
    id: 'motion',
    label: 'Motion',
    blurb: 'How the system moves.',
    icon: ZapIcon,
    group: 'surface',
  },
  {
    id: 'icons',
    label: 'Icons',
    blurb: 'Icon set, weight, and size.',
    icon: SmileIcon,
    group: 'surface',
  },
  {
    id: 'components',
    label: 'Components',
    blurb: 'Per-component styles, synced across groups.',
    icon: BoxIcon,
    group: 'parts',
  },
  {
    id: 'interaction',
    label: 'Interaction',
    blurb: 'Cursors, focus, and the small physical details.',
    icon: MousePointer2Icon,
    group: 'parts',
  },
]

export function getChapter(id: ChapterId): Chapter {
  return CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0]!
}

/* ----------------------------------------------------------------------------
 * Token vocabulary. The real, live axes use the existing channels (color via
 * the recipe, radius/density/params via their setters). The new tweaks ride
 * through the same `tokens` map as plain CSS vars — harmless if no component
 * reads one yet, and instantly live the moment one does (the preview iframe
 * receives every token over postMessage either way).
 * -------------------------------------------------------------------------- */

export const RADIUS_FACTOR_VAR = '--radius-factor'
export const DEFAULT_RADIUS_FACTOR = '1'

export const CURSOR_INTERACTIVE_VAR = '--cursor-interactive'
export const CURSOR_DISABLED_VAR = '--cursor-disabled'
export const DEFAULT_CURSOR_INTERACTIVE = 'default'
export const DEFAULT_CURSOR_DISABLED = 'not-allowed'

/* New axes introduced by this redesign (UI-first; written as CSS vars). */
export const STYLE_FAMILY_VAR = '--ds-style-family'
export const SHADOW_VAR = '--ds-shadow-intensity'
export const BLUR_VAR = '--ds-backdrop-blur'
export const SURFACE_VAR = '--ds-surface-contrast'
export const TRANSLUCENT_VAR = '--ds-translucent-overlays'

export const MOTION_SPEED_VAR = '--ds-motion-speed'
export const MOTION_EASING_VAR = '--ds-motion-easing'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'

export const BORDER_WIDTH_VAR = '--ds-border-width'
export const SPACING_SCALE_VAR = '--ds-spacing-scale'

export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const HEADING_WEIGHT_VAR = '--ds-heading-weight'
export const LETTER_SPACING_VAR = '--ds-letter-spacing'

export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'

export const FOCUS_RING_VAR = '--ds-focus-ring-width'
export const NEUTRAL_TEMP_VAR = '--ds-neutral-temp'
export const CONTRAST_TARGET_VAR = '--ds-contrast-target'
export const DARK_STRATEGY_VAR = '--ds-dark-strategy'

/* ----------------------------------------------------------------------------
 * Style families — one switch that restyles the whole system's surfaces.
 * -------------------------------------------------------------------------- */

export const STYLE_FAMILIES = [
  { value: 'flat', label: 'Flat', hint: 'Borders, no shadows' },
  { value: 'soft', label: 'Soft', hint: 'Gentle shadows' },
  { value: 'elevated', label: 'Elevated', hint: 'Pronounced depth' },
  { value: 'glass', label: 'Glass', hint: 'Translucent, blurred' },
] as const

export type StyleFamily = (typeof STYLE_FAMILIES)[number]['value']

/* ----------------------------------------------------------------------------
 * Curated font pairings — the fast path to a typographic identity.
 * -------------------------------------------------------------------------- */

export const FONT_PAIRINGS: Array<{
  id: string
  label: string
  heading: string
  body: string
}> = [
  { id: 'geist', label: 'Geist', heading: 'Geist', body: 'Geist' },
  { id: 'inter', label: 'Inter', heading: 'Inter', body: 'Inter' },
  { id: 'editorial', label: 'Editorial', heading: 'Fraunces', body: 'Inter' },
  { id: 'grotesk', label: 'Grotesk', heading: 'Space Grotesk', body: 'Inter' },
  { id: 'mono', label: 'Technical', heading: 'Geist', body: 'Geist Mono' },
]

export const CURATED_FONTS = [
  'Geist',
  'Inter',
  'Geist Mono',
  'Space Grotesk',
  'Fraunces',
  'Roboto',
  'Poppins',
  'Montserrat',
  'IBM Plex Sans',
  'Source Sans 3',
  'Manrope',
  'DM Sans',
  'Outfit',
  'Sora',
  'Playfair Display',
  'Lora',
]

/* ----------------------------------------------------------------------------
 * Icon libraries.
 * -------------------------------------------------------------------------- */

export const ICON_LIBRARIES = [
  { value: 'lucide', label: 'Lucide', hint: 'Clean & consistent' },
  { value: 'remix', label: 'Remix', hint: 'Neutral & versatile' },
  { value: 'tabler', label: 'Tabler', hint: 'Over 5,000 icons' },
  { value: 'hugeicons', label: 'Hugeicons', hint: 'Modern & bold' },
] as const

/* ----------------------------------------------------------------------------
 * Presets — complete, named starting points. One click loads a whole system.
 * -------------------------------------------------------------------------- */

export interface Preset {
  id: string
  label: string
  hint: string
  accent: string
  neutral: string
  radius: string
  density: Density
  styleFamily: StyleFamily
  heading: string
  body: string
}

export const PRESETS: Preset[] = [
  {
    id: 'dotui',
    label: 'dotUI',
    hint: 'The calm default',
    accent: '#438cd6',
    neutral: '#808080',
    radius: '1',
    density: 'compact',
    styleFamily: 'soft',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'linear',
    label: 'Linear',
    hint: 'Indigo, tight, soft',
    accent: '#5e6ad2',
    neutral: '#8a8a99',
    radius: '0.75',
    density: 'compact',
    styleFamily: 'soft',
    heading: 'Inter',
    body: 'Inter',
  },
  {
    id: 'vercel',
    label: 'Vercel',
    hint: 'Mono, flat, sharp',
    accent: '#171717',
    neutral: '#7d7d7d',
    radius: '0.4',
    density: 'compact',
    styleFamily: 'flat',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'material',
    label: 'Material',
    hint: 'Purple, round, elevated',
    accent: '#6750a4',
    neutral: '#79767d',
    radius: '1.6',
    density: 'comfortable',
    styleFamily: 'elevated',
    heading: 'Roboto',
    body: 'Roboto',
  },
  {
    id: 'stripe',
    label: 'Stripe',
    hint: 'Violet, glassy',
    accent: '#635bff',
    neutral: '#8b8ba7',
    radius: '1',
    density: 'default',
    styleFamily: 'glass',
    heading: 'Inter',
    body: 'Inter',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    hint: 'Teal, serif, airy',
    accent: '#0f766e',
    neutral: '#7c7d77',
    radius: '0.3',
    density: 'comfortable',
    styleFamily: 'flat',
    heading: 'Fraunces',
    body: 'Inter',
  },
  {
    id: 'playful',
    label: 'Playful',
    hint: 'Pink, round, bouncy',
    accent: '#ec4899',
    neutral: '#8c8690',
    radius: '1.8',
    density: 'comfortable',
    styleFamily: 'soft',
    heading: 'Poppins',
    body: 'Inter',
  },
]

/* ----------------------------------------------------------------------------
 * Re-roll pools — each curated so any random combination still looks good.
 * -------------------------------------------------------------------------- */

export const ROLL_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#635bff',
  '#5e6ad2',
]
export const ROLL_RADII = ['0.3', '0.5', '0.75', '1', '1.4', '1.8']
export const ROLL_DENSITIES: Density[] = ['compact', 'default', 'comfortable']
export const ROLL_FAMILIES: StyleFamily[] = [
  'flat',
  'soft',
  'elevated',
  'glass',
]
