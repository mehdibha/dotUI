/**
 * createTheme invariants (SPEC D1/D2/D4/D7/D8/D9/D12): the whole-system
 * checks — job ladder, skeleton adherence, guarantee audit, seed intake,
 * neutrals, backgrounds, and the yellow solid-label policy.
 */

import { describe, expect, test } from 'vitest'

import {
  DARK_MIN_BG_SEPARATION,
  DARK_SKELETON,
  LIGHT_SKELETON,
  LIGHT_SKELETON_NEUTRAL,
  SOLID_LSTAR_WINDOW,
} from './data'
import { createTheme, fitSrgb, lstarOf, STEPS, toHex, toOklch } from './index'

const CORE_SCALES = [
  'neutral',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
]
const SKELETON_STEPS = STEPS.slice(0, 8)

const defaultTheme = createTheme('#438cd6')

describe('default theme', () => {
  test('all guarantees hold, no warnings', () => {
    expect(defaultTheme.report.ok).toBe(true)
    expect(defaultTheme.report.warnings).toEqual([])
  })

  test('is deterministic', () => {
    expect(createTheme('#438cd6')).toEqual(createTheme('#438cd6'))
  })

  test('every scale has exactly the 12 job steps', () => {
    for (const mode of ['light', 'dark'] as const) {
      const scales = defaultTheme[mode].scales
      for (const name of CORE_SCALES)
        expect(Object.keys(scales)).toContain(name)
      for (const [name, scale] of Object.entries(scales)) {
        expect(Object.keys(scale), `${name}/${mode}`).toEqual([...STEPS])
        expect(Object.keys(defaultTheme[mode].alphas[name]!)).toEqual([
          ...STEPS,
        ])
      }
    }
  })

  test('jobs 1-8 are L-monotonic per mode', () => {
    for (const mode of ['light', 'dark'] as const) {
      for (const [name, scale] of Object.entries(defaultTheme[mode].scales)) {
        const ls = SKELETON_STEPS.map((s) => toOklch(scale[s]).l)
        for (let i = 1; i < ls.length; i++) {
          const ordered =
            mode === 'light' ? ls[i]! < ls[i - 1]! : ls[i]! > ls[i - 1]!
          expect(
            ordered,
            `${name}/${mode} ${SKELETON_STEPS[i - 1]}→${SKELETON_STEPS[i]}`,
          ).toBe(true)
        }
      }
    }
  })

  test('jobs 1-8 sit on the L* skeletons (±0.7)', () => {
    const rows = [
      { scale: defaultTheme.light.scales.accent!, skeleton: LIGHT_SKELETON },
      {
        scale: defaultTheme.light.scales.neutral!,
        skeleton: LIGHT_SKELETON_NEUTRAL,
      },
      { scale: defaultTheme.dark.scales.accent!, skeleton: DARK_SKELETON },
      { scale: defaultTheme.dark.scales.neutral!, skeleton: DARK_SKELETON },
    ]
    for (const { scale, skeleton } of rows) {
      SKELETON_STEPS.forEach((step, i) => {
        const lstar = lstarOf(toOklch(scale[step]))
        expect(
          Math.abs(lstar - skeleton[i]!),
          `step ${step}`,
        ).toBeLessThanOrEqual(0.7)
      })
    }
  })

  test('guarantee audit: every reported guarantee passes', () => {
    for (const g of defaultTheme.report.guarantees)
      expect(
        g.passes,
        `${g.scale}/${g.mode} ${g.name} (${g.fg} on ${g.bg})`,
      ).toBe(true)
  })

  test('dark surfaces: neutral 25 near L* 6, distinct from 50 in sRGB', () => {
    const bg25 = toOklch(defaultTheme.dark.scales.neutral!['25'])
    const lstar = lstarOf(bg25)
    expect(lstar).toBeGreaterThanOrEqual(5.0)
    expect(lstar).toBeLessThanOrEqual(7.0)
    expect(toHex(bg25)).not.toBe(
      toHex(toOklch(defaultTheme.dark.scales.neutral!['50'])),
    )
  })

  test('second createTheme call stays under 3s (generous CI bound)', () => {
    const start = Date.now()
    createTheme('#635bff')
    expect(Date.now() - start).toBeLessThan(3000)
  })
})

