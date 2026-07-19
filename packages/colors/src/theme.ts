/**
 * `createTheme` (D12): one seed in, a complete correct system out — both
 * modes × {accent, neutral, status} × 12 steps + on-* + alpha twins + chart
 * palettes, all guarantees enforced in-loop and audited in the report.
 */

import { z } from 'zod'

import { alphaTwin } from './alpha'
import {
  divergingPalette,
  sequentialPalette,
  tonalCategoricalPalette,
  tonalGateReport,
} from './charts'
import {
  CVD_GATE,
  DARK_BG_LSTAR,
  DARK_MIN_BG_SEPARATION,
  DARK_SKELETON,
  LIGHT_BG_LSTAR,
  LIGHT_SKELETON,
  LIGHT_SKELETON_NEUTRAL,
  NEUTRAL_TINT_PEAK,
  NEUTRAL_WHISPER_CEILING,
  SEED_SNAP_BOUND,
  STATUS_SEEDS,
  STEPS,
  type StatusName,
  type StepName,
  WHISPER_LINE,
} from './data'
import { deltaEok, minPairwiseDeltaEok } from './meters'
import {
  buildScale,
  type Mode,
  type ScaleColors,
  transposeSkeleton,
} from './scale'
import { lstarOf, type Oklch, oklchCss, toOklch } from './space'
import { type GuaranteeResult, verifyLadder, verifyScale } from './verify'

const colorString = z.string().refine(
  (value) => {
    try {
      toOklch(value)
      return true
    } catch {
      return false
    }
  },
  { message: 'not a parsable CSS color' },
)

export const themeOptionsSchema = z.object({
  seeds: z
    .object({
      accent: colorString,
      neutral: colorString.optional(),
      success: colorString.optional(),
      warning: colorString.optional(),
      danger: colorString.optional(),
      info: colorString.optional(),
    })
    .catchall(colorString),
  /** D7 — pin the accent verbatim at the solid step; the report prices it. */
  preserveSeed: z.boolean().optional(),
  /** D5 — scales the fitted chroma curve (1 ≈ Radix, ~1.33 ≈ Tailwind). */
  vividness: z.number().min(0).max(2).optional(),
  /** D6 — scalar on the hue-band bend table (1.6 ≈ Tailwind warm bends). */
  hueShift: z.number().min(0).max(3).optional(),
  /** D8 — scales the whisper tint peak (0 = pure gray). */
  neutralTint: z.number().min(0).max(4).optional(),
  /** D8 — override the derived neutral hue (degrees). */
  neutralHue: z.number().optional(),
  /** D9/D12 — app-background lightness per mode (L*), or OLED black. */
  background: z
    .object({
      light: z.number().min(90).max(100).optional(),
      dark: z.union([z.number().min(0).max(20), z.literal('oled')]).optional(),
    })
    .optional(),
  /** D2 — solve solids to the full WCAG 4.5 on-label bar. */
  strictOnSolid: z.boolean().optional(),
})

export type ThemeOptions = z.infer<typeof themeOptionsSchema>

export interface ModeOutput {
  /** The app background (= neutral step 25). */
  background: string
  scales: Record<string, Record<StepName, string>>
  /** Alpha twins compositing to the solids over this mode's background. */
  alphas: Record<string, Record<StepName, string>>
  /** Solved solid-label foregrounds. */
  on: Record<string, { '700': string; '800': string }>
}

export interface ThemeReport {
  ok: boolean
  guarantees: GuaranteeResult[]
  warnings: string[]
  /** ΔEok between each seed and its emitted solid (the snap price, D7). */
  seedDelta: Record<string, number>
}

export interface ChartSet {
  categorical: string[]
  sequential: string[]
  diverging: string[]
}

export interface Theme {
  light: ModeOutput
  dark: ModeOutput
  /** Per-mode chart palettes — dark series ride a lighter L* ladder. */
  charts: { light: ChartSet; dark: ChartSet }
  report: ThemeReport
}

const CORE_ORDER = ['neutral', 'accent', 'success', 'warning', 'danger', 'info']

