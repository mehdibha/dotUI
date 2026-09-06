/**
 * Chart palettes (D11): generated per mode from the theme's seeds, never
 * aliased. Categorical is hue-spread + L*-staggered and CVD-gated; sequential
 * is strictly L*-monotonic away from the mode's surface; diverging pins its
 * midpoint to the surface neutral.
 */

import { CHART_GATES } from "./data"
import {
  CVD_KINDS,
  type CvdKind,
  deltaEok,
  minPairwiseDeltaEok,
  simulateCvd,
} from "./meters"
import { bentHue, type Mode } from "./scale"
import {
  cusp,
  fitSrgb,
  lstarOf,
  maxChroma,
  type Oklch,
  solveLstar,
} from "./space"

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
  mode: Mode = "light",
): Oklch[] {
  // The seed's chroma is authoritative: a muted brand gives muted charts, an
  // achromatic brand gives grays (lightness stays the series encoding).
  const ladder = TONAL_LSTAR[mode]
  const cpeak = accent.c
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

/**
 * Chroma of hue-spread series as a fraction of each hue's cusp: `vivid` is the
 * saturated Material/Carbon register, `muted` the desaturated one (Linear,
 * Stripe dashboards).
 */
export const CATEGORICAL_CHROMA = { vivid: 0.75, muted: 0.3 } as const

/** Reject washed-out picks: achieved chroma below this fraction of the target. */
const MIN_TARGET_FRACTION = 0.53
/** Warm-yellow hues (gold→lime) turn olive below this L* — keep them on light slots. */
const YELLOW_BAND = { from: 75, to: 135, minLstar: 58 }
/** Low-chroma warm hues (orange→lime) read as brown or khaki below this L*. */
const BROWN_BAND = { from: 30, to: 135, maxChroma: 0.1, minLstar: 68 }
/** Minimum circular hue distance between chosen series. */
const MIN_HUE_GAP = 30

function hueGap(a: number, b: number): number {
  const d = Math.abs(((a - b + 540) % 360) - 180)
  return d
}

function categoricalCandidate(
  hue: number,
  lstar: number,
  chroma: number,
): Oklch {
  const { c } = cusp(hue)
  return solveLstar(
    lstar,
    (l) => Math.min(chroma * c, maxChroma(l, hue)),
    () => hue,
  )
}

function isMuddy(candidate: Oklch, lstar: number, chroma: number): boolean {
  const h = ((candidate.h % 360) + 360) % 360
  if (
    h >= YELLOW_BAND.from &&
    h < YELLOW_BAND.to &&
    lstar < YELLOW_BAND.minLstar
  )
    return true
  if (
    h >= BROWN_BAND.from &&
    h < BROWN_BAND.to &&
    candidate.c < BROWN_BAND.maxChroma &&
    lstar < BROWN_BAND.minLstar
  )
    return true
  return candidate.c < MIN_TARGET_FRACTION * chroma * cusp(candidate.h).c
}

const MODES: Mode[] = ["light", "dark"]

/**
 * Build the categorical palettes of `n` series anchored on the accent, one
 * per mode, sharing one hue sequence so a series keeps its identity when the
 * theme toggles. Slot 1 takes the ladder rung nearest the accent's own
 * lightness (a yellow brand stays yellow, never mustard); later slots
 * greedily maximize the min pairwise ΔEok under normal and CVD vision in
 * both modes at once, constrained away from muddy hue-lightness pairings and
 * near-duplicate hues. `chroma` is the series' target as a fraction of each
 * hue's cusp. Deterministic.
 */
export function categoricalPalettes(
  accent: Oklch,
  n = 8,
  chroma: number = CATEGORICAL_CHROMA.vivid,
): Record<Mode, Oklch[]> {
  // Give the brand series the rung closest to its natural lightness.
  const accentLstar = lstarOf(fitSrgb(accent))
  const ladders = Object.fromEntries(
    MODES.map((mode) => {
      const ladder = [...CATEGORICAL_LSTAR[mode]]
      let nearest = 0
      ladder.forEach((lstar, i) => {
        if (
          Math.abs(lstar - accentLstar) <
          Math.abs(ladder[nearest]! - accentLstar)
        )
          nearest = i
      })
      ;[ladder[0], ladder[nearest]] = [ladder[nearest]!, ladder[0]!]
      return [mode, ladder]
    }),
  ) as Record<Mode, number[]>

  // Incremental gate scoring: keep every chosen color's CVD simulations and
  // the chosen-set's running per-condition minimum, so scoring a candidate is
  // O(chosen) instead of re-measuring all pairs under all conditions.
  type Simulated = Record<"normal" | CvdKind, Oklch>
  const simulate = (color: Oklch): Simulated => {
    const out = { normal: color } as Simulated
    for (const kind of CVD_KINDS) out[kind] = simulateCvd(color, kind)
    return out
  }
  const CONDITIONS = ["normal", ...CVD_KINDS] as const
  const gateFor = (condition: (typeof CONDITIONS)[number]) =>
    condition === "normal"
      ? CHART_GATES.categoricalNormal
      : CHART_GATES.categoricalCvd

  type Candidate = Record<Mode, { color: Oklch; sim: Simulated }>
  const candidateFor = (hue: number, slot: number): Candidate =>
    Object.fromEntries(
      MODES.map((mode) => {
        const color = categoricalCandidate(hue, ladders[mode][slot]!, chroma)
        return [mode, { color, sim: simulate(color) }]
      }),
    ) as Candidate
  const muddy = (candidate: Candidate, slot: number) =>
    MODES.some((mode) =>
      isMuddy(candidate[mode].color, ladders[mode][slot]!, chroma),
    )

  const chosen: Candidate[] = [candidateFor(accent.h, 0)]
  const setMin = Object.fromEntries(
    MODES.map((mode) => [
      mode,
      {
        normal: Infinity,
        protan: Infinity,
        deutan: Infinity,
        tritan: Infinity,
      },
    ]),
  ) as Record<Mode, Record<(typeof CONDITIONS)[number], number>>
  // The candidate's score is its worst gate ratio across both modes.
  const score = (candidate: Candidate) => {
    let score = Infinity
    for (const mode of MODES)
      for (const condition of CONDITIONS) {
        let min = setMin[mode][condition]
        for (const existing of chosen)
          min = Math.min(
            min,
            deltaEok(
              existing[mode].sim[condition],
              candidate[mode].sim[condition],
            ),
          )
        score = Math.min(score, min / gateFor(condition))
      }
    return score
  }

  const pool: number[] = []
  for (let offset = 15; offset < 360; offset += 15)
    pool.push((accent.h + offset) % 360)

  while (chosen.length < n) {
    const slot = chosen.length % CATEGORICAL_LSTAR.light.length
    let best: { hue: number; candidate: Candidate } | null = null
    let bestScore = -Infinity
    let bestRelaxed: { hue: number; candidate: Candidate } | null = null
    let bestRelaxedScore = -Infinity
    for (const hue of pool) {
      const candidate = candidateFor(hue, slot)
      const s = score(candidate)
      // Track an unconstrained fallback so exhausted pools still fill slots.
      if (s > bestRelaxedScore) {
        bestRelaxedScore = s
        bestRelaxed = { hue, candidate }
      }
      if (muddy(candidate, slot)) continue
      if (chosen.some((c) => hueGap(c.light.color.h, hue) < MIN_HUE_GAP))
        continue
      if (s > bestScore) {
        bestScore = s
        best = { hue, candidate }
      }
    }
    const pick = best ?? bestRelaxed
    if (!pick) break
    for (const mode of MODES)
      for (const condition of CONDITIONS)
        for (const existing of chosen)
          setMin[mode][condition] = Math.min(
            setMin[mode][condition],
            deltaEok(
              existing[mode].sim[condition],
              pick.candidate[mode].sim[condition],
            ),
          )
    chosen.push(pick.candidate)
    pool.splice(pool.indexOf(pick.hue), 1)
  }
  return Object.fromEntries(
    MODES.map((mode) => [mode, chosen.map((c) => c[mode].color)]),
  ) as Record<Mode, Oklch[]>
}

/** One mode of `categoricalPalettes` — hues are still chosen across both. */
export function categoricalPalette(
  accent: Oklch,
  n = 8,
  mode: Mode = "light",
  chroma: number = CATEGORICAL_CHROMA.vivid,
): Oklch[] {
  return categoricalPalettes(accent, n, chroma)[mode]
}

/**
 * Sequential: `n` stops, strictly L*-monotonic from the mode's surface end
 * toward the deep accent (light: near-white → deep; dark: near-black → bright).
 */
export function sequentialPalette(
  accentHue: number,
  n = 7,
  mode: Mode = "light",
): Oklch[] {
  const peak = cusp(accentHue)
  const [from, to] = mode === "light" ? [95, 25] : [12, 82]
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
  mode: Mode = "light",
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
