import type { Density } from '../preset'

/* ----------------------------------------------------------------------------
 * Studio data — the option sets and presets the redesigned panel draws from.
 *
 * Token vars split into two camps:
 *   LIVE   — already consumed by the preview (radius factor, cursors, charts…).
 *   STUB   — invented CSS vars the preview has no consumer for *yet*. They write
 *            through the exact same token channel, so the moment a component
 *            reads one it becomes live with zero rewiring. This mirrors the
 *            honest binding model the panel lab established.
 * -------------------------------------------------------------------------- */

/* live (owned elsewhere, re-declared here for the studio's convenience) */
export const RADIUS_FACTOR_VAR = '--radius-factor'
export const DEFAULT_RADIUS_FACTOR = '1'

/* stub design-intent vars */
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const TYPE_WEIGHT_VAR = '--ds-type-weight'
export const TRACKING_VAR = '--ds-tracking'

export const BORDER_WIDTH_VAR = '--ds-border-width'
export const STYLE_FAMILY_VAR = '--ds-style-family'
export const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
export const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'

export const MOTION_DURATION_VAR = '--ds-motion-duration'
export const MOTION_EASING_VAR = '--ds-motion-easing'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'
export const HOVER_LIFT_VAR = '--ds-hover-lift'

export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'

export const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'
export const SPACING_SCALE_VAR = '--ds-spacing-scale'

export const DEFAULT_MODE_VAR = '--ds-default-mode'
export const GRAY_STRATEGY_VAR = '--ds-gray-strategy'
export const EXPOSE_PALETTES_VAR = '--ds-expose-palettes'

/* ------------------------------- Vibes ---------------------------------- */

/**
 * Whole-system re-skins. Each is a coherent point in the design space the
 * generator can reach from a single tap — the hobbyist's "make it look good"
 * front door. Every field maps to a real (or stub) token so applying one is a
 * genuine state change, not a thumbnail.
 */
export interface Vibe {
  id: string
  label: string
  accent: string
  neutral: string
  radius: string
  density: Density
  style: string
  heading: string
  body: string
}

export const VIBES: Vibe[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    accent: '#171717',
    neutral: '#808080',
    radius: '0.4',
    density: 'compact',
    style: 'flat',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    accent: '#2563eb',
    neutral: '#7c8694',
    radius: '0.6',
    density: 'default',
    style: 'soft',
    heading: 'Inter',
    body: 'Inter',
  },
  {
    id: 'playful',
    label: 'Playful',
    accent: '#f43f5e',
    neutral: '#8a7f86',
    radius: '1.6',
    density: 'comfortable',
    style: 'soft',
    heading: 'Poppins',
    body: 'Inter',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    accent: '#0f766e',
    neutral: '#7d8079',
    radius: '0.25',
    density: 'comfortable',
    style: 'flat',
    heading: 'Playfair Display',
    body: 'Source Serif 4',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    accent: '#7c3aed',
    neutral: '#827e8c',
    radius: '1',
    density: 'default',
    style: 'depth',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'glass',
    label: 'Aurora',
    accent: '#06b6d4',
    neutral: '#788289',
    radius: '1.2',
    density: 'default',
    style: 'glass',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    accent: '#eab308',
    neutral: '#808080',
    radius: '0',
    density: 'compact',
    style: 'flat',
    heading: 'Space Grotesk',
    body: 'IBM Plex Sans',
  },
  {
    id: 'warm',
    label: 'Warm',
    accent: '#ea580c',
    neutral: '#8c8178',
    radius: '0.9',
    density: 'comfortable',
    style: 'soft',
    heading: 'Geist',
    body: 'Geist',
  },
]

/* ------------------------------ Re-roll pools --------------------------- */

export const SHUFFLE_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#ef4444',
]
export const SHUFFLE_RADII = ['0', '0.5', '1', '1.5', '2']
export const SHUFFLE_DENSITIES: Density[] = [
  'compact',
  'default',
  'comfortable',
]

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/* ----------------------------- Style families --------------------------- */

export const STYLE_FAMILIES: ReadonlyArray<{
  value: string
  label: string
  hint: string
}> = [
  { value: 'flat', label: 'Flat', hint: 'No shadows, crisp borders' },
  { value: 'soft', label: 'Soft', hint: 'Gentle shadows, the default' },
  { value: 'depth', label: '3D', hint: 'Layered, pronounced depth' },
  { value: 'glass', label: 'Glass', hint: 'Translucent, frosted surfaces' },
]

export const EASINGS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'standard', label: 'Standard' },
  { value: 'emphasized', label: 'Emphasized' },
  { value: 'spring', label: 'Spring' },
  { value: 'linear', label: 'Linear' },
]
