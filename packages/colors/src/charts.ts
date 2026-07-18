/**
 * Chart palettes (D11): generated per mode from the theme's seeds, never
 * aliased. Categorical is hue-spread + L*-staggered and CVD-gated; sequential
 * is strictly L*-monotonic away from the mode's surface; diverging pins its
 * midpoint to the surface neutral.
 */

import { CHART_GATES } from './data'
import {
  CVD_KINDS,
  type CvdKind,
  deltaEok,
  minPairwiseDeltaEok,
  simulateCvd,
} from './meters'
import { bentHue, type Mode } from './scale'
import {
  cusp,
  fitSrgb,
  lstarOf,
  maxChroma,
  type Oklch,
  solveLstar,
} from './space'

export interface ChartPalettes {
  categorical: Oklch[]
  sequential: Oklch[]
  diverging: Oklch[]
}

/**
 * L* ladders for categorical series: adjacent gaps ≥ 8 by construction,
 * range ≥ 25 (D11). Dark mode rides a lighter ladder — series must read
 * against a near-black surface.
 */
const CATEGORICAL_LSTAR: Record<Mode, number[]> = {
  light: [58, 70, 48, 62, 76, 44, 66, 54],
  dark: [64, 76, 54, 68, 82, 50, 72, 60],
}

/**
 * L* ladders for the brand-tonal palette (the default — shadcn parity:
 * `--chart-1..5` are blue-300/500/600/700/800, tonal steps of one hue,
 * lightest first). Dark mode rides a lighter ladder so the deep series
 * still read on a near-black surface.
 */
const TONAL_LSTAR: Record<Mode, number[]> = {
  light: [76, 68, 60, 52, 45, 38, 31, 25],
  dark: [79, 72, 65, 58, 51, 44, 38, 32],
}

/** Minimum adjacent L* separation for a tonal palette (its only encoding). */
export const TONAL_MIN_ADJACENT_LSTAR = 6

/**
 * The default categorical palette: tonal shades of the brand accent
 * (verified shadcn behavior), carrying the ramp's hue-bend character and the
 * seed's own chroma. Lightness is the series encoding — CVD-safe by
 * construction, since lightness survives every deficiency.
 */
export function tonalCategoricalPalette(
  accent: Oklch,
  n = 8,
  mode: Mode = 'light',
): Oklch[] {
  const ladder = TONAL_LSTAR[mode]
  const cpeak = accent.c > 0.005 ? accent.c : 0.75 * cusp(accent.h).c
  return ladder.slice(0, n).map((lstar) =>
    solveLstar(
      lstar,
      (l) => Math.min(cpeak, maxChroma(l, bentHue(accent, l, 1))),
      (l) => bentHue(accent, l, 1),
    ),
  )
}

/** Gate for tonal palettes: strictly descending with readable L* steps. */
export function tonalGateReport(palette: Oklch[]) {
  const lstars = palette.map(lstarOf)
  let minAdjacent = Infinity
  let monotonic = true
  for (let i = 1; i < lstars.length; i++) {
    const delta = lstars[i - 1]! - lstars[i]!
    minAdjacent = Math.min(minAdjacent, delta)
    if (delta <= 0) monotonic = false
  }
  return {
    minAdjacent,
    monotonic,
    range: lstars[0]! - lstars[lstars.length - 1]!,
    // 0.25 L* slack absorbs the solver's 8-bit quantization wobble.
    passes: monotonic && minAdjacent >= TONAL_MIN_ADJACENT_LSTAR - 0.25,
  }
}

/** Reject washed-out picks: achieved chroma below this fraction of the hue's cusp. */
const MIN_CUSP_FRACTION = 0.4
/** Warm-yellow hues (gold→lime) turn olive below this L* — keep them on light slots. */
const YELLOW_BAND = { from: 75, to: 135, minLstar: 58 }
/** Minimum circular hue distance between chosen series. */
const MIN_HUE_GAP = 30

function hueGap(a: number, b: number): number {
  const d = Math.abs(((a - b + 540) % 360) - 180)
  return d
}

function categoricalCandidate(hue: number, lstar: number): Oklch {
  const { c } = cusp(hue)
  return solveLstar(
    lstar,
    (l) => Math.min(0.75 * c, maxChroma(l, hue)),
    () => hue,
  )
}

function isMuddy(candidate: Oklch, lstar: number): boolean {
  const h = ((candidate.h % 360) + 360) % 360
  if (
    h >= YELLOW_BAND.from &&
    h < YELLOW_BAND.to &&
    lstar < YELLOW_BAND.minLstar
  )
    return true
  return candidate.c < MIN_CUSP_FRACTION * cusp(candidate.h).c
}

/**
 * Build a categorical palette of `n` series anchored on the accent. Slot 1
 * takes the ladder rung nearest the accent's own lightness (a yellow brand
 * stays yellow, never mustard); later slots greedily maximize the min
 * pairwise ΔEok under normal and CVD vision, constrained away from muddy
 * hue-lightness pairings and near-duplicate hues. Deterministic.
 */
