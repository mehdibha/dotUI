/**
 * The color-space seam (D3). All conversions route through culori here; no
 * other module imports culori for color math. Working space is OKLCH; the
 * skeleton anchors in CIELAB-D65 L* via the Y bridge (L* depends only on
 * relative luminance, which is what WCAG meters — that is the whole point).
 */

import { converter, formatHex, type Oklch as CuloriOklch, parse } from 'culori'

export interface Oklch {
  l: number
  c: number
  h: number
}

const toOklchConv = converter('oklch')
const toRgbConv = converter('rgb')

/** Parse any CSS color into OKLCH (throws on unparsable input). */
export function toOklch(color: string): Oklch {
  const parsed = parse(color)
  if (!parsed) throw new Error(`@dotui/colors: unparsable color "${color}"`)
  const { l = 0, c = 0, h = 0 } = toOklchConv(parsed) as CuloriOklch
  return { l, c, h }
}

function asCulori(color: Oklch): CuloriOklch {
  return { mode: 'oklch', l: color.l, c: color.c, h: color.h }
}

/** 8-bit sRGB channels of an (in-gamut) OKLCH color. */
export function toSrgb8(color: Oklch): [number, number, number] {
  const { r, g, b } = toRgbConv(asCulori(color))
  const clamp8 = (v: number) => Math.min(255, Math.max(0, Math.round(v * 255)))
  return [clamp8(r), clamp8(g), clamp8(b)]
}

export function toHex(color: Oklch): string {
  return formatHex(asCulori(color))
}

/** Serialize as a CSS `oklch()` literal (the emission format, D12). */
export function oklchCss({ l, c, h }: Oklch): string {
  const round = (v: number, p: number) => {
    const f = 10 ** p
    return Math.round(v * f) / f
  }
  return `oklch(${round(l, 4)} ${round(c, 4)} ${round(h, 2)})`
}

const EPSILON = 1e-6

function inSrgb(color: Oklch): boolean {
  const { r, g, b } = toRgbConv(asCulori(color))
  return (
    r >= -EPSILON &&
    r <= 1 + EPSILON &&
    g >= -EPSILON &&
    g <= 1 + EPSILON &&
    b >= -EPSILON &&
    b <= 1 + EPSILON
  )
}

/**
 * Gamut-map to sRGB by constant-L/H chroma reduction (CSS Color 4 style).
 * Browsers must never see an out-of-gamut literal (D3).
 */
export function fitSrgb(color: Oklch): Oklch {
  if (color.l <= 0) return { l: 0, c: 0, h: color.h }
  if (color.l >= 1) return { l: 1, c: 0, h: color.h }
  if (inSrgb(color)) return color
  let lo = 0
  let hi = color.c
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb({ ...color, c: mid })) lo = mid
    else hi = mid
  }
  return { ...color, c: lo }
}

/** Max in-gamut sRGB chroma at a given OKLCH (l, h). */
export function maxChroma(l: number, h: number): number {
  return fitSrgb({ l, c: 0.5, h }).c
}

/**
 * The sRGB gamut cusp for a hue: the (l, c) maximizing chroma. Coarse scan +
 * ternary refinement (chroma-vs-L at fixed hue is unimodal).
 */
export function cusp(h: number): { l: number; c: number } {
  let bestL = 0.5
  let bestC = 0
  for (let l = 0.05; l <= 0.95; l += 0.05) {
    const c = maxChroma(l, h)
    if (c > bestC) {
      bestC = c
      bestL = l
    }
  }
  let lo = Math.max(0.01, bestL - 0.05)
  let hi = Math.min(0.99, bestL + 0.05)
  for (let i = 0; i < 24; i++) {
    const m1 = lo + (hi - lo) / 3
    const m2 = hi - (hi - lo) / 3
    if (maxChroma(m1, h) < maxChroma(m2, h)) lo = m1
    else hi = m2
  }
  const l = (lo + hi) / 2
  return { l, c: maxChroma(l, h) }
}

// ---- the L* / luminance bridge (D3, D4) ----

const KAPPA = 903.2962962
const CB_EPSILON = 0.0088564516

/** CIE L* → relative luminance Y (D65). */
export function yFromLstar(lstar: number): number {
  return lstar > 8 ? ((lstar + 16) / 116) ** 3 : lstar / KAPPA
}

/** Relative luminance Y → CIE L*. */
export function lstarFromY(y: number): number {
  return y > CB_EPSILON ? 116 * Math.cbrt(y) - 16 : y * KAPPA
}

function linearize(channel8: number): number {
  const c = channel8 / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance of an OKLCH color (computed on 8-bit sRGB). */
export function relativeLuminance(color: Oklch): number {
  const [r, g, b] = toSrgb8(color)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** CIELAB-D65 L* of an OKLCH color (via the Y bridge). */
export function lstarOf(color: Oklch): number {
  return lstarFromY(relativeLuminance(color))
}

/**
 * Solve the OKLCH lightness that lands a color on a target L*, with chroma
 * and hue supplied as functions of the candidate L (they may bend with L).
 * The result is gamut-mapped; the target is evaluated on the mapped color.
 */
export function solveLstar(
  targetLstar: number,
  chromaAt: (l: number) => number,
  hueAt: (l: number) => number,
): Oklch {
  let lo = 0
  let hi = 1
  let out: Oklch = { l: 0.5, c: 0, h: 0 }
  for (let i = 0; i < 28; i++) {
    const l = (lo + hi) / 2
    const h = hueAt(l)
    out = fitSrgb({ l, c: chromaAt(l), h })
    if (lstarOf(out) < targetLstar) lo = l
    else hi = l
  }
  return out
}
