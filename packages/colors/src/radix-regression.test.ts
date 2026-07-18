/**
 * Radix regression bar (SPEC verification corpus): seeding with Radix blue-9
 * must reproduce the Radix blue light scale closely — our 12 jobs mapped to
 * Radix steps 1..12 in order. Measured on this engine: mean ΔEok ≈ 0.011,
 * max ≈ 0.038 (step 11 — we solve text to stricter bars than Radix ships).
 */

import { blue } from '@radix-ui/colors'
import { expect, test } from 'vitest'

import { createTheme, deltaEok, STEPS, toOklch } from './index'

test('a blue-9 seed regenerates the Radix blue scale within the bar', () => {
  const theme = createTheme(blue.blue9)
  const deltas = STEPS.map((step, i) =>
    deltaEok(
      toOklch(theme.light.scales.accent![step]),
      toOklch(blue[`blue${i + 1}` as keyof typeof blue]),
    ),
  )
  const mean = deltas.reduce((sum, d) => sum + d, 0) / deltas.length
  expect(mean).toBeLessThan(0.09)
  expect(Math.max(...deltas)).toBeLessThan(0.2)
})
