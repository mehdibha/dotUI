/**
 * Color system v2 — contrast-first scale solver (first cut).
 *
 * Isolated from the shipping engine on purpose: nothing here is imported by
 * `createTheme` / the producers, and nothing here imports them. Contract:
 * `docs/research/2026-07-05-color-system-v2-spec.md`.
 */

import { solveScaleImpl } from './solve'

export const V2_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

export type V2Step = (typeof V2_STEPS)[number]

/** Solid step — the seed anchor and the step `-contrast` is computed for. */
export const SOLID_STEP: V2Step = '500'

export const DEFAULT_LIGHT_SURFACE = '#ffffff'
export const DEFAULT_DARK_SURFACE = '#111111'

/** Measured Tailwind v4 ladder vs white (spec §Scale contract). */
export const LIGHT_TARGETS: Record<V2Step, number> = {
  '50': 1.06,
  '100': 1.15,
  '200': 1.31,
  '300': 1.62,
  '400': 2.34,
  '500': 3.41,
  '600': 4.95,
  '700': 6.82,
  '800': 9.29,
  '900': 11.22,
  '950': 15.87,
}

/** Derived from Radix dark medians via the light-position transfer (spec §Scale contract). */
export const DARK_TARGETS: Record<V2Step, number> = {
  '50': 1.11,
  '100': 1.31,
  '200': 1.58,
  '300': 2.17,
  '400': 3.57,
  '500': 6.16,
  '600': 9.11,
  '700': 10.66,
  '800': 12.41,
  '900': 13.61,
  '950': 16.14,
}

export interface SolveScaleOptions {
  /** Seed color, any CSS color. Preserved at the solid step unless `preserveSeed: false`. */
  seed: string
  mode: 'light' | 'dark'
  /** Mode surface the contrast targets are solved against. */
  surface?: string
  /** WCAG 2.1 targets per step vs `surface`; defaults to the mode's measured ladder. */
  targets?: Record<V2Step, number>
  /** Neutral ramps: chroma clamped to a tint, no cusp peak. */
  neutral?: boolean
  preserveSeed?: boolean
}

export interface SolvedScale {
  steps: Record<V2Step, string>
  /** Computed foreground for the solid step, contrast-floored. */
  contrast: string
  /** WCAG 2.1 ratio actually achieved per step vs the surface. */
  achieved: Record<V2Step, number>
}

export { MAX_HUE_DRIFT } from './solve'

/**
 * Solve a full scale: contrast-solved lightness per step, cusp-aware chroma,
 * bounded hue drift, seed pinned at the solid step. See `./solve`.
 */
export function solveScale(options: SolveScaleOptions): SolvedScale {
  return solveScaleImpl(options)
}
