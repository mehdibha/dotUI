/**
 * Chart palettes (D11): generated from the theme's seeds, never aliased.
 * Categorical is hue-spread + L*-staggered and CVD-gated; sequential is
 * strictly L*-monotonic; diverging pins its midpoint to the surface neutral.
 */

import { CHART_GATES } from './data'
import { minPairwiseDeltaEok } from './meters'
import { cusp, fitSrgb, lstarOf, maxChroma, type Oklch, solveLstar } from './space'

export interface ChartPalettes {
  categorical: Oklch[]
  sequential: Oklch[]
  diverging: Oklch[]
}

/** L* ladder for categorical series: adjacent gaps ≥ 8, range ≥ 25 (D11). */
const CATEGORICAL_LSTAR = [58, 70, 48, 62, 76, 44, 66, 54]

function categoricalCandidate(hue: number, lstar: number): Oklch {
  const { c } = cusp(hue)
  return solveLstar(
    lstar,
    (l) => Math.min(0.75 * c, maxChroma(l, hue)),
    () => hue,
  )
}

/**
 * Build a categorical palette of `n` series anchored on the accent hue,
 * greedily choosing hues that maximize the min pairwise ΔEok under normal
 * and CVD vision. Deterministic.
 */
export function categoricalPalette(accentHue: number, n = 8): Oklch[] {
  const chosen: Oklch[] = [categoricalCandidate(accentHue, CATEGORICAL_LSTAR[0]!)]
  const pool: number[] = []
  for (let offset = 15; offset < 360; offset += 15) pool.push((accentHue + offset) % 360)

  while (chosen.length < n) {
    const lstar = CATEGORICAL_LSTAR[chosen.length % CATEGORICAL_LSTAR.length]!
    let best: Oklch | null = null
    let bestScore = -Infinity
    for (const hue of pool) {
      const candidate = categoricalCandidate(hue, lstar)
      const gate = minPairwiseDeltaEok([...chosen, candidate])
      const score = Math.min(
        gate.normal / CHART_GATES.categoricalNormal,
        gate.protan / CHART_GATES.categoricalCvd,
        gate.deutan / CHART_GATES.categoricalCvd,
        gate.tritan / CHART_GATES.categoricalCvd,
      )
      if (score > bestScore) {
        bestScore = score
        best = candidate
      }
    }
    if (!best) break
    chosen.push(best)
    const bestHue = best.h
    const index = pool.findIndex((h) => Math.abs(h - bestHue) < 1e-6)
    if (index >= 0) pool.splice(index, 1)
  }
  return chosen
}

/** Sequential: `n` stops, strictly L*-monotonic from near-surface to deep accent. */
export function sequentialPalette(accentHue: number, n = 7): Oklch[] {
  const peak = cusp(accentHue)
  const from = 95
  const to = 25
  const out: Oklch[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const lstar = from + (to - from) * t
    // Chroma rises toward the deep end, bounded by the gamut.
    const c = peak.c * (0.15 + 0.75 * t)
    out.push(
      solveLstar(lstar, (l) => Math.min(c, maxChroma(l, accentHue)), () => accentHue),
    )
  }
  return out
}

/** Diverging: two sequential arms around the surface neutral midpoint. */
export function divergingPalette(
  accentHue: number,
  neutralMidpoint: Oklch,
  armLength = 3,
): Oklch[] {
  const opposite = (accentHue + 180) % 360
  const arm = (hue: number) =>
    sequentialPalette(hue, armLength + 1)
      .slice(1) // drop the near-surface stop; the midpoint takes its place
      .reverse()
  const left = arm(opposite).reverse()
  const right = arm(accentHue)
  return [...left, fitSrgb(neutralMidpoint), ...right]
}

/** D11 gate report for a categorical palette. */
export function categoricalGateReport(palette: Oklch[]) {
  const gate = minPairwiseDeltaEok(palette)
  const lstars = palette.map(lstarOf)
  const range = Math.max(...lstars) - Math.min(...lstars)
  return {
    ...gate,
    lstarRange: range,
    passes:
      gate.normal >= CHART_GATES.categoricalNormal &&
      gate.protan >= CHART_GATES.categoricalCvd &&
      gate.deutan >= CHART_GATES.categoricalCvd &&
      gate.tritan >= CHART_GATES.categoricalCvd &&
      range >= CHART_GATES.lstarRange,
  }
}