export function categoricalPalette(
  accent: Oklch,
  n = 8,
  mode: Mode = 'light',
): Oklch[] {
  const baseLadder = CATEGORICAL_LSTAR[mode]
  // Give the brand series the rung closest to its natural lightness.
  const accentLstar = lstarOf(fitSrgb(accent))
  let nearest = 0
  baseLadder.forEach((lstar, i) => {
    if (
      Math.abs(lstar - accentLstar) <
      Math.abs(baseLadder[nearest]! - accentLstar)
    )
      nearest = i
  })
  const ladder = [...baseLadder]
  ;[ladder[0], ladder[nearest]] = [ladder[nearest]!, ladder[0]!]

  // Incremental gate scoring: keep every chosen color's CVD simulations and
  // the chosen-set's running per-condition minimum, so scoring a candidate is
  // O(chosen) instead of re-measuring all pairs under all conditions.
  type Simulated = Record<'normal' | CvdKind, Oklch>
  const simulate = (color: Oklch): Simulated => {
    const out = { normal: color } as Simulated
    for (const kind of CVD_KINDS) out[kind] = simulateCvd(color, kind)
    return out
  }
  const CONDITIONS = ['normal', ...CVD_KINDS] as const
  const gateFor = (condition: (typeof CONDITIONS)[number]) =>
    condition === 'normal'
      ? CHART_GATES.categoricalNormal
      : CHART_GATES.categoricalCvd

  const chosen: Oklch[] = [categoricalCandidate(accent.h, ladder[0]!)]
  const chosenSim: Simulated[] = [simulate(chosen[0]!)]
  const setMin: Record<(typeof CONDITIONS)[number], number> = {
    normal: Infinity,
    protan: Infinity,
    deutan: Infinity,
    tritan: Infinity,
  }

  const pool: number[] = []
  for (let offset = 15; offset < 360; offset += 15)
    pool.push((accent.h + offset) % 360)

  while (chosen.length < n) {
    const lstar = ladder[chosen.length % ladder.length]!
    let best: { color: Oklch; sim: Simulated } | null = null
    let bestScore = -Infinity
    let bestRelaxed: { color: Oklch; sim: Simulated } | null = null
    let bestRelaxedScore = -Infinity
    for (const hue of pool) {
      const candidate = categoricalCandidate(hue, lstar)
      const sim = simulate(candidate)
      let score = Infinity
      for (const condition of CONDITIONS) {
        let min = setMin[condition]
        for (const existing of chosenSim)
          min = Math.min(min, deltaEok(existing[condition], sim[condition]))
        score = Math.min(score, min / gateFor(condition))
      }
      // Track an unconstrained fallback so exhausted pools still fill slots.
      if (score > bestRelaxedScore) {
        bestRelaxedScore = score
        bestRelaxed = { color: candidate, sim }
      }
      if (isMuddy(candidate, lstar)) continue
      if (chosen.some((c) => hueGap(c.h, hue) < MIN_HUE_GAP)) continue
      if (score > bestScore) {
        bestScore = score
        best = { color: candidate, sim }
      }
    }
    const pick = best ?? bestRelaxed
    if (!pick) break
    for (const condition of CONDITIONS) {
      for (const existing of chosenSim)
        setMin[condition] = Math.min(
          setMin[condition],
          deltaEok(existing[condition], pick.sim[condition]),
        )
    }
    chosen.push(pick.color)
    chosenSim.push(pick.sim)
    const pickHue = pick.color.h
    const index = pool.findIndex((h) => Math.abs(h - pickHue) < 1e-6)
    if (index >= 0) pool.splice(index, 1)
  }
  return chosen
}

/**
 * Sequential: `n` stops, strictly L*-monotonic from the mode's surface end
 * toward the deep accent (light: near-white → deep; dark: near-black → bright).
 */
export function sequentialPalette(
  accentHue: number,
  n = 7,
  mode: Mode = 'light',
): Oklch[] {
  const peak = cusp(accentHue)
  const [from, to] = mode === 'light' ? [95, 25] : [12, 82]
  const out: Oklch[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const lstar = from + (to - from) * t
    // Chroma rises away from the surface end, bounded by the gamut.
    const c = peak.c * (0.15 + 0.75 * t)
    out.push(
      solveLstar(
        lstar,
        (l) => Math.min(c, maxChroma(l, accentHue)),
        () => accentHue,
      ),
    )
  }
  return out
}

/** Diverging: two sequential arms around the surface neutral midpoint. */
export function divergingPalette(
  accentHue: number,
  neutralMidpoint: Oklch,
  armLength = 3,
  mode: Mode = 'light',
): Oklch[] {
  const opposite = (accentHue + 180) % 360
  const arm = (hue: number) =>
    sequentialPalette(hue, armLength + 1, mode)
      .slice(1) // drop the near-surface stop; the midpoint takes its place
      .reverse()
  // Each arm connects to the midpoint at its light end and deepens outward.
  const left = arm(opposite)
  const right = arm(accentHue).reverse()
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
