/**
 * Contrast-first scale solver.
 *
 * Each step's lightness is solved (binary search on OKLCH L) so its WCAG 2.1
 * ratio vs the mode surface meets the step's target, measuring the color as it
 * will ship (chroma envelope + gamut mapping applied before contrast). Hue is
 * held at the seed; the gamut-mapped seed is pinned verbatim at the solid step
 * when `preserveSeed`. Dark is a re-solve against the dark surface, never an
 * inversion of light.
 */

import { gamutMap, toHex, toOklch, wcag2 } from '../shared/color'
import { onColor } from '../shared/on-color'
import { type Cusp, envelopeChroma, findCusp, maxChroma } from './cusp'
import {
  DARK_TARGETS,
  DEFAULT_DARK_SURFACE,
  DEFAULT_LIGHT_SURFACE,
  LIGHT_TARGETS,
  SOLID_STEP,
  V2_STEPS,
  type SolveScaleOptions,
  type SolvedScale,
  type V2Step,
} from './index'

/** Max hue drift (degrees) any step may accrue from gamut mapping. */
export const MAX_HUE_DRIFT = 8

/** L separation between a clamped step and its anchor — wide enough to survive 8-bit hex. */
const MONO_EPSILON = 0.006

function chromaFor(
  l: number,
  h: number,
  neutral: boolean,
  neutralC: number,
  cusp: Cusp,
  scale: number,
): number {
  return neutral
    ? Math.min(neutralC, maxChroma(l, h))
    : Math.min(envelopeChroma(l, cusp, scale), maxChroma(l, h))
}

/** Binary-search the L whose shipped color hits `target` vs `surface`. */
function solveL(
  target: number,
  surface: string,
  h: number,
  darkSurface: boolean,
  neutral: boolean,
  neutralC: number,
  cusp: Cusp,
  scale: number,
): number {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 30; i++) {
    const l = (lo + hi) / 2
    const c = chromaFor(l, h, neutral, neutralC, cusp, scale)
    const ratio = wcag2({ l, c, h }, surface)
    // light surface: contrast rises as L drops; dark surface: rises as L climbs
    if (darkSurface ? ratio < target : ratio >= target) lo = l
    else hi = l
  }
  return (lo + hi) / 2
}

export function solveScaleImpl(options: SolveScaleOptions): SolvedScale {
  const preserveSeed = options.preserveSeed !== false
  const neutral = options.neutral === true
  const mode = options.mode
  const surface =
    options.surface ??
    (mode === 'dark' ? DEFAULT_DARK_SURFACE : DEFAULT_LIGHT_SURFACE)
  const targets =
    options.targets ?? (mode === 'dark' ? DARK_TARGETS : LIGHT_TARGETS)

  const seed = gamutMap(toOklch(options.seed))
  const h = seed.h
  const cusp = findCusp(h)
  const darkSurface = toOklch(surface).l < 0.5

  // Scale the envelope so the seed sits under it at its own lightness (seed fidelity).
  const envAtSeed = envelopeChroma(seed.l, cusp, 1)
  const scale =
    !neutral && envAtSeed > 0 ? Math.min(1.4, seed.c / envAtSeed) : 1
  const neutralC = Math.min(seed.c, 0.03)
  const seedHex = toHex({
    l: seed.l,
    c: neutral ? neutralC : seed.c,
    h,
  })
  const seedL = toOklch(seedHex).l

  const ls = {} as Record<V2Step, number>
  for (const step of V2_STEPS) {
    if (preserveSeed && step === SOLID_STEP) {
      ls[step] = seedL
      continue
    }
    ls[step] = solveL(
      targets[step],
      surface,
      h,
      darkSurface,
      neutral,
      neutralC,
      cusp,
      scale,
    )
  }

  // Monotonic repair: walk outward from the solid anchor. L descends across
  // steps in light mode, ascends in dark; a preserved outlier seed can invert a
  // neighbor, so clamp it back past the anchor by a hex-survivable epsilon.
  const idx = V2_STEPS.indexOf(SOLID_STEP)
  for (let i = idx - 1; i >= 0; i--) {
    const lim = ls[V2_STEPS[i + 1]!]
    const cur = ls[V2_STEPS[i]!]
    if (darkSurface ? cur >= lim : cur <= lim)
      ls[V2_STEPS[i]!] = darkSurface ? lim - MONO_EPSILON : lim + MONO_EPSILON
  }
  for (let i = idx + 1; i < V2_STEPS.length; i++) {
    const lim = ls[V2_STEPS[i - 1]!]
    const cur = ls[V2_STEPS[i]!]
    if (darkSurface ? cur <= lim : cur >= lim)
      ls[V2_STEPS[i]!] = darkSurface ? lim + MONO_EPSILON : lim - MONO_EPSILON
  }

  const steps = {} as Record<V2Step, string>
  const achieved = {} as Record<V2Step, number>
  for (const step of V2_STEPS) {
    const hex =
      preserveSeed && step === SOLID_STEP
        ? seedHex
        : toHex(
            gamutMap({
              l: ls[step],
              c: chromaFor(ls[step], h, neutral, neutralC, cusp, scale),
              h,
            }),
          )
    steps[step] = hex
    achieved[step] = wcag2(toOklch(hex), surface)
  }

  // Foreground for the solid step: contrast-floored pick (white / tinted pole).
  const contrast = onColor(steps[SOLID_STEP], 'wcag2').value

  return { steps, contrast, achieved }
}
