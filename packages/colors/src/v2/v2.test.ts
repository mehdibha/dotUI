import Color from 'colorjs.io'
import { describe, expect, it } from 'vitest'

import { toHex, toOklch, wcag2 } from '../shared/color'
import { inGamut, isMonotonic } from '../test-utils'
import {
  DARK_TARGETS,
  LIGHT_TARGETS,
  MAX_HUE_DRIFT,
  SOLID_STEP,
  solveScale,
  V2_STEPS,
  type V2Step,
} from './index'

const SEEDS: Record<string, string> = {
  blue: '#2b7fff',
  red: '#ef4444',
  yellow: '#eab308', // cusp stress case
  violet: '#635bff', // muted brand
  gray: '#6b7280',
}

const MODES = ['light', 'dark'] as const

/** Steps whose contrast target the preserved-seed monotonic clamp may pull off. */
const CLAMP_EXEMPT = new Set<V2Step>([SOLID_STEP, '400', '600'])

function rampLs(steps: Record<V2Step, string>): number[] {
  return V2_STEPS.map((s) => toOklch(steps[s]).l)
}

/** Signed hue delta in [-180, 180]. */
function hueDelta(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180
}

describe('v2/solveScale — property tests', () => {
  for (const [name, seed] of Object.entries(SEEDS)) {
    for (const mode of MODES) {
      const neutral = name === 'gray'
      const label = `${name} / ${mode}`

      it(`${label}: monotonic lightness (${mode === 'dark' ? 'increasing' : 'decreasing'})`, () => {
        const { steps } = solveScale({ seed, mode, neutral })
        expect(isMonotonic(rampLs(steps))).toBe(true)
      })

      it(`${label}: every step in sRGB gamut`, () => {
        const { steps } = solveScale({ seed, mode, neutral })
        for (const step of V2_STEPS) expect(inGamut(steps[step])).toBe(true)
      })

      it(`${label}: hue drift within the bound`, () => {
        if (neutral) return // hue is meaningless for a near-achromatic seed
        const { steps } = solveScale({ seed, mode, neutral })
        const seedH = toOklch(seed).h
        for (const step of V2_STEPS) {
          const { c, h } = toOklch(steps[step])
          if (c < 0.01) continue // achromatic step has no meaningful hue
          expect(Math.abs(hueDelta(h, seedH))).toBeLessThanOrEqual(
            MAX_HUE_DRIFT,
          )
        }
      })

      it(`${label}: achieved contrast within ±12% of target (except solid/clamped)`, () => {
        const targets = mode === 'dark' ? DARK_TARGETS : LIGHT_TARGETS
        const { achieved } = solveScale({ seed, mode, neutral })
        for (const step of V2_STEPS) {
          if (CLAMP_EXEMPT.has(step)) continue
          const rel = Math.abs(achieved[step] - targets[step]) / targets[step]
          expect(rel).toBeLessThanOrEqual(0.12)
        }
      })
    }

    it(`${name}: seed appears verbatim at the solid step (preserveSeed)`, () => {
      const { steps } = solveScale({
        seed,
        mode: 'light',
        neutral: name === 'gray',
      })
      expect(steps[SOLID_STEP]).toBe(toHex(seed))
    })
  }

  it('achieved is reported for every step', () => {
    const { achieved } = solveScale({ seed: SEEDS.blue!, mode: 'light' })
    for (const step of V2_STEPS) expect(achieved[step]).toBeGreaterThan(0)
  })

  it('preserveSeed:false does not pin the seed at the solid step', () => {
    const { steps } = solveScale({
      seed: SEEDS.yellow!, // outlier seed → solved 500 differs from the seed
      mode: 'light',
      preserveSeed: false,
    })
    expect(steps[SOLID_STEP]).not.toBe(toHex(SEEDS.yellow!))
  })

  it('contrast foreground clears the 4.5 floor against the solid step', () => {
    for (const [name, seed] of Object.entries(SEEDS)) {
      for (const mode of MODES) {
        const { steps, contrast } = solveScale({
          seed,
          mode,
          neutral: name === 'gray',
        })
        expect(wcag2(contrast, steps[SOLID_STEP])).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('dark ramp is not the reversed light ramp', () => {
    const light = solveScale({ seed: SEEDS.blue!, mode: 'light' })
    const dark = solveScale({ seed: SEEDS.blue!, mode: 'dark' })
    const lightLs = rampLs(light.steps)
    const darkLs = rampLs(dark.steps)
    const reversed = [...lightLs].reverse()
    const maxDiff = Math.max(
      ...darkLs.map((l, i) => Math.abs(l - reversed[i]!)),
    )
    expect(maxDiff).toBeGreaterThan(0.05)
  })
})

describe('v2/solveScale — golden direction', () => {
  const TW_BLUE: Record<V2Step, string> = {
    '50': 'oklch(97% 0.014 254.604)',
    '100': 'oklch(93.2% 0.032 255.585)',
    '200': 'oklch(88.2% 0.059 254.128)',
    '300': 'oklch(80.9% 0.105 251.813)',
    '400': 'oklch(70.7% 0.165 254.624)',
    '500': 'oklch(62.3% 0.214 259.815)',
    '600': 'oklch(54.6% 0.245 262.881)',
    '700': 'oklch(48.8% 0.243 264.376)',
    '800': 'oklch(42.4% 0.199 265.638)',
    '900': 'oklch(37.9% 0.146 265.522)',
    '950': 'oklch(28.2% 0.091 267.935)',
  }

  it('Tailwind blue-500 seed → mean OKLab ΔE < 0.09 vs Tailwind blue', () => {
    const { steps } = solveScale({
      seed: 'oklch(62.3% 0.214 259.815)',
      mode: 'light',
    })
    let sum = 0
    for (const step of V2_STEPS) {
      const a = new Color(steps[step]).to('oklab').coords
      const b = new Color(TW_BLUE[step]).to('oklab').coords
      sum += Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!)
    }
    const meanDeltaE = sum / V2_STEPS.length
    expect(meanDeltaE).toBeLessThan(0.09)
  })
})
