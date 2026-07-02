import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import type { Density, DesignSystem, useDesignSystem } from '../preset'

/* ----------------------------------------------------------------------------
 * Vibes + the AI engine that powers the Style front door and the docked
 * refine bar. A "vibe" sets the high-leverage, always-legible axes (accent /
 * radius / density) in one move so a prompt or a preset re-skins the whole
 * system live. UI-only: every change flows through the existing design-system
 * setters, so the real preview genuinely updates.
 * -------------------------------------------------------------------------- */

export interface Vibe {
  id: string
  label: string
  description: string
  accent: string
  /** Radius factor (0–2×), same unit as the Shape axis. */
  radius: string
  density: Density
}

const MINIMAL: Vibe = {
  id: 'minimal',
  label: 'Minimal',
  description: 'Tight, monochrome, restrained',
  accent: '#171717',
  radius: '0.4',
  density: 'compact',
}
const LINEAR: Vibe = {
  id: 'linear',
  label: 'Linear',
  description: 'Cool, crisp, product-grade',
  accent: '#5b5bd6',
  radius: '0.6',
  density: 'compact',
}
const CORPORATE: Vibe = {
  id: 'corporate',
  label: 'Corporate',
  description: 'Trustworthy SaaS blue',
  accent: '#2563eb',
  radius: '0.75',
  density: 'default',
}
const EDITORIAL: Vibe = {
  id: 'editorial',
  label: 'Editorial',
  description: 'Warm, calm, generous',
  accent: '#0f766e',
  radius: '0.3',
  density: 'comfortable',
}
const PLAYFUL: Vibe = {
  id: 'playful',
  label: 'Playful',
  description: 'Round, bright, friendly',
  accent: '#f43f5e',
  radius: '1.7',
  density: 'comfortable',
}
const VIVID: Vibe = {
  id: 'vivid',
  label: 'Vivid',
  description: 'Saturated and bold',
  accent: '#7c3aed',
  radius: '1',
  density: 'default',
}

export const VIBES: Vibe[] = [
  MINIMAL,
  LINEAR,
  CORPORATE,
  EDITORIAL,
  PLAYFUL,
  VIVID,
]

type SetDesignSystem = ReturnType<typeof useDesignSystem>['setDesignSystem']

/** Apply a vibe's accent / radius / density in one update (a single undo step). */
export function applyVibe(setDesignSystem: SetDesignSystem, vibe: Vibe) {
  setDesignSystem((prev: DesignSystem) => {
    const base = prev.color ?? DEFAULT_COLOR_CONFIG
    return {
      ...prev,
      density: vibe.density,
      tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: vibe.radius },
      color: { ...base, seeds: { ...base.seeds, accent: vibe.accent } },
    }
  })
}

const SHUFFLE_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
]
const SHUFFLE_RADII = ['0', '0.5', '1', '1.5', '2']
const SHUFFLE_DENSITIES: Density[] = ['compact', 'default', 'comfortable']

function pickRandom<T>(arr: readonly T[], fallback: T): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? fallback
}

/** Roll a fresh accent / radius / density combination as a single undo step. */
export function shuffleSystem(setDesignSystem: SetDesignSystem) {
  const accent = pickRandom(SHUFFLE_ACCENTS, '#6366f1')
  const radius = pickRandom(SHUFFLE_RADII, '1')
  const density = pickRandom(SHUFFLE_DENSITIES, 'default')
  setDesignSystem((prev: DesignSystem) => {
    const base = prev.color ?? DEFAULT_COLOR_CONFIG
    return {
      ...prev,
      density,
      tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
      color: { ...base, seeds: { ...base.seeds, accent } },
    }
  })
}

/** Map a free-text brief to the closest vibe (the prompt-to-system shortcut). */
export function vibeFromPrompt(text: string): Vibe {
  const t = text.toLowerCase()
  if (/warm|editor|fintech|serif|magazine|calm|wellness|spa/.test(t))
    return EDITORIAL
  if (/minimal|mono|stark|restrained|premium|luxur|elegant/.test(t))
    return MINIMAL
  if (/play|round|fun|bright|friendly|consumer|cute/.test(t)) return PLAYFUL
  if (/vivid|bold|saturat|vibrant|energetic/.test(t)) return VIVID
  if (/corp|dash|saas|enterprise|business|trust|finance/.test(t))
    return CORPORATE
  return LINEAR
}

/**
 * Apply a natural-language refinement as a delta on the current system, and
 * return a short confirmation line for the chat log.
 */
export function applyDelta(
  ds: ReturnType<typeof useDesignSystem>,
  input: string,
): string {
  const t = input.toLowerCase()
  const { setDesignSystem, setDensity, setToken, setColorAlgorithm } = ds
  const radius =
    Number.parseFloat(ds.designSystem.tokens[RADIUS_FACTOR_VAR] ?? '') ||
    Number.parseFloat(DEFAULT_RADIUS_FACTOR)

  if (/contrast|legib|accessib|wcag|aa/.test(t)) {
    setColorAlgorithm('contrast')
    return 'Switched to contrast-locked color generation.'
  }
  if (/tight|dens|compact|cramp/.test(t)) {
    setDensity('compact')
    return 'Tightened density to compact.'
  }
  if (/spac|roomy|comfortable|breath|airy/.test(t)) {
    setDensity('comfortable')
    return 'Opened up spacing to comfortable.'
  }
  if (/playful|fun|cheer/.test(t)) {
    applyVibe(setDesignSystem, PLAYFUL)
    return 'Made it more playful.'
  }
  if (/premium|minimal|elegant|lux|refined/.test(t)) {
    applyVibe(setDesignSystem, MINIMAL)
    return 'Refined toward a minimal, premium look.'
  }
  if (/surprise|random|shuffle|roll/.test(t)) {
    shuffleSystem(setDesignSystem)
    return 'Rolled a fresh combination.'
  }
  if (/sharp|less round|squar/.test(t)) {
    const r = Math.max(0, radius - 0.3)
    setToken(RADIUS_FACTOR_VAR, r.toFixed(2))
    return `Sharpened corners to ${r.toFixed(2)}×.`
  }
  if (/soft|round|corner/.test(t)) {
    const r = Math.min(2, radius + 0.3)
    setToken(RADIUS_FACTOR_VAR, r.toFixed(2))
    return `Softened corners to ${r.toFixed(2)}×.`
  }
  const vibe = vibeFromPrompt(t)
  applyVibe(setDesignSystem, vibe)
  return `Applied a ${vibe.label.toLowerCase()} direction.`
}
