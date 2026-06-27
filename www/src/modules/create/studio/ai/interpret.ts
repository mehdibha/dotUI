import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { ColorConfig } from '@/registry/theme'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../../layout'
import { DEFAULTS } from '../../preset'
import type { Density, DesignSystem } from '../../preset'
import {
  DEFAULT_MODE_VAR,
  STYLE_FAMILY_VAR,
  VIBES,
  type Vibe,
  vibeToMutate,
} from './vibes'

/* ----------------------------------------------------------------------------
 * Intent matching — a deliberately small, legible NL layer.
 *
 * It maps a prompt / chat message to a DesignSystem updater plus a human
 * summary of what changed. It's keyword-driven on purpose: a real deployment
 * swaps this for a model call returning the same {mutate, changes} shape, and
 * none of the UI has to change.
 * -------------------------------------------------------------------------- */

export type Mutate = (prev: DesignSystem) => DesignSystem

export interface AiResult {
  mutate: Mutate
  /** Short title for the result card / assistant line. */
  title: string
  /** Bulleted, human-readable list of what changed. */
  changes: string[]
  /** The vibe this resolved to, if any (for chip highlighting). */
  vibeId?: string
}

const COLOR_WORDS: Record<string, string> = {
  black: '#171717',
  white: '#fafafa',
  slate: '#475569',
  gray: '#6b7280',
  grey: '#6b7280',
  red: '#ef4444',
  crimson: '#dc2626',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  gold: '#ca8a04',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
}

const ALGO_LABELS: Record<string, string> = {
  oklch: 'OKLCH Perceptual',
  tailwind: 'Tailwind-style',
  material: 'Material',
  contrast: 'Contrast-locked',
}

