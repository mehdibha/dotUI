/**
 * Contrast-locked producer (§4.6) — the DEMOTED option (was the default).
 *
 * Binary-searches OKLCH lightness per step to hit a target contrast (WCAG 2 ratio
 * or APCA Lc) against the mode background, with a tapered chroma. For teams who
 * must lock per-step contrast. Search direction is derived from the ACTUAL
 * background lightness, not a mode-name heuristic.
 */

import { z } from 'zod'

import type { ColorProducer, ModeCtx } from '../producer'
import {
  gamutMap,
  makeContrast,
  type Oklch,
  oklchCss,
  toOklch,
} from '../shared/color'
import { chromaEnvelope, resample } from '../shared/curve'
import { computeOnColors, type ContrastFormula } from '../shared/on-color'

const WCAG2_ANCHORS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15]
const APCA_ANCHORS = [10, 15, 22, 30, 42, 55, 68, 80, 90, 100, 106]

function defaultRatios(n: number, formula: ContrastFormula): number[] {
  return resample(formula === 'apca' ? APCA_ANCHORS : WCAG2_ANCHORS, n)
}

export const contrastOptsSchema = z.object({
  seed: z.string(),
  ratios: z.array(z.number().positive()).min(2).optional(),
  formula: z.enum(['wcag2', 'apca']).optional(),
  /** Seed chroma multiplier (saturation/100). */
  chroma: z.number().min(0).max(2).optional(),
  neutral: z.boolean().optional(),
})
export type ContrastOpts = z.infer<typeof contrastOptsSchema>

/** Binary-search OKLCH lightness for the target contrast; clamp to the extreme if unreachable. */
function solveStep(
  target: number,
  hue: number,
  chroma: number,
  bgL: number,
  contrastOf: (fg: Oklch) => number,
): Oklch {
  const at = (l: number): number =>
    contrastOf(gamutMap({ l, c: chroma, h: hue }))
  // Search toward whichever extreme actually maximizes contrast, not a fixed bgL cutoff
  // (the true crossover isn't at 0.5, so a hard cutoff forfeits the stronger pole on mid bg).
  const lighter = at(1) >= at(0) // is a lighter foreground the higher-contrast direction?
  let lo = lighter ? bgL : 0
  let hi = lighter ? 1 : bgL
  if (hi - lo < 1e-3) {
    if (lighter) lo = Math.max(0, hi - 1e-3)
    else hi = Math.min(1, lo + 1e-3)
  }
  const extreme = lighter ? hi : lo // max-contrast end
  if (at(extreme) <= target) return gamutMap({ l: extreme, c: chroma, h: hue })
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2
    const needsMore = at(mid) < target
    // lighter: higher L = more contrast; else: lower L = more contrast.
    if (lighter ? needsMore : !needsMore) lo = mid
    else hi = mid
  }
  return gamutMap({ l: (lo + hi) / 2, c: chroma, h: hue })
}

export const contrastProducer: ColorProducer<ContrastOpts> = {
  id: 'contrast',
  schema: contrastOptsSchema,
  produce(opts, ctx: ModeCtx) {
    const formula = opts.formula ?? 'wcag2'
    const ratios = opts.ratios ?? defaultRatios(ctx.steps.length, formula)
    const seed = toOklch(opts.seed)
    const bgL = toOklch(ctx.background).l
    const contrastOf = makeContrast(ctx.background, formula)
    const baseChroma = opts.neutral
      ? Math.min(seed.c, 0.012)
      : seed.c * (opts.chroma ?? 1)

    const scale: Record<string, string> = {}
    const n = ctx.steps.length
    for (let i = 0; i < n; i++) {
      const target = ratios[i] ?? ratios.at(-1) ?? 1
      const chroma = baseChroma * chromaEnvelope(i, n)
      scale[ctx.steps[i]!] = oklchCss(
        solveStep(target, seed.h, chroma, bgL, contrastOf),
      )
    }
    return { scale, on: computeOnColors(scale, formula) }
  },
}
