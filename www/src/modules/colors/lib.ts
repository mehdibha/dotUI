import { toOklch, wcag2 } from '@dotui/colors'

/** The legacy 11-step ladder the injection helpers still map onto. */
export const STEPS = [
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
export type Step = (typeof STEPS)[number]

/** OKLab coords (a/b from chroma·hue) for interpolation. */
function oklab(color: string): { L: number; a: number; b: number } {
  const { l, c, h } = toOklch(color)
  const rad = (h * Math.PI) / 180
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) }
}

function oklabToCss(p: { L: number; a: number; b: number }): string {
  const c = Math.hypot(p.a, p.b)
  const h = (Math.atan2(p.b, p.a) * 180) / Math.PI
  return `oklch(${p.L} ${c} ${(h + 360) % 360})`
}

function mixOklab(
  a: string,
  b: string,
  t: number,
): { L: number; a: number; b: number } {
  const x = oklab(a)
  const y = oklab(b)
  return {
    L: x.L + (y.L - x.L) * t,
    a: x.a + (y.a - x.a) * t,
    b: x.b + (y.b - x.b) * t,
  }
}

/**
 * Resample an ordered color list to the 11 `STEPS` by fractional position,
 * interpolating in OKLab.
 */
export function toElevenSteps(colors: string[]): Record<Step, string> {
  const out = {} as Record<Step, string>
  const n = colors.length
  if (n === 0) return out
  const at = (idx: number): string =>
    colors[Math.min(Math.max(idx, 0), n - 1)] ?? colors[0] ?? ''
  STEPS.forEach((step, i) => {
    const pos = (i / (STEPS.length - 1)) * (n - 1)
    const lo = at(Math.floor(pos))
    const hi = at(Math.ceil(pos))
    out[step] =
      lo === hi ? lo : oklabToCss(mixOklab(lo, hi, pos - Math.floor(pos)))
  })
  return out
}

/** Contrast-adequate black/white foreground for a swatch. */
export function readableFg(color: string): string {
  const swatch = toOklch(color)
  return wcag2(swatch, toOklch('#ffffff')) >= wcag2(swatch, toOklch('#000000'))
    ? '#ffffff'
    : '#000000'
}