describe('property sweep', () => {
  test('seeds at every 30° of hue generate clean systems', () => {
    for (let h = 0; h < 360; h += 30) {
      const seed = toHex(fitSrgb({ l: 0.55, c: 0.15, h }))
      const theme = createTheme(seed)
      expect(theme.report.ok, `hue ${h} (${seed})`).toBe(true)
      const offenders = theme.report.warnings.filter(
        (w) => w.includes('on-solid') || w.includes('text'),
      )
      expect(offenders, `hue ${h} (${seed})`).toEqual([])
    }
  })

  test('edge seeds generate without throwing', () => {
    for (const seed of [
      '#ffffff',
      '#000000',
      '#808080',
      'oklch(0.7 0.4 200)',
    ]) {
      const theme = createTheme(seed)
      expect(theme.report.ok, `seed ${seed}`).toBe(true)
    }
  })
})

describe('achromatic seeds (D7)', () => {
  test('achromatic accents ride the neutral model, never a vivid ramp', () => {
    for (const seed of ['#808080', '#000000', '#ffffff']) {
      const theme = createTheme(seed)
      expect(theme.report.ok, seed).toBe(true)
      for (const mode of ['light', 'dark'] as const) {
        for (const step of STEPS) {
          const c = toOklch(theme[mode].scales.accent![step]).c
          expect(c, `${seed}/${mode} ${step}`).toBeLessThanOrEqual(0.02)
        }
        for (const step of ['700', '800'] as const)
          expect(
            toOklch(theme[mode].scales.accent![step]).c,
            `${seed}/${mode} solid ${step}`,
          ).toBeLessThanOrEqual(0.005)
      }
    }
  })

  test('an achromatic accent keeps the neutral scale pure gray', () => {
    const theme = createTheme('#808080')
    for (const mode of ['light', 'dark'] as const)
      for (const step of STEPS)
        expect(toOklch(theme[mode].scales.neutral![step]).c).toBe(0)
  })
})

describe('solid slotting (D7)', () => {
  test('the default seed anchors the solid at its own lightness (no clamp)', () => {
    const seedLstar = lstarOf(toOklch('#438cd6'))
    const solidLstar = lstarOf(
      toOklch(defaultTheme.light.scales.accent!['700']),
    )
    expect(Math.abs(solidLstar - seedLstar)).toBeLessThan(1)
    expect(defaultTheme.report.seedDelta.accent).toBeLessThan(0.03)
  })

  test('near-white and near-black seeds clamp into the solid job window', () => {
    for (const seed of ['#fffde7', '#0a0a0a']) {
      const theme = createTheme(seed)
      expect(theme.report.ok, seed).toBe(true)
      const solidLstar = lstarOf(toOklch(theme.light.scales.accent!['700']))
      // ±0.5 slack: emitted values pass through 8-bit sRGB quantization.
      expect(solidLstar, seed).toBeGreaterThanOrEqual(
        SOLID_LSTAR_WINDOW.min - 0.5,
      )
      expect(solidLstar, seed).toBeLessThanOrEqual(SOLID_LSTAR_WINDOW.max + 0.5)
      expect(
        theme.report.warnings.some((w) => w.includes('solid job window')),
        seed,
      ).toBe(true)
      // The clamp must not disturb the surface ladder (jobs 1-8).
      for (const mode of ['light', 'dark'] as const) {
        const ls = SKELETON_STEPS.map(
          (s) => toOklch(theme[mode].scales.accent![s]).l,
        )
        for (let i = 1; i < ls.length; i++)
          expect(
            mode === 'light' ? ls[i]! < ls[i - 1]! : ls[i]! > ls[i - 1]!,
            `${seed}/${mode} step ${i}`,
          ).toBe(true)
      }
      // on-700 still clears its solved bars (part of report.ok, asserted here
      // explicitly against the WCAG 3.0 UI floor).
      const onSolid = theme.report.guarantees.filter(
        (g) => g.scale === 'accent' && g.name === 'on-solid',
      )
      expect(onSolid.length, seed).toBeGreaterThan(0)
      for (const g of onSolid) expect(g.passes, `${seed} ${g.fg}`).toBe(true)
    }
  })

  test('a moved seed is priced with a snap-bound warning', () => {
    const theme = createTheme({
      seeds: { accent: '#438cd6', success: '#6ac48c' },
    })
    expect(
      theme.report.warnings.some(
        (w) => w.startsWith('success:') && w.includes('snap bound'),
      ),
    ).toBe(true)
  })
})

