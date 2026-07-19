/**
 * Chart palettes (SPEC D11): categorical passes its CVD gate in both modes
 * and keeps its series clear of muddy hue-lightness pairings; sequential is
 * strictly L*-monotonic away from the mode's surface with perceptible
 * neighbor steps; diverging pins its midpoint to the surface neutral and
 * deepens monotonically outward.
 */

import { describe, expect, test } from 'vitest'

import {
  categoricalGateReport,
  categoricalPalette,
  createTheme,
  cusp,
  deltaEok,
  divergingPalette,
  lstarOf,
  type Oklch,
  sequentialPalette,
  toHex,
  tonalCategoricalPalette,
  tonalGateReport,
  toOklch,
} from './index'

const ACCENTS: Oklch[] = [
  { l: 0.63, c: 0.13, h: 251 },
  { l: 0.66, c: 0.19, h: 30 },
  { l: 0.62, c: 0.19, h: 140 },
]

describe.each(ACCENTS)('accent oklch($l $c $h)', (accent) => {
  test.each(['light', 'dark'] as const)(
    'categorical palette of 8 passes the gate (%s)',
    (mode) => {
      const report = categoricalGateReport(categoricalPalette(accent, 8, mode))
      expect(report).toMatchObject({ passes: true })
    },
  )

  test('categorical series avoid muddy and washed picks', () => {
    for (const mode of ['light', 'dark'] as const) {
      for (const color of categoricalPalette(accent, 8, mode)) {
        const h = ((color.h % 360) + 360) % 360
        // Warm-yellow hues stay on light rungs (dark yellow = olive).
        if (h >= 75 && h < 135)
          expect(
            lstarOf(color),
            `hue ${h.toFixed(0)} in ${mode}`,
          ).toBeGreaterThanOrEqual(56)
        // Nothing washed: achieved chroma stays a real fraction of the cusp.
        expect(
          color.c / cusp(color.h).c,
          `hue ${h.toFixed(0)} in ${mode}`,
        ).toBeGreaterThanOrEqual(0.38)
      }
    }
  })

  test('sequential palette is strictly monotonic away from the surface', () => {
    for (const mode of ['light', 'dark'] as const) {
      const palette = sequentialPalette(accent.h, 7, mode)
      const lstars = palette.map(lstarOf)
      for (let i = 1; i < palette.length; i++) {
        if (mode === 'light')
          expect(lstars[i]!, `stop ${i}`).toBeLessThan(lstars[i - 1]!)
        else expect(lstars[i]!, `stop ${i}`).toBeGreaterThan(lstars[i - 1]!)
        expect(
          deltaEok(palette[i]!, palette[i - 1]!),
          `stop ${i}`,
        ).toBeGreaterThanOrEqual(0.02)
      }
    }
  })

  test('diverging palette pins the neutral midpoint, arms deepen outward', () => {
    const theme = createTheme('#438cd6')
    const neutral100 = toOklch(theme.light.scales.neutral!['100'])
    const palette = divergingPalette(accent.h, neutral100)
    expect(palette).toHaveLength(7)

    const mid = 3
    expect(toHex(palette[mid]!)).toBe(toHex(neutral100))

    const lstars = palette.map(lstarOf)
    // Left arm: L* rises toward the midpoint; right arm: falls away from it.
    for (let i = 0; i < mid; i++)
      expect(lstars[i]!, `left stop ${i}`).toBeLessThan(lstars[i + 1]!)
    for (let i = mid; i < palette.length - 1; i++)
      expect(lstars[i]!, `right stop ${i}`).toBeGreaterThan(lstars[i + 1]!)
  })
})

test('the brand series keeps the accent character (yellow stays yellow)', () => {
  const yellow = toOklch('#eab308')
  for (const mode of ['light', 'dark'] as const) {
    const [first] = categoricalPalette(yellow, 8, mode)
    expect(Math.abs(first!.h - yellow.h)).toBeLessThan(1)
    // The slot-1 rung snaps to the accent's own lightness region — never mustard.
    expect(lstarOf(first!)).toBeGreaterThanOrEqual(70)
  }
})

test('per-mode palettes differ and the dark set rides a lighter ladder', () => {
  const theme = createTheme('#438cd6')
  expect(theme.charts.dark.categorical).not.toEqual(
    theme.charts.light.categorical,
  )
  const min = (set: string[]) =>
    Math.min(...set.map((c) => lstarOf(toOklch(c))))
  expect(min(theme.charts.dark.categorical)).toBeGreaterThan(
    min(theme.charts.light.categorical),
  )
})

describe('brand-tonal categorical (the default — shadcn parity)', () => {
  test.each(['light', 'dark'] as const)(
    'shades of the accent, lightest first, readable steps (%s)',
    (mode) => {
      const accent = toOklch('#438cd6')
      const palette = tonalCategoricalPalette(accent, 8, mode)
      expect(tonalGateReport(palette)).toMatchObject({ passes: true })
      // Every series stays in the accent's hue family (ramp bend allowed).
      for (const color of palette) {
        const gap = Math.abs(((color.h - accent.h + 540) % 360) - 180)
        expect(gap, `L* ${lstarOf(color).toFixed(0)}`).toBeLessThan(35)
      }
    },
  )

  test('the theme ships the tonal palette', () => {
    const theme = createTheme('#438cd6')
    const accent = toOklch('#438cd6')
    for (const css of theme.charts.light.categorical) {
      const gap = Math.abs(((toOklch(css).h - accent.h + 540) % 360) - 180)
      expect(gap).toBeLessThan(35)
    }
  })

  test('a muted brand yields muted charts (seed chroma is authoritative)', () => {
    const muted = { l: 0.6, c: 0.05, h: 251 }
    for (const color of tonalCategoricalPalette(muted, 8, 'light'))
      expect(color.c).toBeLessThanOrEqual(0.05 + 1e-6)
  })
})
