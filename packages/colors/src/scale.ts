/**
 * Scale generation: jobs 1–8 ride the mode's L* skeleton (D4/D9); jobs 9–12
 * are solved to their guarantees (D2). One code path for chromatic and
 * neutral scales — neutrals differ only in skeleton row and chroma model
 * (whisper tint, D8).
 */

import {
  BARS,
  CHROMA_SHAPE,
  DARK_CHROMA_MULT,
  darkTextChromaMult,
  DARK_SKELETON,
  DEFAULT_PEAK_CUSP_FRACTION,
  HUE_BANDS,
  LIGHT_SKELETON,
  LIGHT_SKELETON_NEUTRAL,
  NEUTRAL_TINT_SHAPE,
  STEPS,
  type StepName,
} from './data'
import { apca, wcag2 } from './meters'
import {
  cusp,
  fitSrgb,
  lstarOf,
  maxChroma,
  type Oklch,
  solveLstar,
  yFromLstar,
} from './space'

export type Mode = 'light' | 'dark'

export interface ScaleColors {
  /** Job-ladder colors, in STEPS order. */
  steps: Record<StepName, Oklch>
  /** Solved solid-label foregrounds (D2). */
  on: { '700': Oklch; '800': Oklch }
}

export interface ScaleOptions {
  seed: Oklch
  mode: Mode
  neutral: boolean
  /** D5 — scales the fitted chroma curve. Default 1. */
  vividness: number
  /** D6 — scalar on the hue-band bend. Default 1. */
  hueShift: number
  /** D8 — neutral only: tint peak chroma (already scaled by neutralTint). */
  tintPeak: number
  /** D2 — solve solids to the full WCAG 4.5 on-label bar. */
  strictOnSolid: boolean
  /** D7 — pin the seed verbatim at the solid step (light mode). */
  preserveSeed: boolean
  /** Skeleton override for background transposition (L*, jobs 1–8). */
  skeleton?: number[]
  /** Share the light pass's solid (Radix: step 700 is mode-invariant). */
  sharedSolid?: { solid: Oklch; on: Oklch }
}

const WHITE: Oklch = { l: 1, c: 0, h: 0 }

/** D6 — hue drift keyed to L, banded by seed hue, scaled by `hueShift`. */
export function bentHue(seed: Oklch, l: number, hueShift: number): number {
  const h = ((seed.h % 360) + 360) % 360
  const band = HUE_BANDS.find((b) => h >= b.from && h < b.to)
  if (!band || hueShift === 0) return seed.h
  const dl = seed.l - l
  const drift =
    dl >= 0
      ? Math.sign(band.endpoint) *
        Math.min(Math.abs(band.slope * dl), Math.abs(band.endpoint))
      : Math.sign(band.lightEndpoint) *
        Math.min(Math.abs(band.lightSlope * dl), Math.abs(band.lightEndpoint))
  return seed.h + drift * hueShift
}

interface ChromaModel {
  at(l: number, stepIndex: number): number
}

function chromaticChroma(
  seed: Oklch,
  mode: Mode,
  vividness: number,
): ChromaModel {
  // D5 — Cpeak anchors to the seed's own chroma (the brand is authoritative;
  // muted seeds yield muted ramps by design), floored by nothing, defaulted
  // to the Radix cusp fraction only when the seed carries no usable chroma.
  const seedCusp = cusp(seed.h)
  const cpeak =
    seed.c > 0.005 ? seed.c : DEFAULT_PEAK_CUSP_FRACTION * seedCusp.c
  return {
    at(l, i) {
      let c = vividness * cpeak * CHROMA_SHAPE[i]!
      if (mode === 'dark') {
        if (i < 8) c *= DARK_CHROMA_MULT[i]!
        else if (i >= 10) c *= darkTextChromaMult(seed.h)
      }
      // Radix clamp: text steps never exceed the border/solid chroma region.
      if (i >= 10) c = Math.min(c, cpeak)
      return Math.min(c, maxChroma(l, seed.h))
    },
  }
}

