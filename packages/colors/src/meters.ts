/**
 * The meters (D2/D3): WCAG 2 (normative floor), APCA (perceptual target,
 * SAPC-4g constants — parity-tested against `apca-w3`), ΔEok, and Machado
 * CVD simulation. All operate on OKLCH via the space seam.
 */

import {
  converter,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  type Rgb,
} from 'culori'

import { type Oklch, relativeLuminance, toSrgb8 } from './space'

/** WCAG 2 contrast ratio (order-independent). */
export function wcag2(a: Oklch, b: Oklch): number {
  const ya = relativeLuminance(a)
  const yb = relativeLuminance(b)
  const [hi, lo] = ya > yb ? [ya, yb] : [yb, ya]
  return (hi + 0.05) / (lo + 0.05)
}

// APCA-W3 0.1.9 (SAPC-4g) — the verified constant set.
const SA98G = {
  mainTrc: 2.4,
  rco: 0.2126729,
  gco: 0.7151522,
  bco: 0.072175,
  normBg: 0.56,
  normTxt: 0.57,
  revTxt: 0.62,
  revBg: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scale: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,
}

function apcaY(color: Oklch): number {
  const [r, g, b] = toSrgb8(color)
  const { mainTrc, rco, gco, bco } = SA98G
  return (
    rco * (r / 255) ** mainTrc +
    gco * (g / 255) ** mainTrc +
    bco * (b / 255) ** mainTrc
  )
}

/**
 * APCA Lc of `text` on `background` (signed; negative for light-on-dark).
 * Use `Math.abs` when comparing against Lc bars.
 */
export function apca(text: Oklch, background: Oklch): number {
  const S = SA98G
  const soft = (y: number) =>
    y > S.blkThrs ? y : y + (S.blkThrs - y) ** S.blkClmp
  const txtY = soft(apcaY(text))
  const bgY = soft(apcaY(background))
  if (Math.abs(bgY - txtY) < S.deltaYmin) return 0
  if (bgY > txtY) {
    const sapc = (bgY ** S.normBg - txtY ** S.normTxt) * S.scale
    return (sapc < S.loClip ? 0 : sapc - S.loBoWoffset) * 100
  }
  const sapc = (bgY ** S.revBg - txtY ** S.revTxt) * S.scale
  return (sapc > -S.loClip ? 0 : sapc + S.loWoBoffset) * 100
}

const BLACK: Oklch = { l: 0, c: 0, h: 0 }
const WHITE_POLE: Oklch = { l: 1, c: 0, h: 0 }

/**
 * The physically achievable APCA ceiling on a background: no foreground can
 * exceed the better of the pure black/white poles. Lc bars are capped by it
 * (− 0.25 slack) — a dim canvas (L* 90) tops out near Lc 89, and demanding
 * 90 there would fail every possible text color.
 */
export function cappedLcBar(bar: number, background: Oklch): number {
  const ceiling = Math.max(
    Math.abs(apca(BLACK, background)),
    Math.abs(apca(WHITE_POLE, background)),
  )
  return Math.min(bar, ceiling - 0.25)
}

const toOklab = converter('oklab')

/** ΔEok — Euclidean distance in OKLab (raw 0–1 scale; JND ≈ 0.02). */
export function deltaEok(a: Oklch, b: Oklch): number {
  const la = toOklab({ mode: 'oklch', ...a })
  const lb = toOklab({ mode: 'oklch', ...b })
  return Math.hypot(
    la.l - lb.l,
    (la.a ?? 0) - (lb.a ?? 0),
    (la.b ?? 0) - (lb.b ?? 0),
  )
}

export type CvdKind = 'protan' | 'deutan' | 'tritan'
export const CVD_KINDS: CvdKind[] = ['protan', 'deutan', 'tritan']

const CVD_FILTERS: Record<CvdKind, (color: Rgb) => Rgb> = {
  protan: filterDeficiencyProt(1) as (color: Rgb) => Rgb,
  deutan: filterDeficiencyDeuter(1) as (color: Rgb) => Rgb,
  tritan: filterDeficiencyTrit(1) as (color: Rgb) => Rgb,
}

const toRgb = converter('rgb')
const toOklchConv = converter('oklch')

/** Simulate a color under a color-vision deficiency (Machado, severity 1). */
export function simulateCvd(color: Oklch, kind: CvdKind): Oklch {
  const filtered = CVD_FILTERS[kind](toRgb({ mode: 'oklch', ...color }))
  const { l = 0, c = 0, h = 0 } = toOklchConv(filtered)
  return { l, c, h }
}

/**
 * Min pairwise ΔEok of a palette under normal vision and each CVD condition.
 */
export function minPairwiseDeltaEok(colors: Oklch[]): {
  normal: number
  protan: number
  deutan: number
  tritan: number
} {
  const minOf = (set: Oklch[]) => {
    let min = Infinity
    for (let i = 0; i < set.length; i++)
      for (let j = i + 1; j < set.length; j++)
        min = Math.min(min, deltaEok(set[i]!, set[j]!))
    return min
  }
  const out = { normal: minOf(colors) } as ReturnType<
    typeof minPairwiseDeltaEok
  >
  for (const kind of CVD_KINDS)
    out[kind] = minOf(colors.map((c) => simulateCvd(c, kind)))
  return out
}
