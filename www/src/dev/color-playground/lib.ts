import { onBlackWhite, toOklch, wcag2 } from '@dotui/colors'
import {
  DARK_TARGETS,
  DEFAULT_DARK_SURFACE,
  LIGHT_TARGETS,
  V2_STEPS,
  type V2Step,
} from '@dotui/colors/v2'

import type { ReferenceScale, ReferenceSource } from './data'

export type Mode = 'light' | 'dark'

/** Page surface each mode's contrast is measured against. */
export const LIGHT_SURFACE = '#ffffff'
export const DARK_SURFACE = DEFAULT_DARK_SURFACE

export function surfaceFor(mode: Mode): string {
  return mode === 'light' ? LIGHT_SURFACE : DARK_SURFACE
}

export function targetsFor(mode: Mode): Record<V2Step, number> {
  return mode === 'light' ? LIGHT_TARGETS : DARK_TARGETS
}

/** OKLab coords (a/b from chroma·hue) for perceptual distance. */
function oklab(color: string): { L: number; a: number; b: number } {
  const { l, c, h } = toOklch(color)
  const rad = (h * Math.PI) / 180
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) }
}

/** Euclidean ΔE in OKLab. */
export function deltaE(a: string, b: string): number {
  const x = oklab(a)
  const y = oklab(b)
  return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b)
}

/** Interpolate two OKLab points and return an OKLCH color string. */
function mixOklab(
  a: string,
  b: string,
  t: number,
): { L: number; a: number; b: number } {
  const x = oklab(a)
  const y = oklab(b)
  return {
    L: x.L + (y.L - x.L) * t,
    a: x.a + (y.a - x.a) * t,
    b: x.b + (y.b - x.b) * t,
  }
}

function oklabToCss(p: { L: number; a: number; b: number }): string {
  const c = Math.hypot(p.a, p.b)
  const h = (Math.atan2(p.b, p.a) * 180) / Math.PI
  return `oklch(${p.L} ${c} ${(h + 360) % 360})`
}

/** Ordered CSS colors of a reference scale, in the source's own step order. */
export function scaleColors(
  scale: ReferenceScale,
  source: ReferenceSource,
): string[] {
  const out: string[] = []
  for (const label of source.stepLabels) {
    const color = scale.steps[label]
    if (color) out.push(color)
  }
  return out
}

/** The step a source treats as its solid/mid anchor (radix 9, tailwind 500, else middle). */
export function solidIndex(source: ReferenceSource): number {
  const idx = source.stepLabels.indexOf(source.id === 'radix' ? '9' : '500')
  if (idx >= 0) return idx
  return Math.floor((source.stepLabels.length - 1) / 2)
}

/** Nearest scale in a source to the seed, by ΔE at the source's solid step. */
export function nearestScale(
  source: ReferenceSource,
  mode: Mode,
  seed: string,
): ReferenceScale | null {
  const scales = mode === 'light' ? source.light : source.dark
  if (scales.length === 0) return null
  const anchorLabel = source.stepLabels[solidIndex(source)]
  if (!anchorLabel) return null
  let best: ReferenceScale | null = null
  let bestD = Infinity
  for (const scale of scales) {
    const anchor = scale.steps[anchorLabel]
    if (!anchor) continue
    const d = deltaE(seed, anchor)
    if (d < bestD) {
      bestD = d
      best = scale
    }
  }
  return best
}

/**
 * Resample an ordered color list to `V2_STEPS` (11) by fractional position,
 * interpolating in OKLab. Lets 12-step Radix / 10-step Geist map onto our ladder.
 */
export function toElevenSteps(colors: string[]): Record<V2Step, string> {
  const out = {} as Record<V2Step, string>
  const n = colors.length
  if (n === 0) return out
  const at = (idx: number): string =>
    colors[Math.min(Math.max(idx, 0), n - 1)] ?? colors[0] ?? ''
  V2_STEPS.forEach((step, i) => {
    const pos = (i / (V2_STEPS.length - 1)) * (n - 1)
    const lo = at(Math.floor(pos))
    const hi = at(Math.ceil(pos))
    out[step] =
      lo === hi ? lo : oklabToCss(mixOklab(lo, hi, pos - Math.floor(pos)))
  })
  return out
}

/** Mean + max ΔE of a v2 ramp against a reference ramp, aligned by fractional position. */
export function rampDeltaE(
  v2: Record<V2Step, string>,
  reference: string[],
): { mean: number; max: number } {
  const aligned = toElevenSteps(reference)
  let sum = 0
  let max = 0
  let count = 0
  for (const step of V2_STEPS) {
    const ref = aligned[step]
    if (!ref) continue
    const d = deltaE(v2[step], ref)
    sum += d
    max = Math.max(max, d)
    count++
  }
  return { mean: count ? sum / count : 0, max }
}

/**
 * Ladders run light→dark in light mode and dark→light in dark (the v2
 * convention); Primer numbers its dark scales light-first, so reverse
 * anti-oriented references (labels travel with their colors).
 */
export function orientToMode(
  colors: string[],
  labels: string[],
  mode: Mode,
): { colors: string[]; labels: string[] } {
  const first = colors[0]
  const last = colors[colors.length - 1]
  if (!first || !last) return { colors, labels }
  const descending = lightnessOf(first) > lightnessOf(last)
  if (descending === (mode === 'light')) return { colors, labels }
  return { colors: [...colors].reverse(), labels: [...labels].reverse() }
}

/** First step index whose contrast vs surface meets `threshold`. */
export function firstStepMeeting(
  colors: string[],
  surface: string,
  threshold: number,
): number {
  return colors.findIndex((c) => wcag2(c, surface) >= threshold)
}

export function contrast(color: string, surface: string): number {
  return wcag2(color, surface)
}

export function lightnessOf(color: string): number {
  return toOklch(color).l
}

/** Contrast-adequate black/white foreground for a swatch. */
export function readableFg(color: string): string {
  return onBlackWhite(color)
}
