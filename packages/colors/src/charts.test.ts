/**
 * Chart palettes (SPEC D11): categorical passes its CVD gate, sequential is
 * strictly L*-monotonic with perceptible neighbor steps, diverging pins its
 * midpoint to the surface neutral and deepens monotonically outward.
 */

import { describe, expect, test } from 'vitest'

import {
  categoricalGateReport,
  categoricalPalette,
  createTheme,
  deltaEok,
  divergingPalette,
  lstarOf,
  sequentialPalette,
  toHex,
  toOklch,
} from './index'

const HUES = [251, 30, 140]

describe.each(HUES)('accent hue %d', (hue) => {
  test('categorical palette of 8 passes the gate', () => {
    const report = categoricalGateReport(categoricalPalette(hue, 8))
    expect(report).toMatchObject({ passes: true })
  })

  test('sequential palette is strictly L*-monotonic with visible steps', () => {
    const palette = sequentialPalette(hue)
    const lstars = palette.map(lstarOf)
    for (let i = 1; i < palette.length; i++) {
      expect(lstars[i]!, `stop ${i}`).toBeLessThan(lstars[i - 1]!)
      expect(
        deltaEok(palette[i]!, palette[i - 1]!),
        `stop ${i}`,
      ).toBeGreaterThanOrEqual(0.02)
    }
  })

  test('diverging palette pins the neutral midpoint, arms deepen outward', () => {
    const theme = createTheme('#438cd6')
    const neutral100 = toOklch(theme.light.scales.neutral!['100'])
    const palette = divergingPalette(hue, neutral100)
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