export function createTheme(input: string | ThemeOptions): Theme {
  const options =
    typeof input === 'string'
      ? themeOptionsSchema.parse({ seeds: { accent: input } })
      : themeOptionsSchema.parse(input)

  const vividness = options.vividness ?? 1
  const hueShift = options.hueShift ?? 1
  const neutralTint = options.neutralTint ?? 1
  const strictOnSolid = options.strictOnSolid ?? false
  const preserveSeed = options.preserveSeed ?? false

  const accentSeed = toOklch(options.seeds.accent)

  // D8 — the neutral: explicit seed sets hue + tint; otherwise identity rule.
  const neutralSeedInput = options.seeds.neutral
  const neutralExplicit = neutralSeedInput ? toOklch(neutralSeedInput) : null
  const neutralHue =
    options.neutralHue ??
    (neutralExplicit && neutralExplicit.c >= 0.002
      ? neutralExplicit.h
      : accentSeed.h)
  const tintPeak = Math.min(
    neutralExplicit && neutralExplicit.c >= 0.002
      ? neutralExplicit.c
      : options.neutralHue === undefined && accentSeed.c < WHISPER_LINE
        ? 0 // achromatic brand: its hue is meaningless, nothing to tint from
        : NEUTRAL_TINT_PEAK * neutralTint,
    NEUTRAL_WHISPER_CEILING * Math.max(1, neutralTint),
  )
  const neutralSeed: Oklch = { l: 0.6, c: tintPeak, h: neutralHue }

  // Seed table: core palettes + any custom extras. Every seed classifies at
  // the whisper line (D7) — an achromatic brand rides the neutral model.
  const classify = (seed: Oklch) => ({
    seed,
    neutral: seed.c < WHISPER_LINE,
  })
  const seeds: Record<string, { seed: Oklch; neutral: boolean }> = {
    neutral: { seed: neutralSeed, neutral: true },
    accent: classify(accentSeed),
  }
  for (const status of Object.keys(STATUS_SEEDS) as StatusName[]) {
    seeds[status] = classify(
      toOklch(options.seeds[status] ?? STATUS_SEEDS[status]),
    )
  }
  for (const [name, value] of Object.entries(options.seeds)) {
    if (name in seeds) continue
    seeds[name] = classify(toOklch(value))
  }

  // Backgrounds (D9/D12): transpose skeletons when the user moves the floor.
  const lightBg = options.background?.light ?? LIGHT_BG_LSTAR
  const darkBgOption = options.background?.dark
  const darkBg = darkBgOption === 'oled' ? 0 : (darkBgOption ?? DARK_BG_LSTAR)
  const skeletons = {
    light: {
      chromatic:
        lightBg === LIGHT_BG_LSTAR
          ? LIGHT_SKELETON
          : transposeSkeleton(LIGHT_SKELETON, lightBg),
      neutral:
        lightBg === LIGHT_BG_LSTAR
          ? LIGHT_SKELETON_NEUTRAL
          : transposeSkeleton(LIGHT_SKELETON_NEUTRAL, lightBg),
    },
    dark: {
      chromatic:
        darkBg === DARK_BG_LSTAR
          ? DARK_SKELETON
          : transposeSkeleton(DARK_SKELETON, darkBg, DARK_MIN_BG_SEPARATION),
      neutral:
        darkBg === DARK_BG_LSTAR
          ? DARK_SKELETON
          : transposeSkeleton(DARK_SKELETON, darkBg, DARK_MIN_BG_SEPARATION),
    },
  }

  const warnings: string[] = []
  const guarantees: GuaranteeResult[] = []
  const seedDelta: Record<string, number> = {}

  const built: Record<Mode, Record<string, ScaleColors>> = {
    light: {},
    dark: {},
  }

  for (const [name, { seed, neutral }] of Object.entries(seeds)) {
    const shared = {
      seed,
      neutral,
      vividness,
      hueShift,
      // Seed-classified neutrals tint from their own chroma (D8 explicit rule).
      tintPeak:
        name === 'neutral'
          ? tintPeak
          : Math.min(seed.c, NEUTRAL_WHISPER_CEILING),
      strictOnSolid,
      preserveSeed: preserveSeed && name === 'accent',
    }
    const light = buildScale({
      ...shared,
      mode: 'light',
      skeleton: neutral ? skeletons.light.neutral : skeletons.light.chromatic,
    })
    // Step 700 is mode-invariant (verified on Radix) — share the light solve.
    const dark = buildScale({
      ...shared,
      mode: 'dark',
      skeleton: neutral ? skeletons.dark.neutral : skeletons.dark.chromatic,
      sharedSolid: { solid: light.steps['700'], on: light.on['700'] },
    })
    built.light[name] = light
    built.dark[name] = dark

    seedDelta[name] = deltaEok(seed, light.steps['700'])

    // D7 — price every seed move: the window clamp, and (for user-supplied
    // seeds; the synthetic neutral only contributes hue+tint) the snap bound.
    if (light.solidClamped)
      warnings.push(
        `${name}: seed lightness sits outside the solid job window; solid clamped to L* ${lstarOf(light.steps['700']).toFixed(1)}`,
      )
    if (
      name !== 'neutral' &&
      name in options.seeds &&
      !(preserveSeed && name === 'accent') &&
      seedDelta[name] > SEED_SNAP_BOUND
    )
      warnings.push(
        `${name}: emitted solid deviates from the seed (ΔEok ${seedDelta[name].toFixed(3)} > ${SEED_SNAP_BOUND} snap bound)`,
      )

    for (const mode of ['light', 'dark'] as const) {
      const scale = built[mode][name]!
      const results = verifyScale(name, mode, scale, strictOnSolid)
      guarantees.push(...results)
      warnings.push(...verifyLadder(name, mode, scale))
      if (preserveSeed && name === 'accent') {
        for (const miss of results.filter(
          (r) => !r.passes && r.name === 'on-solid',
        ))
          warnings.push(
            `accent/${mode}: preserveSeed pins the solid; ${miss.fg} lands at WCAG ${miss.wcag.toFixed(2)} / Lc ${miss.lc.toFixed(1)} (bars ${miss.wcagTarget}/${miss.lcTarget})`,
          )
      }
    }
  }

  // D10 — CVD gate on the emitted status solids, reported not thrown.
  const statusSolids = (['success', 'warning', 'danger', 'info'] as const).map(
    (name) => built.light[name]!.steps['700'],
  )
  const cvd = minPairwiseDeltaEok(statusSolids)
  if (cvd.normal < CVD_GATE.normal)
    warnings.push(
      `status solids fall below the distinguishability gate (min ΔEok ${cvd.normal.toFixed(3)} < ${CVD_GATE.normal})`,
    )
  const worstCvd = Math.min(cvd.protan, cvd.deutan, cvd.tritan)
  if (worstCvd < CVD_GATE.cvd)
    warnings.push(
      `status solids fall below the color-vision-deficiency gate (min ΔEok ${worstCvd.toFixed(3)} < ${CVD_GATE.cvd})`,
    )
  const accentSolid = built.light.accent!.steps['700']
  for (const [i, name] of (
    ['success', 'warning', 'danger', 'info'] as const
  ).entries()) {
    const d = deltaEok(accentSolid, statusSolids[i]!)
    if (d < CVD_GATE.accentProximity)
      warnings.push(
        `accent solid is nearly indistinguishable from ${name} (ΔEok ${d.toFixed(3)})`,
      )
  }

  // D11 — chart palettes from the brand accent, one set per mode. The
  // categorical default is tonal (shadcn parity: shades of one brand hue,
  // lightness-encoded); the hue-spread generator stays exported for callers
  // that need maximal series separation.
  const chartSet = (mode: Mode) => {
    const categorical = tonalCategoricalPalette(accentSeed, 8, mode)
    const gate = tonalGateReport(categorical)
    if (!gate.passes)
      warnings.push(
        `${mode} tonal chart palette misses its gate (min adjacent ΔL* ${gate.minAdjacent.toFixed(1)}, monotonic ${gate.monotonic})`,
      )
    return {
      categorical: categorical.map(oklchCss),
      sequential: sequentialPalette(accentSeed.h, 7, mode).map(oklchCss),
      diverging: divergingPalette(
        accentSeed.h,
        built[mode].neutral!.steps['100'],
        3,
        mode,
      ).map(oklchCss),
    }
  }
  const charts = { light: chartSet('light'), dark: chartSet('dark') }

  const modeOutput = (mode: Mode): ModeOutput => {
    const background = built[mode].neutral!.steps['25']!
    const scales: ModeOutput['scales'] = {}
    const alphas: ModeOutput['alphas'] = {}
    const on: ModeOutput['on'] = {}
    const names = [
      ...CORE_ORDER.filter((n) => n in built[mode]),
      ...Object.keys(built[mode])
        .filter((n) => !CORE_ORDER.includes(n))
        .sort(),
    ]
    for (const name of names) {
      const scale = built[mode][name]!
      scales[name] = Object.fromEntries(
        STEPS.map((s) => [s, oklchCss(scale.steps[s]!)]),
      ) as Record<StepName, string>
      alphas[name] = Object.fromEntries(
        STEPS.map((s) => [s, alphaTwin(scale.steps[s]!, background)]),
      ) as Record<StepName, string>
      on[name] = {
        '700': oklchCss(scale.on['700']),
        '800': oklchCss(scale.on['800']),
      }
    }
    return { background: oklchCss(background), scales, alphas, on }
  }

  const failed = guarantees.filter(
    (g) =>
      !g.passes &&
      !(preserveSeed && g.scale === 'accent' && g.name === 'on-solid'),
  )
  for (const f of failed)
    warnings.push(
      `${f.scale}/${f.mode} ${f.name} (${f.fg} on ${f.bg}): WCAG ${f.wcag.toFixed(2)}/${f.wcagTarget} Lc ${f.lc.toFixed(1)}/${f.lcTarget}`,
    )

  return {
    light: modeOutput('light'),
    dark: modeOutput('dark'),
    charts,
    report: { ok: failed.length === 0, guarantees, warnings, seedDelta },
  }
}
