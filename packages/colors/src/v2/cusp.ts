/**
 * Cusp-aware chroma envelope.
 *
 * For a hue, the sRGB gamut has a cusp — the lightness at which maximum chroma
 * is available (yellow ≈ L 0.9, blue ≈ L 0.45). The chroma envelope peaks at
 * that cusp lightness and tapers toward both ends of the ramp, so every hue gets
 * its own chroma shape instead of a fixed mid-scale sine (a rejected design).
 */

import Color from 'colorjs.io'

export interface Cusp {
  l: number
  c: number
}

/** Highest in-gamut sRGB chroma for `(l, h)` (bisection on chroma). */
export function maxChroma(l: number, h: number): number {
  let lo = 0
  let hi = 0.5
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (new Color('oklch', [l, mid, h]).inGamut('srgb', { epsilon: 0 }))
      lo = mid
    else hi = mid
  }
  return lo
}

const cuspCache = new Map<number, Cusp>()

/** Lightness of maximum chroma for a hue (golden-section search over `maxChroma(l)`). */
export function findCusp(h: number): Cusp {
  const key = Math.round(h * 100) / 100
  const cached = cuspCache.get(key)
  if (cached) return cached
  const gr = (Math.sqrt(5) - 1) / 2
  let a = 0
  let b = 1
  let c = b - gr * (b - a)
  let d = a + gr * (b - a)
  let fc = maxChroma(c, h)
  let fd = maxChroma(d, h)
  for (let i = 0; i < 30; i++) {
    if (fc > fd) {
      b = d
      d = c
      fd = fc
      c = b - gr * (b - a)
      fc = maxChroma(c, h)
    } else {
      a = c
      c = d
      fc = fd
      d = a + gr * (b - a)
      fd = maxChroma(d, h)
    }
  }
  const l = (a + b) / 2
  const cusp = { l, c: maxChroma(l, h) }
  cuspCache.set(key, cusp)
  return cusp
}

/** Envelope chroma at lightness `l`: peaks `cusp.c * scale` at `cusp.l`, tapers to 0 at both ends. */
export function envelopeChroma(l: number, cusp: Cusp, scale: number): number {
  const t = l <= cusp.l ? l / cusp.l : (1 - l) / (1 - cusp.l)
  return cusp.c * scale * Math.max(0, t) ** 0.9
}
