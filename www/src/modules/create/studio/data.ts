import {
  BoxSelectIcon,
  BracesIcon,
  type LucideIcon,
  LayersIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import type { AlgorithmId } from '@/registry/theme'
import type { Density } from '@/modules/create/preset'

import type { SectionId } from './context'

/* ----------------------------------------------------------------------------
 * Stub token vars
 *
 * Axes a world-class builder needs that the dotUI preview has no consumer for
 * yet. They still write a real CSS var through the same `setToken` channel, so
 * each one goes live the moment a component reads it — and until then the UI is
 * honest about it via a hollow status dot. Names are namespaced `--ds-*` so they
 * never collide with the live theme tokens.
 * -------------------------------------------------------------------------- */

export const STUB = {
  fontHeading: '--ds-font-heading',
  fontBody: '--ds-font-body',
  typeScale: '--ds-type-scale',
  typeBase: '--ds-type-base',
  letterSpacing: '--ds-letter-spacing',
  iconStroke: '--ds-icon-stroke',
  borderWidth: '--ds-border-width',
  spacingScale: '--ds-spacing-scale',
  styleFamily: '--ds-style-family',
  shadowIntensity: '--ds-shadow-intensity',
  backdropBlur: '--ds-backdrop-blur',
  motionDuration: '--ds-motion-duration',
  motionEasing: '--ds-motion-easing',
  motionEnabled: '--ds-motion-enabled',
  focusRingWidth: '--ds-focus-ring-width',
  defaultMode: '--ds-default-mode',
  paletteFoundations: '--ds-palette-foundations',
} as const

/* ------------------------------- Sections ------------------------------- */

export interface SectionMeta {
  id: SectionId
  label: string
  /** A terse subtitle shown under the section title. */
  blurb: string
  icon: LucideIcon
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'brand',
    label: 'Brand',
    blurb: 'Seed a complete system from your brand — in seconds.',
    icon: SparklesIcon,
  },
  {
    id: 'color',
    label: 'Color',
    blurb: 'One seed to a full system, or control every ramp.',
    icon: PaletteIcon,
  },
  {
    id: 'typography',
    label: 'Typography',
    blurb: 'Type families, scale and rhythm.',
    icon: TypeIcon,
  },
  {
    id: 'icons',
    label: 'Icons',
    blurb: 'Icon set and stroke weight.',
    icon: SmileIcon,
  },
  {
    id: 'shape',
    label: 'Shape',
    blurb: 'Corner radius and border weight.',
    icon: ShapesIcon,
  },
  {
    id: 'density',
    label: 'Density',
    blurb: 'How tight or roomy everything sits.',
    icon: RulerIcon,
  },
  {
    id: 'surface',
    label: 'Surface',
    blurb: 'Elevation, shadow and glass.',
    icon: LayersIcon,
  },
  {
    id: 'motion',
    label: 'Motion',
    blurb: 'Speed, easing and cursor feel.',
    icon: ZapIcon,
  },
  {
    id: 'components',
    label: 'Components',
    blurb: 'Tweak any component, one at a time.',
    icon: BoxSelectIcon,
  },
  {
    id: 'code',
    label: 'Code',
    blurb: 'Shape the exported code and pick where it lands.',
    icon: BracesIcon,
  },
]

export const INTERACTION_ICON = MousePointer2Icon

/* -------------------------------- Presets ------------------------------- */

/**
 * A starter is a one-tap, complete-looking brand. Each one sets the punchy,
 * always-legible axes (accent / base / algorithm / radius / density) so a fast
 * user lands on something polished before touching a single knob.
 */
export interface Starter {
  id: string
  name: string
  accent: string
  neutral: string
  algorithm: AlgorithmId
  radius: string
  density: Density
}

export const STARTERS: Starter[] = [
  {
    id: 'default',
    name: 'dotUI',
    accent: '#438cd6',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: '1',
    density: 'compact',
  },
  {
    id: 'linear',
    name: 'Indigo',
    accent: '#6366f1',
    neutral: '#7c7d86',
    algorithm: 'oklch',
    radius: '1',
    density: 'compact',
  },
  {
    id: 'vercel',
    name: 'Mono',
    accent: '#171717',
    neutral: '#808080',
    algorithm: 'contrast',
    radius: '0.5',
    density: 'compact',
  },
  {
    id: 'stripe',
    name: 'Violet',
    accent: '#635bff',
    neutral: '#7d7d8a',
    algorithm: 'oklch',
    radius: '1.5',
    density: 'default',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    accent: '#10b981',
    neutral: '#7b8079',
    algorithm: 'tailwind',
    radius: '1',
    density: 'default',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    accent: '#f97316',
    neutral: '#80766f',
    algorithm: 'tailwind',
    radius: '2',
    density: 'comfortable',
  },
  {
    id: 'material',
    name: 'Material',
    accent: '#6750a4',
    neutral: '#79747e',
    algorithm: 'material',
    radius: '2',
    density: 'comfortable',
  },
  {
    id: 'rose',
    name: 'Rose',
    accent: '#e11d48',
    neutral: '#827074',
    algorithm: 'oklch',
    radius: '1',
    density: 'compact',
  },
]

/**
 * A vibe presets *multiple* axes at once toward a recognizable design language —
 * the macro layer above individual seeds. Radius + density + algorithm are the
 * live levers; the rest read as "the feel" a fast user is choosing.
 */
export interface Vibe {
  id: string
  name: string
  hint: string
  radius: string
  density: Density
  algorithm: AlgorithmId
}

export const VIBES: Vibe[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    hint: 'Crisp, low radius, tight',
    radius: '0.5',
    density: 'compact',
    algorithm: 'oklch',
  },
  {
    id: 'soft',
    name: 'Soft',
    hint: 'Rounded, airy, friendly',
    radius: '2',
    density: 'comfortable',
    algorithm: 'oklch',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    hint: 'Measured, accessible',
    radius: '1',
    density: 'default',
    algorithm: 'contrast',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    hint: 'Square, dense, bold',
    radius: '0',
    density: 'compact',
    algorithm: 'tailwind',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    hint: 'Generous, considered',
    radius: '1',
    density: 'comfortable',
    algorithm: 'oklch',
  },
  {
    id: 'playful',
    name: 'Playful',
    hint: 'Round, lively, vivid',
    radius: '2',
    density: 'default',
    algorithm: 'tailwind',
  },
]

/* ------------------------------- Shuffle -------------------------------- */

// "Surprise me" pools — curated so any random pick still looks intentional.
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

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}