describe('neutrals (D8)', () => {
  test('every neutral step stays under the whisper ceiling (C ≤ 0.02)', () => {
    for (const mode of ['light', 'dark'] as const)
      for (const step of STEPS) {
        const c = toOklch(defaultTheme[mode].scales.neutral![step]).c
        expect(c, `neutral/${mode} ${step}`).toBeLessThanOrEqual(0.02)
      }
  })

  test('neutralTint 0 yields a pure gray at every step', () => {
    const theme = createTheme({ seeds: { accent: '#438cd6' }, neutralTint: 0 })
    for (const mode of ['light', 'dark'] as const)
      for (const step of STEPS)
        expect(toOklch(theme[mode].scales.neutral![step]).c).toBe(0)
  })
})

describe('seed intake (D7)', () => {
  test('preserveSeed pins the accent verbatim at the solid step', () => {
    const theme = createTheme({
      seeds: { accent: '#eab308' },
      preserveSeed: true,
    })
    expect(toHex(toOklch(theme.light.scales.accent!['700']))).toBe('#eab308')
  })

  test('without preserveSeed the snap price is priced under the bound', () => {
    const theme = createTheme({ seeds: { accent: '#eab308' } })
    expect(theme.report.seedDelta.accent).toBeLessThan(0.12)
  })
})

describe('backgrounds (D9/D12)', () => {
  test("dark 'oled' drops the floor to black", () => {
    const theme = createTheme({
      seeds: { accent: '#438cd6' },
      background: { dark: 'oled' },
    })
    expect(lstarOf(toOklch(theme.dark.scales.neutral!['25']))).toBeLessThan(1)
  })

  test('light 97 moves the app background to L* 97', () => {
    const theme = createTheme({
      seeds: { accent: '#438cd6' },
      background: { light: 97 },
    })
    const lstar = lstarOf(toOklch(theme.light.scales.neutral!['25']))
    expect(Math.abs(lstar - 97)).toBeLessThanOrEqual(0.7)
  })

  test('slider extremes compress the ladder without inverting it', () => {
    // Light floor (90) and a dim dark (18): the transposition must keep every
    // guarantee and the surface ordering (an eased offset inverts light ≲93).
    for (const background of [
      { light: 90 },
      { dark: 18 },
      { light: 90, dark: 18 },
    ] as const) {
      const theme = createTheme({ seeds: { accent: '#438cd6' }, background })
      expect(theme.report.ok).toBe(true)
      expect(theme.report.warnings).toEqual([])
    }
    const dim = createTheme({
      seeds: { accent: '#438cd6' },
      background: { light: 90 },
    })
    const bg = lstarOf(toOklch(dim.light.scales.neutral!['25']))
    expect(Math.abs(bg - 90)).toBeLessThanOrEqual(0.7)
  })

  test('the full schema range keeps every guarantee and a monotonic ladder', () => {
    const lights = [90, 92, 94, 96, 98, 99, 100]
    const darks = [0, 2.5, 6, 10, 14, 18, 20, 'oled'] as const
    for (const light of lights) {
      const theme = createTheme({
        seeds: { accent: '#438cd6' },
        background: { light },
      })
      expect(theme.report.ok, `light ${light}`).toBe(true)
      expect(theme.report.warnings, `light ${light}`).toEqual([])
    }
    for (const dark of darks) {
      const theme = createTheme({
        seeds: { accent: '#438cd6' },
        background: { dark },
      })
      expect(theme.report.ok, `dark ${dark}`).toBe(true)
      expect(theme.report.warnings, `dark ${dark}`).toEqual([])
      const gap =
        lstarOf(toOklch(theme.dark.scales.neutral!['50'])) -
        lstarOf(toOklch(theme.dark.scales.neutral!['25']))
      // Steps snap to 8-bit sRGB (±½ step each ≈ ±0.3 L* near L* 20), so the
      // continuous 2.5 floor can render up to one full step shorter.
      expect(gap, `dark ${dark} 25→50 separation`).toBeGreaterThanOrEqual(
        DARK_MIN_BG_SEPARATION - 0.65,
      )
      expect(
        theme.dark.scales.neutral!['50'],
        `dark ${dark} 25/50 render distinct`,
      ).not.toBe(theme.dark.scales.neutral!['25'])
    }
  })
})

describe('yellow policy (D2)', () => {
  test('yellow solids keep the seed lightness and take a dark label', () => {
    const theme = createTheme({ seeds: { accent: '#eab308' } })
    const on = toOklch(theme.light.on.accent!['700'])
    expect(on.l).toBeLessThan(0.5)
    const seedLstar = lstarOf(toOklch('#eab308'))
    const solidLstar = lstarOf(toOklch(theme.light.scales.accent!['700']))
    expect(Math.abs(solidLstar - seedLstar)).toBeLessThan(3)
  })
})