function neutralChroma(mode: Mode, tintPeak: number): ChromaModel {
  const shape = NEUTRAL_TINT_SHAPE[mode]
  return { at: (_l, i) => tintPeak * shape[i]! }
}

/** D2 — the hue-tinted dark pole (verified Lc 74.5–87.5 on bright solids). */
function darkPole(solid: Oklch): Oklch {
  return fitSrgb({ l: 0.25, c: Math.max(0.08 * solid.c, 0.04), h: solid.h })
}

/**
 * D2 — label preference order: white if it clears its bars, else the tinted
 * dark pole if it clears, else deepen the dark pole toward black. Equivalent
 * to the |Lc(white)| < 40 pole rule on all 62 measured Radix scale-modes,
 * and it resolves the 29.5–60.8 Lc dead zone toward keeping the seed.
 */
function solveOnColor(solid: Oklch, strict: boolean): Oklch {
  if (onMeetsBars(WHITE, solid, strict)) return WHITE
  let on = darkPole(solid)
  let l = on.l
  while (!onMeetsBars(on, solid, strict) && l > 0) {
    l -= 0.02
    on = fitSrgb({ ...on, l })
  }
  return on
}

function onMeetsBars(on: Oklch, solid: Oklch, strict: boolean): boolean {
  const bars = strict ? BARS.onSolidStrict : BARS.onSolid
  return (
    Math.abs(apca(on, solid)) >= bars.lc && wcag2(on, solid) >= bars.wcag
  )
}

/**
 * D2 — place the solid at the seed's own lightness. When neither label pole
 * clears its bars there (deep mid-tone solids: white short of Lc 60, dark
 * pole short too), darken the solid minimally (in L*) until white clears —
 * the only case where the seed's lightness moves, and the report prices it.
 */
function solveSolid(
  seed: Oklch,
  chroma: ChromaModel,
  hueAt: (l: number) => number,
  preserveSeed: boolean,
  strict: boolean,
): { solid: Oklch; on: Oklch } {
  let solid = fitSrgb({
    l: seed.l,
    c: preserveSeed ? seed.c : chroma.at(seed.l, 8),
    h: preserveSeed ? seed.h : hueAt(seed.l),
  })
  if (preserveSeed) return { solid, on: solveOnColor(solid, strict) }

  if (onMeetsBars(WHITE, solid, strict)) return { solid, on: WHITE }
  const dark = darkPole(solid)
  if (onMeetsBars(dark, solid, strict)) return { solid, on: dark }

  let targetLstar = lstarOf(solid)
  for (let i = 0; i < 40 && targetLstar > 5; i++) {
    targetLstar -= 1
    solid = solveLstar(targetLstar, (l) => chroma.at(l, 8), hueAt)
    if (onMeetsBars(WHITE, solid, strict)) return { solid, on: WHITE }
  }
  return { solid, on: solveOnColor(solid, strict) }
}

/**
 * D10 — signed hover shift (Radix closed form; sign flips per mode). The
 * shift shrinks toward zero if it would break the on-label bars (dark-mode
 * lightening can push white text under Lc 60): at zero shift the bars pass
 * by construction because on-700 passed.
 */
function hoverSolid(
  solid: Oklch,
  on: Oklch,
  mode: Mode,
  chroma: ChromaModel,
  strict: boolean,
): Oklch {
  const delta = 0.03 / (solid.l + 0.1)
  const targetL =
    mode === 'light'
      ? solid.l > 0.4
        ? solid.l - delta
        : solid.l + delta
      : solid.l < 0.85
        ? solid.l + delta
        : solid.l - delta
  const targetC = solid.l > 0.4 ? solid.c * 0.93 : solid.c
  for (const t of [1, 0.75, 0.5, 0.25, 0]) {
    const l = solid.l + (targetL - solid.l) * t
    const c = solid.c + (targetC - solid.c) * t
    const hover = fitSrgb({ l, c: Math.min(c, chroma.at(l, 9)), h: solid.h })
    if (onMeetsBars(on, hover, strict) || t === 0) return hover
  }
  return solid
}

