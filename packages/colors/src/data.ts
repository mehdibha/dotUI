/**
 * Every locked constant of the engine, in one place, traceable to SPEC.md.
 * All numbers were measured from primary sources — see `research/`.
 */

/** D1 — the 12 job slots, in ladder order. */
export const STEPS = [
  '25',
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
export type StepName = (typeof STEPS)[number]

/** Steps 1–8 ride the skeleton; 9–12 are solved (D1/D2). */
export const SKELETON_STEPS = STEPS.slice(0, 8)

/** D4 — light-mode CIELAB-D65 L* skeleton, jobs 1–8 (Radix chromatic median). */
export const LIGHT_SKELETON = [99.0, 98.0, 95.5, 92.0, 88.5, 84.0, 77.5, 69.0]

/** D4 — neutral scales ride a lighter border region (Radix gray medians). */
export const LIGHT_SKELETON_NEUTRAL = [
  99.0, 98.0, 95.0, 92.0, 89.5, 86.5, 83.0, 76.0,
]

/** D9 — dark-mode L* skeleton, jobs 1–8 (Radix dark medians; step 25 ≈ #111113). */
export const DARK_SKELETON = [6.0, 8.6, 13.7, 18.0, 22.5, 27.8, 35.0, 45.0]

/** D9 — minimum L* separation between the two darkest surfaces. */
export const DARK_MIN_BG_SEPARATION = 2.5

/** D5 — shared chroma shape g(step), peak at the solid jobs (Radix fit, RMSE 0.0175). */
export const CHROMA_SHAPE = [
  0.0204, 0.0619, 0.1684, 0.2736, 0.3664, 0.4414, 0.5202, 0.6644, 0.9844,
  0.9824, 0.8897, 0.4697,
]

/** D5 — default peak chroma as a fraction of the hue's sRGB cusp (Radix mean 0.7496). */
export const DEFAULT_PEAK_CUSP_FRACTION = 0.75

/** D9 — dark-mode chroma multipliers on the light curve, jobs 1–8; solids ×1. */
export const DARK_CHROMA_MULT = [4.2, 2.2, 2.0, 1.7, 1.4, 1.15, 1.0, 0.9]

/**
 * D9 — dark text steps (900/950) re-solve chroma per hue band: the dark/light
 * ratio flips sign across the wheel (yellow→cyan gains, red→blue loses).
 */
export function darkTextChromaMult(hue: number): number {
  const h = ((hue % 360) + 360) % 360
  if (h >= 80 && h < 220) return 1.35 // yellow → cyan band: gains
  if (h >= 40 && h < 80) return 0.85 // orange: mild loss
  return 0.72 // red / violet / blue band: loses
}

/**
 * D6 — hue bend table keyed to OKLCH L (never step index). `slope` in °/L on
 * the dark side (L below the seed); light side uses `lightSlope`. Positive =
 * toward violet (hue angle increases), negative = toward gold/orange.
 */
export interface HueBand {
  /** Seed-hue range [from, to) in degrees. */
  from: number
  to: number
  slope: number
  /** Clamp for the dark-side drift, degrees. */
  endpoint: number
  lightSlope: number
  lightEndpoint: number
}

export const HUE_BANDS: HueBand[] = [
  // orange-brown: Radix-flat; Tailwind-strength (−37°) is hueShift ≈ 1.6 away
  { from: 40, to: 75, slope: -13, endpoint: -4, lightSlope: -26, lightEndpoint: -8 },
  // gold-amber: strong gold bend
  { from: 75, to: 95, slope: -63, endpoint: -30, lightSlope: 140, lightEndpoint: 16 },
  // yellow-lime
  { from: 95, to: 135, slope: -41, endpoint: -12, lightSlope: 80, lightEndpoint: 12 },
  // blue: toward violet dark, toward cyan pale
  { from: 225, to: 262, slope: 20, endpoint: 7, lightSlope: -59, lightEndpoint: -17 },
]

/** D8 — neutral tint chroma shape per mode (fraction of tintPeak; peak at solid). */
export const NEUTRAL_TINT_SHAPE = {
  light: [0.13, 0.19, 0.26, 0.32, 0.43, 0.46, 0.57, 0.74, 0.97, 0.93, 0.81, 0.79],
  dark: [0.23, 0.22, 0.26, 0.37, 0.43, 0.51, 0.6, 0.8, 1.0, 0.93, 0.71, 0.18],
}

/** D8 — default tint peak (median of Radix family-mode maxima) + whisper ceiling. */
export const NEUTRAL_TINT_PEAK = 0.016
export const NEUTRAL_WHISPER_CEILING = 0.02

/** D7 — accent-vs-neutral classification line. */
export const WHISPER_LINE = 0.02

/** D2 — guarantee bars. */
export const BARS = {
  /** step 900 on worst of 25/50/100. */
  text900: { wcag: 4.5, lc: 60 },
  /** step 950 on 25/50 (Lc), and WCAG 7.0 incl. 100. */
  text950: { wcag: 7.0, lc: 90 },
  /** on-700 / on-800 solid labels (Lc 60 + WCAG UI floor; see SPEC tradeoff). */
  onSolid: { wcag: 3.0, lc: 60 },
  onSolidStrict: { wcag: 4.5, lc: 60 },
  /** Borders vs 25/50, WCAG-only (APCA can't meter dark borders). */
  border400: 1.3,
  border500: 1.45,
  border600: 1.8,
} as const

/** D2 — solid text pole rule: white unless |Lc(white on 700)| < this. */
export const SOLID_POLE_LC_THRESHOLD = 40

/** D10 — status seed defaults (identity-preserving CVD search winners). */
export const STATUS_SEEDS = {
  success: '#6ac48c',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#4862ff',
} as const
export type StatusName = keyof typeof STATUS_SEEDS

/**
 * D10 — CVD gate on the emitted status solids (the solver compresses seed
 * lightness differences, so the solid-space bars sit below the seed-space
 * search values): normal-vision floor + per-CVD floor (calibrated on
 * Okabe-Ito, same as the chart gate). Accent proximity is a separate note:
 * an accent nearly indistinguishable from a status solid under normal
 * vision (destructive vs primary confusion) is worth surfacing.
 */
export const CVD_GATE = { normal: 0.09, cvd: 0.045, accentProximity: 0.045 }

/** D11 — chart palette gates (ΔEok raw 0–1 scale). */
export const CHART_GATES = {
  categoricalNormal: 0.09,
  categoricalCvd: 0.045,
  lstarRange: 25,
  adjacentLstar: 8,
  sequentialAdjacentDeltaEok: 0.02,
} as const

/** D9 — default dark app-background L* (never pure black; 'oled' opts into 0). */
export const DARK_BG_LSTAR = 6.0
export const LIGHT_BG_LSTAR = 99.0
