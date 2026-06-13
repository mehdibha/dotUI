/**
 * Alpha (transparency) ramps — the Radix-style translucent twin of a solid ramp.
 *
 * For each solid step, solve the inverse alpha-compositing problem: find a foreground
 * color `Cf` and alpha `a` such that `a·Cf + (1-a)·bg = step`, i.e. the translucent
 * color reproduces the solid step when laid over the mode background — but adapts when
 * laid over other surfaces (cards, images, overlays). Computed in sRGB (the space the
 * browser composites in) and emitted as `oklch(L C H / a)`, keeping dotUI's oklch-native
 * output. The alpha that reproduces the step exactly on an sRGB display is close (not
 * exact) on a P3 display — a dedicated wide-gamut alpha definition is a follow-up.
 */

import { gamutMap, oklchCss, oklchFromSrgb, toSrgb } from './color'
import type { ColorScale } from './types'

type Srgb = { r: number; g: number; b: number }

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x))

/**
 * Minimal-alpha foreground that composites to `target` over `bg` (per channel, sRGB).
 * The binding channel hits its bound (0 if it darkens, 1 if it lightens), which is the
 * least-opaque solution keeping `Cf` in [0,1]³.
 */
function alphaOver(target: Srgb, bg: Srgb): { rgb: Srgb; a: number } {
  const t = { r: clamp01(target.r), g: clamp01(target.g), b: clamp01(target.b) }
  const b = { r: clamp01(bg.r), g: clamp01(bg.g), b: clamp01(bg.b) }
  let a = 0
  for (const c of ['r', 'g', 'b'] as const) {
    if (t[c] === b[c]) continue
    const bound = t[c] < b[c] ? 0 : 1 // foreground channel that minimizes alpha
    a = Math.max(a, (t[c] - b[c]) / (bound - b[c]))
  }
  a = clamp01(a)
  if (a === 0) return { rgb: b, a: 0 } // target == bg → fully transparent
  const un = (tc: number, bc: number): number =>
    clamp01((tc - bc * (1 - a)) / a)
  return { rgb: { r: un(t.r, b.r), g: un(t.g, b.g), b: un(t.b, b.b) }, a }
}

/** Build the `oklch(L C H / a)` alpha ramp for `scale`, designed against `background`. */
export function computeAlphaColors(
  scale: ColorScale,
  background: string,
): ColorScale {
  const bg = toSrgb(background)
  const alpha: ColorScale = {}
  for (const [step, value] of Object.entries(scale)) {
    const { rgb, a } = alphaOver(toSrgb(value), bg)
    alpha[step] = oklchCss(gamutMap(oklchFromSrgb(rgb)), a)
  }
  return alpha
}
