/* Computed quality metrics — the numeric half of the comparison. Each metric
   mirrors a published evaluation criterion (perceptual spacing, hue purity,
   contrast, dark symmetry, CVD distinguishability) so the scorecard ranks
   systems on the same axes the engine rewrite will be judged on. */

import { simulateCvd, rgbToOklch, type CvdType } from './color'
import {
  mappingFor,
  scaleByRole,
  type ColorSystem,
  type Step,
  type UiRole,
} from './data'

export interface ScaleMetrics {
  /** Lightness moves in one direction across the scale. */
  monotonic: boolean
  /** Std-dev of adjacent-step ΔL — lower = more perceptually even spacing. */
  spacingStd: number
  maxDeltaL: number
  /** Peak chroma and where it sits (0..1 across the scale). */
  chromaPeak: { value: number; at: number }
  /** Max circular deviation from the scale's mean hue, in degrees (chroma-weighted:
      near-neutral steps are ignored — their hue is numerically meaningless). */
  hueDrift: number
  /** WCAG of the text / subtle-text roles against the scale's own app bg. */
  textContrast: number | null
  subtleTextContrast: number | null
  /** WCAG of the solid step against its best plain foreground. */
  solidFgContrast: number | null
}

export interface SystemMetrics {
  light: Partial<Record<string, ScaleMetrics>>
  dark: Partial<Record<string, ScaleMetrics>>
  /** Mean |L_light(i) + L_dark(i) − 1| across neutral steps — 0 is a perfect
      lightness mirror; big values mean dark mode is its own design (not bad,
      but worth seeing). Null when the system has no dark palette. */
  darkSymmetry: number | null
  /** Min pairwise OKLab distance between danger/success/warning solids under
      deuteranopia — how confusable the status colors are for the most common
      color-vision deficiency. Higher is safer; < 0.08 is risky. */
  statusCvdSeparation: number | null
}

function circularHueStats(steps: Step[]): number {
  const usable = steps.filter((s) => s.oklch.c > 0.02)
  if (usable.length < 2) return 0
  let x = 0
  let y = 0
  for (const s of usable) {
    x += Math.cos((s.oklch.h * Math.PI) / 180)
    y += Math.sin((s.oklch.h * Math.PI) / 180)
  }
  const mean = (Math.atan2(y, x) * 180) / Math.PI
  let max = 0
  for (const s of usable) {
    let d = Math.abs(s.oklch.h - mean) % 360
    if (d > 180) d = 360 - d
    max = Math.max(max, d)
  }
  return max
}

export function computeScaleMetrics(
  mapping: Partial<Record<UiRole, number | null>>,
  steps: Step[],
): ScaleMetrics {
  const l = steps.map((s) => s.oklch.l)
  const deltas = l.slice(1).map((v, index) => v - (l[index] ?? v))
  const direction = Math.sign(deltas.reduce((a, b) => a + b, 0)) || 1
  const monotonic = deltas.every((d) => d === 0 || Math.sign(d) === direction)
  const abs = deltas.map(Math.abs)
  const mean = abs.reduce((a, b) => a + b, 0) / Math.max(1, abs.length)
  const spacingStd = Math.sqrt(
    abs.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, abs.length),
  )
  let chromaPeak = { value: 0, at: 0 }
  steps.forEach((s, index) => {
    if (s.oklch.c > chromaPeak.value)
      chromaPeak = {
        value: s.oklch.c,
        at: index / Math.max(1, steps.length - 1),
      }
  })
  const at = (role: 'text' | 'textSubtle' | 'solid') => {
    const index = mapping[role]
    return index === null || index === undefined ? undefined : steps[index]
  }
  return {
    monotonic,
    spacingStd,
    maxDeltaL: Math.max(0, ...abs),
    chromaPeak,
    hueDrift: circularHueStats(steps),
    textContrast: at('text')?.vsBg.wcag ?? null,
    subtleTextContrast: at('textSubtle')?.vsBg.wcag ?? null,
    solidFgContrast: at('solid')?.asBg.wcag ?? null,
  }
}

function statusCvdSeparation(system: ColorSystem, cvd: CvdType): number | null {
  const solidIndex = system.roleMapping.solid
  if (solidIndex === null || solidIndex === undefined) return null
  const solids = (['danger', 'success', 'warning'] as const)
    .map((role) => scaleByRole(system, role)?.light[solidIndex])
    .filter((s): s is Step => Boolean(s))
  if (solids.length < 2) return null
  const labs = solids.map((s) => {
    const sim = rgbToOklch(simulateCvd(s.rgb, cvd))
    const hr = (sim.h * Math.PI) / 180
    return { l: sim.l, a: sim.c * Math.cos(hr), b: sim.c * Math.sin(hr) }
  })
  let min = Infinity
  for (let i = 0; i < labs.length; i++) {
    for (let j = i + 1; j < labs.length; j++) {
      const a = labs[i]
      const b = labs[j]
      if (!a || !b) continue
      min = Math.min(min, Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b))
    }
  }
  return Number.isFinite(min) ? min : null
}

export function computeSystemMetrics(system: ColorSystem): SystemMetrics {
  const light: SystemMetrics['light'] = {}
  const dark: SystemMetrics['dark'] = {}
  for (const scale of system.scales) {
    const mapping = mappingFor(system, scale)
    light[scale.id] = computeScaleMetrics(mapping, scale.light)
    if (scale.dark) dark[scale.id] = computeScaleMetrics(mapping, scale.dark)
  }
  const neutral = system.scales.find((s) => s.role === 'neutral')
  let darkSymmetry: number | null = null
  if (neutral?.dark) {
    const pairs = neutral.light.map((s, index) => ({
      l: s.oklch.l,
      d: neutral.dark?.[index]?.oklch.l ?? null,
    }))
    const valid = pairs.filter(
      (p): p is { l: number; d: number } => p.d !== null,
    )
    if (valid.length) {
      darkSymmetry =
        valid.reduce((a, p) => a + Math.abs(p.l + p.d - 1), 0) / valid.length
    }
  }
  return {
    light,
    dark,
    darkSymmetry,
    statusCvdSeparation: statusCvdSeparation(system, 'deuteranopia'),
  }
}
