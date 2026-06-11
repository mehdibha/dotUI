import Color from 'colorjs.io'

import { toOklch, wcag2 } from './shared/color'
import type { ColorScale, Theme } from './shared/types'

/**
 * Within (or within a JND of) the sRGB gamut. The CSS Color 4 gamut method maps to
 * within a just-noticeable-difference, so a value can sit marginally outside sRGB —
 * that's browser-safe for `oklch()` (the UA gamut-maps to the display). The epsilon
 * tolerates that JND while still catching grossly out-of-gamut output.
 */
export function inGamut(value: string, epsilon = 0.02): boolean {
  return new Color(value).inGamut('srgb', { epsilon })
}

/** OKLCH lightness of each step, in scale order. */
export function rampLs(scale: ColorScale): number[] {
  return Object.values(scale).map((v) => toOklch(v).l)
}

/** OKLCH chroma of each step, in scale order. */
export function rampCs(scale: ColorScale): number[] {
  return Object.values(scale).map((v) => toOklch(v).c)
}

/** Strictly monotonic (and at least 2 entries) — a flat or empty ramp is not "clean". */
export function isMonotonic(nums: number[]): boolean {
  if (nums.length < 2) return false
  let inc = true
  let dec = true
  for (let i = 1; i < nums.length; i++) {
    if (nums[i]! <= nums[i - 1]!) inc = false
    if (nums[i]! >= nums[i - 1]!) dec = false
  }
  return inc || dec
}

/** Worst-case WCAG2 contrast of every on-* against its step, across all modes/palettes. */
export function worstOnContrast(theme: Theme): number {
  let worst = Number.POSITIVE_INFINITY
  for (const mode of Object.values(theme)) {
    for (const [palette, scale] of Object.entries(mode.scales)) {
      const on = mode.on[palette]
      if (!on) continue
      for (const step of Object.keys(scale)) {
        if (on[step] && scale[step])
          worst = Math.min(worst, wcag2(on[step]!, scale[step]!))
      }
    }
  }
  return worst
}

export function allValues(theme: Theme): string[] {
  const out: string[] = []
  for (const mode of Object.values(theme)) {
    for (const scale of Object.values(mode.scales))
      out.push(...Object.values(scale))
    for (const on of Object.values(mode.on)) out.push(...Object.values(on))
  }
  return out
}
