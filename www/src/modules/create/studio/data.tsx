import {
  BarChart3Icon,
  GaugeIcon,
  LayersIcon,
  type LucideIcon,
  MousePointer2Icon,
  PaletteIcon,
  Rows3Icon,
  ShapesIcon,
  SparkleIcon,
  TypeIcon,
} from 'lucide-react'

import type { AlgorithmId } from '@/registry/theme'

import type { Density } from '../preset'

/* ------------------------------------------------------------------ *
 * Studio data registry
 *
 * Static, import-free description of every axis the builder exposes.
 * Screens read from here so the home list, the command palette, and the
 * drill-in editors all agree on titles, icons, and which tier an axis
 * belongs to. Logic-free by design — this is the map, not the territory.
 * ------------------------------------------------------------------ */

export type FoundationTier = 'core' | 'pro'

export interface Foundation {
  id: string
  title: string
  /** One-line promise shown under the title in the command palette. */
  blurb: string
  icon: LucideIcon
  tier: FoundationTier
}

/** Axes that ship a live editor. `core` shows in Quick mode; `pro` is opt-in. */
export const FOUNDATIONS: readonly Foundation[] = [
  {
    id: 'color',
    title: 'Color',
    blurb: 'One seed to a full, accessible system',
    icon: PaletteIcon,
    tier: 'core',
  },
  {
    id: 'typography',
    title: 'Typography',
    blurb: 'Pairing, scale, weight and rhythm',
    icon: TypeIcon,
    tier: 'core',
  },
  {
    id: 'shape',
    title: 'Shape & radius',
    blurb: 'From razor-sharp to fully rounded',
    icon: ShapesIcon,
    tier: 'core',
  },
  {
    id: 'density',
    title: 'Spacing & density',
    blurb: 'How tight or roomy the system breathes',
    icon: Rows3Icon,
    tier: 'core',
  },
  {
    id: 'elevation',
    title: 'Elevation',
    blurb: 'Shadow language and surface depth',
    icon: LayersIcon,
    tier: 'pro',
  },
  {
    id: 'motion',
    title: 'Motion',
    blurb: 'Timing, easing and interaction feel',
    icon: GaugeIcon,
    tier: 'pro',
  },
  {
    id: 'icons',
    title: 'Iconography',
    blurb: 'Icon library, weight and size',
    icon: SparkleIcon,
    tier: 'pro',
  },
  {
    id: 'cursor',
    title: 'Cursors',
    blurb: 'Interactive and disabled pointers',
    icon: MousePointer2Icon,
    tier: 'pro',
  },
  {
    id: 'charts',
    title: 'Data & charts',
    blurb: 'Categorical palette for visualizations',
    icon: BarChart3Icon,
    tier: 'pro',
  },
] as const

export const FOUNDATION_IDS = new Set(FOUNDATIONS.map((f) => f.id))

export function getFoundation(id: string): Foundation | undefined {
  return FOUNDATIONS.find((f) => f.id === id)
}

/* ------------------------------- Vibes ------------------------------- */

/**
 * Curated one-tap starting points. Each is a complete personality — accent,
 * shape, density and generation algorithm — so a first-time visitor lands on
 * something beautiful before touching a single control.
 */
export interface Vibe {
  id: string
  name: string
  description: string
  accent: string
  neutral: string
  radius: string
  density: Density
  algorithm: AlgorithmId
  /** Two stops that paint the chip's gradient preview. */
  swatch: [string, string]
}

export const VIBES: readonly Vibe[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Neutral, quiet, sharp',
    accent: '#171717',
    neutral: '#7d7d7d',
    radius: '0.5',
    density: 'default',
    algorithm: 'oklch',
    swatch: ['#fafafa', '#171717'],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Warm paper, ink accents',
    accent: '#1c4ed8',
    neutral: '#8a8377',
    radius: '0.25',
    density: 'comfortable',
    algorithm: 'oklch',
    swatch: ['#f5f1e8', '#1c3a5e'],
  },
  {
    id: 'vivid',
    name: 'Vivid',
    description: 'Saturated, confident, bold',
    accent: '#7c3aed',
    neutral: '#7b7488',
    radius: '1',
    density: 'default',
    algorithm: 'tailwind',
    swatch: ['#a855f7', '#4c1d95'],
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Soft, rounded, friendly',
    accent: '#ec4899',
    neutral: '#857d82',
    radius: '1.6',
    density: 'comfortable',
    algorithm: 'tailwind',
    swatch: ['#fb923c', '#ec4899'],
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Cool, dense, precise',
    accent: '#0891b2',
    neutral: '#6f7780',
    radius: '0.35',
    density: 'compact',
    algorithm: 'contrast',
    swatch: ['#22d3ee', '#0e7490'],
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy greens, calm',
    accent: '#15803d',
    neutral: '#74786f',
    radius: '0.85',
    density: 'default',
    algorithm: 'oklch',
    swatch: ['#bbf7d0', '#166534'],
  },
] as const

/* ------------------------------ Reroll ------------------------------ */

/** Always-legible accents for the dice button — every pick still looks good. */
export const REROLL_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
  '#f43f5e',
  '#ef4444',
  '#f59e0b',
  '#16a34a',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
]
export const REROLL_RADII = ['0', '0.35', '0.5', '0.85', '1', '1.5', '2']
export const REROLL_DENSITIES: readonly Density[] = [
  'compact',
  'default',
  'comfortable',
]

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/* ------------------------------ Strings ------------------------------ */

export function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
