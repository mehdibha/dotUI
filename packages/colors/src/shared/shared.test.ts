import { describe, expect, it } from 'vitest'

import { isMonotonic } from '../test-utils'
import { computeAlphaColors } from './alpha'
import { apca, gamutMap, oklchCss, toOklch, toSrgb, wcag2 } from './color'
import { lightnessForSteps } from './curve'
import { onColor } from './on-color'
import { applyAnchoring } from './seed-anchor'

const S11 = [
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
]

describe('shared/color', () => {
  it('normalizes achromatic / NaN hue (no NaN in output) and formats valid oklch()', () => {
    expect(Number.isNaN(toOklch('#808080').h)).toBe(false)
    const s = oklchCss({ l: 0.5, c: 0.1, h: Number.NaN })
    expect(s).not.toMatch(/NaN/)
    expect(s).toMatch(/^oklch\(/)
  })

  it('gamutMap reduces a wide-gamut input into sRGB without collapsing chroma to ~0', () => {
    const m = gamutMap({ l: 0.85, c: 0.3, h: 130 })
    expect(m.c).toBeLessThan(0.3)
    expect(m.c).toBeGreaterThan(0.05)
  })

  it('contrast: wcag2 white/black ≈ 21; apca uses bg as receiver', () => {
    expect(wcag2('#fff', '#000')).toBeCloseTo(21, 0)
    expect(apca('#000', '#fff')).toBeGreaterThan(100)
  })
})

describe('shared/on-color', () => {
  it('dark bg → light fg; light bg → dark fg; returns a result object', () => {
    const onDark = onColor('oklch(0.16 0.02 260)')
    expect(toOklch(onDark.value).l).toBeGreaterThan(0.6)
    const onLight = onColor('oklch(0.98 0.01 260)')
    expect(toOklch(onLight.value).l).toBeLessThan(0.4)
    expect(onLight.meetsFloor).toBe(true)
    expect(onLight.pole).toMatch(/light|dark/)
  })

  it('mid-tone valley falls back to a pure pole and still clears 4.5', () => {
    expect(onColor('oklch(0.55 0.24 230)').ratio).toBeGreaterThanOrEqual(4.5)
  })
})

describe('shared/seed-anchor', () => {
  it('default discards seed lightness (array-driven)', () => {
    const ls = lightnessForSteps(11)
    expect(applyAnchoring(ls, S11, 0.3)).toEqual(ls)
    expect(applyAnchoring(ls, S11, 0.9)).toEqual(ls)
  })

  it('preserveSeedAt pins the seed lightness at the target step and stays monotonic', () => {
    const out = applyAnchoring(lightnessForSteps(11), S11, 0.62, '500')
    expect(out[5]).toBeCloseTo(0.62, 5)
    for (let i = 1; i < out.length; i++)
      expect(out[i]!).toBeLessThan(out[i - 1]!)
  })

  it('throws on a step name that is not in the scale (no silent no-op)', () => {
    expect(() =>
      applyAnchoring(lightnessForSteps(11), S11, 0.62, '5000'),
    ).toThrow(/preserveSeedAt "5000" is not one of the scale steps/)
  })
})

describe('shared/alpha', () => {
  it('composites over its design background back to the solid step (sRGB fidelity)', () => {
    const bg = '#ffffff'
    const solid = '#4477aa' // a mid blue, unambiguously in sRGB
    const value = computeAlphaColors({ '500': solid }, bg)['500']!
    expect(value).toMatch(/^oklch\(.+ \/ [\d.]+\)$/) // carries an alpha component
    const a = Number(/ \/ ([\d.]+)\)$/.exec(value)![1])
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThanOrEqual(1)

    const fg = toSrgb(value)
    const b = toSrgb(bg)
    const t = toSrgb(solid)
    for (const c of ['r', 'g', 'b'] as const)
      expect(a * fg[c] + (1 - a) * b[c]).toBeCloseTo(t[c], 2)
  })

  it('a step equal to its background is fully transparent', () => {
    expect(computeAlphaColors({ '50': '#ffffff' }, '#ffffff')['50']).toMatch(
      / \/ 0\)$/,
    )
  })
})

describe('test-utils/isMonotonic', () => {
  it('rejects flat/empty/short, accepts strict', () => {
    expect(isMonotonic([5, 5, 5])).toBe(false)
    expect(isMonotonic([])).toBe(false)
    expect(isMonotonic([1])).toBe(false)
    expect(isMonotonic([1, 1, 2, 3])).toBe(false)
    expect(isMonotonic([1, 2, 3])).toBe(true)
    expect(isMonotonic([3, 2, 1])).toBe(true)
  })
})