/**
 * D2 — solve a text step to its bars against the scale's own backgrounds.
 * Searches L* away from the backgrounds until every bar is met.
 */
function solveText(
  bars: { wcag: number; lc: number },
  backgrounds: Oklch[],
  lcBackgrounds: Oklch[],
  chromaAt: (l: number) => number,
  hueAt: (l: number) => number,
  mode: Mode,
  startLstar: number,
): Oklch {
  const meets = (color: Oklch) =>
    backgrounds.every((bg) => wcag2(color, bg) >= bars.wcag) &&
    lcBackgrounds.every((bg) => Math.abs(apca(color, bg)) >= bars.lc)
  let lstar = startLstar
  let color = solveLstar(lstar, chromaAt, hueAt)
  for (let i = 0; i < 90; i++) {
    if (meets(color)) return color
    lstar += mode === 'light' ? -1 : 1
    if (lstar < 0 || lstar > 100) break
    color = solveLstar(lstar, chromaAt, hueAt)
  }
  return color
}

/** Build one scale for one mode. */
export function buildScale(options: ScaleOptions): ScaleColors {
  const { seed, mode, neutral, vividness, hueShift, strictOnSolid } = options
  const chroma: ChromaModel = neutral
    ? neutralChroma(mode, options.tintPeak)
    : chromaticChroma(seed, mode, vividness)
  const hueAt = neutral
    ? () => seed.h
    : (l: number) => bentHue(seed, l, hueShift)

  const skeleton =
    options.skeleton ??
    (mode === 'dark'
      ? DARK_SKELETON
      : neutral
        ? LIGHT_SKELETON_NEUTRAL
        : LIGHT_SKELETON)

  const steps = {} as Record<StepName, Oklch>
  skeleton.forEach((lstar, i) => {
    steps[STEPS[i]!] = solveLstar(lstar, (l) => chroma.at(l, i), hueAt)
  })

  // Solids (jobs 9–10). Step 700 is mode-invariant (verified: Radix shares
  // the identical step-9 across modes) — the dark pass reuses the light solve.
  const { solid, on } =
    options.sharedSolid ??
    solveSolid(seed, chroma, hueAt, options.preserveSeed && mode === 'light', strictOnSolid)
  steps['700'] = solid
  steps['800'] = hoverSolid(solid, on, mode, chroma, strictOnSolid)
  const on800 = on

  // Text (jobs 11–12), solved against this scale's own backgrounds.
  const bg25 = steps['25']!
  const bg50 = steps['50']!
  const bg100 = steps['100']!
  const textStart = mode === 'light' ? 45 : 60
  steps['900'] = solveText(
    BARS.text900,
    [bg25, bg50, bg100],
    [bg25, bg50, bg100],
    (l) => chroma.at(l, 10),
    hueAt,
    mode,
    textStart,
  )
  steps['950'] = solveText(
    BARS.text950,
    [bg25, bg50, bg100],
    [bg25, bg50], // Lc 90 promised on app/subtle backgrounds (D2)
    (l) => chroma.at(l, 11),
    hueAt,
    mode,
    mode === 'light' ? 25 : 85,
  )

  return { steps, on: { '700': on, '800': on800 } }
}

/** Background transposition (D9/D12): shift the skeleton to a chosen app-bg L*. */
export function transposeSkeleton(
  skeleton: number[],
  targetLstar: number,
): number[] {
  const delta = targetLstar - skeleton[0]!
  if (delta === 0) return skeleton
  const n = skeleton.length
  // Eased decay: full shift at job 1, none by job 8; quadratic ease-out.
  return skeleton.map((lstar, i) => {
    const t = i / (n - 1)
    return lstar + delta * (1 - t) ** 2
  })
}

/** Convenience for guarantees relying on the Y bridge. */
export const bgYFromLstar = yFromLstar