function radiusOf(ds: DesignSystem): number {
  return (
    Number.parseFloat(ds.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR) ||
    1
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function withColor(
  ds: DesignSystem,
  patch: Partial<ColorConfig['seeds']>,
): ColorConfig {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return { ...base, seeds: { ...base.seeds, ...patch } }
}

/** Find the best-matching vibe for free text, or null if nothing scores. */
export function matchVibe(text: string): Vibe | null {
  const t = text.toLowerCase()
  let best: Vibe | null = null
  let bestScore = 0
  for (const vibe of VIBES) {
    let score = 0
    for (const tag of vibe.tags) {
      if (t.includes(tag)) score += tag.length > 4 ? 2 : 1
    }
    if (score > bestScore) {
      bestScore = score
      best = vibe
    }
  }
  return bestScore > 0 ? best : null
}

function extractColor(text: string): { word: string; hex: string } | null {
  const t = text.toLowerCase()
  for (const [word, hex] of Object.entries(COLOR_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(t)) return { word, hex }
  }
  const hexMatch = t.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/)
  if (hexMatch) return { word: hexMatch[0], hex: hexMatch[0] }
  return null
}

/* ------------------------------ Generate -------------------------------- */

/** Interpret a from-scratch "describe your design system" prompt. */
export function interpretPrompt(text: string): AiResult {
  const vibe = matchVibe(text)
  const color = extractColor(text)

  if (vibe) {
    const base = vibeToMutate(vibe)
    const changes = [
      `Accent → ${color?.hex ?? vibe.accent}`,
      `Neutrals → ${vibe.neutral}`,
      `Radius → ${Number.parseFloat(vibe.radius).toFixed(1)}×`,
      `Density → ${vibe.density}`,
      `Ramps → ${ALGO_LABELS[vibe.algorithm]}`,
    ]
    const mutate: Mutate = color
      ? (prev) => {
          const next = base(prev)
          return { ...next, color: withColor(next, { accent: color.hex }) }
        }
      : base
    return {
      mutate,
      title: `${vibe.label} — ${vibe.summary}`,
      changes,
      vibeId: vibe.id,
    }
  }

  // No vibe matched — at least honor an explicit color, else a sensible default.
  if (color) {
    return {
      mutate: (prev) => ({
        ...prev,
        color: withColor(prev, { accent: color.hex }),
      }),
      title: `A ${color.word} system`,
      changes: [`Accent → ${color.hex}`],
    }
  }

  const fallback = VIBES[0] as Vibe
  return {
    mutate: vibeToMutate(fallback),
    title: `${fallback.label} — a clean starting point`,
    changes: [`Accent → ${fallback.accent}`, `Radius → ${fallback.radius}×`],
  }
}

/* ------------------------------- Copilot -------------------------------- */

/** Interpret a conversational tweak against the current system. */
export function interpretChat(text: string, ds: DesignSystem): AiResult | null {
  const t = text.toLowerCase()

  // Whole-direction switches win first (they re-skin everything).
  const vibe = matchVibe(t)
  if (vibe && /(make it|like|feel|vibe|theme|more)/.test(t)) {
    return interpretPrompt(text)
  }

  if (/\b(reset|default|start over|clear)\b/.test(t)) {
    return {
      mutate: () => DEFAULTS,
      title: 'Reset to defaults',
      changes: ['Everything → defaults'],
    }
  }

  // Radius
  if (/\b(round|rounder|softer corners|more rounded|pill)\b/.test(t)) {
    const next = clamp(radiusOf(ds) + 0.5, 0, 2)
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [RADIUS_FACTOR_VAR]: String(next) },
      }),
      title: 'Rounded the corners',
      changes: [`Radius → ${next.toFixed(1)}×`],
    }
  }
  if (/\b(sharp|sharper|square|less round|crisp corners|boxy)\b/.test(t)) {
    const next = clamp(radiusOf(ds) - 0.5, 0, 2)
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [RADIUS_FACTOR_VAR]: String(next) },
      }),
      title: 'Sharpened the corners',
      changes: [`Radius → ${next.toFixed(1)}×`],
    }
  }

  // Density
  if (/\b(dense|denser|tighter|compact|tight)\b/.test(t)) {
    return {
      mutate: (p) => ({ ...p, density: 'compact' as Density }),
      title: 'Tightened spacing',
      changes: ['Density → compact'],
    }
  }
  if (
    /\b(air|airy|airier|roomier|spacious|breathing|comfortable|cozy|relax)\b/.test(
      t,
    )
  ) {
    return {
      mutate: (p) => ({ ...p, density: 'comfortable' as Density }),
      title: 'Opened up the spacing',
      changes: ['Density → comfortable'],
    }
  }

  // Chroma / energy
  if (
    /\b(bolder|punchier|vivid|saturated|pop|vibrant|energetic|louder)\b/.test(t)
  ) {
    const base = ds.color ?? DEFAULT_COLOR_CONFIG
    const next = clamp((base.knobs?.chromaMult ?? 1) + 0.3, 0, 2)
    return {
      mutate: (p) => {
        const c = p.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...p,
          color: { ...c, knobs: { ...c.knobs, chromaMult: next } },
        }
      },
      title: 'Turned up the saturation',
      changes: [`Chroma → ${next.toFixed(1)}×`],
    }
  }
  if (
    /\b(calmer|calm|muted|subtle|desaturate|softer|quieter|gentle|tone down)\b/.test(
      t,
    )
  ) {
    const base = ds.color ?? DEFAULT_COLOR_CONFIG
    const next = clamp((base.knobs?.chromaMult ?? 1) - 0.3, 0, 2)
    return {
      mutate: (p) => {
        const c = p.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...p,
          color: { ...c, knobs: { ...c.knobs, chromaMult: next } },
        }
      },
      title: 'Calmed the palette',
      changes: [`Chroma → ${next.toFixed(1)}×`],
    }
  }

  // Mode
  if (/\b(dark mode|darker|dark theme|go dark|night)\b/.test(t)) {
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [DEFAULT_MODE_VAR]: 'dark' },
      }),
      title: 'Defaulted to dark',
      changes: ['Default mode → dark'],
    }
  }
  if (/\b(light mode|lighter|light theme|go light)\b/.test(t)) {
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [DEFAULT_MODE_VAR]: 'light' },
      }),
      title: 'Defaulted to light',
      changes: ['Default mode → light'],
    }
  }

  // Accessibility / contrast
  if (
    /\b(contrast|accessible|accessibility|a11y|wcag|legible|readable)\b/.test(t)
  ) {
    return {
      mutate: (p) => {
        const c = p.color ?? DEFAULT_COLOR_CONFIG
        return { ...p, color: { ...c, algorithm: 'contrast' } }
      },
      title: 'Switched to contrast-locked ramps',
      changes: ['Ramps → Contrast-locked'],
    }
  }

  // Style family
  if (/\b(glass|frosted|frost|translucent|blur)\b/.test(t)) {
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [STYLE_FAMILY_VAR]: 'glass' },
      }),
      title: 'Made surfaces glassy',
      changes: ['Style family → glass'],
    }
  }
  if (/\b(flat|flatten|no shadow)\b/.test(t)) {
    return {
      mutate: (p) => ({
        ...p,
        tokens: { ...p.tokens, [STYLE_FAMILY_VAR]: 'flat' },
      }),
      title: 'Flattened the surfaces',
      changes: ['Style family → flat'],
    }
  }

  // Explicit color
  const color = extractColor(t)
  if (color) {
    return {
      mutate: (p) => ({ ...p, color: withColor(p, { accent: color.hex }) }),
      title: `Set the accent to ${color.word}`,
      changes: [`Accent → ${color.hex}`],
    }
  }

  // Catch-all vibe match (without the trigger words above)
  if (vibe) return interpretPrompt(text)

  return null
}

export const COPILOT_SUGGESTIONS = [
  'Make it feel like Linear',
  'Rounder corners',
  'Calmer accent',
  'Increase contrast',
  'A warm editorial blog',
  'Go dark',
]
