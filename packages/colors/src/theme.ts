/**
 * `createTheme` (D12): one seed in, a complete correct system out — both
 * modes × {accent, neutral, status} × 12 steps + on-* + chart palettes, all guarantees enforced in-loop and audited in the report.
 */

import {
  CATEGORICAL_CHROMA,
  categoricalPalettes,
  divergingPalette,
  sequentialPalette,
  tonalCategoricalPalette,
  tonalGateReport,
} from "./charts"
import {
  BARS,
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
} from "./data"
import { deltaEok, minPairwiseDeltaEok } from "./meters"
import {
  type BorderTargets,
  buildScale,
  type Mode,
  type ScaleColors,
  transposeSkeleton,
} from "./scale"
import { lstarOf, type Oklch, oklchCss, toOklch } from "./space"
import { type GuaranteeResult, verifyLadder, verifyScale } from "./verify"

/** WCAG ratio vs the app background (1.05–21), one value or per mode. */
type BorderTargetValue = number | { light?: number; dark?: number }

export interface ThemeOptions {
  /** Parsable CSS colors; extra keys are custom palettes. */
  seeds: {
    accent: string
    neutral?: string
    success?: string
    warning?: string
    danger?: string
    info?: string
    [palette: string]: string | undefined
  }
  /** D7 — pin the accent verbatim at the solid step; the report prices it. */
  preserveSeed?: boolean
  /** D5 — scales the fitted chroma curve, 0–2 (1 ≈ Radix, ~1.33 ≈ Tailwind). */
  vividness?: number
  /** D6 — scalar on the hue-band bend table, 0–3 (1.6 ≈ Tailwind warm bends). */
  hueShift?: number
  /** D8 — scales the whisper tint peak, 0–4 (0 = pure gray). */
  neutralTint?: number
  /** D8 — override the derived neutral hue (degrees). */
  neutralHue?: number
  /** D9/D12 — app-background lightness per mode (L*: light 90–100, dark 0–20), or OLED black. */
  background?: { light?: number; dark?: number | "oled" }
  /** D2 — solve solids to the full WCAG 4.5 on-label bar. */
  strictOnSolid?: boolean
  /**
   * D2 — guarantee policy: `relaxed` reports border-floor misses as warnings
   * instead of failing the build (text guarantees never relax); `strict`
   * implies `strictOnSolid`. Absent = `default`.
   */
  guaranteePolicy?: "relaxed" | "default" | "strict"
  /**
   * D2 — per-palette border placement targets: WCAG vs the app background,
   * per border job, one value or per-mode values. Key `'*'` applies to every
   * palette without its own entry. A target below the default floor is
   * honored and priced as a report warning.
   */
  borders?: Record<
    string,
    {
      "400"?: BorderTargetValue
      "500"?: BorderTargetValue
      "600"?: BorderTargetValue
    }
  >
  /**
   * D11 — the categorical series strategy: `tonal` (default) shades one brand
   * hue, `vivid` / `muted` spread hues around the accent at high / low chroma.
   */
  chartPalette?: "tonal" | "vivid" | "muted"
}

/* The input gate: a clear error at the boundary beats a deep engine throw. */

class ThemeOptionsError extends Error {
  constructor(path: string, message: string) {
    super(`createTheme: ${path} ${message}`)
    this.name = "ThemeOptionsError"
  }
}

function checkColor(path: string, value: unknown): void {
  if (value === undefined) return
  try {
    if (typeof value !== "string") throw new Error()
    toOklch(value)
  } catch {
    throw new ThemeOptionsError(path, "is not a parsable CSS color")
  }
}

function checkNumber(
  path: string,
  value: unknown,
  min = -Infinity,
  max = Infinity,
): void {
  if (value === undefined) return
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new ThemeOptionsError(path, "must be a number")
  if (value < min || value > max)
    throw new ThemeOptionsError(path, `must be between ${min} and ${max}`)
}

function checkBoolean(path: string, value: unknown): void {
  if (value !== undefined && typeof value !== "boolean")
    throw new ThemeOptionsError(path, "must be a boolean")
}

function checkEnum(path: string, value: unknown, values: string[]): void {
  if (value !== undefined && !values.includes(value as string))
    throw new ThemeOptionsError(path, `must be one of ${values.join(", ")}`)
}

function checkBorderTarget(path: string, value: unknown): void {
  if (value === undefined) return
  if (typeof value === "number") return checkNumber(path, value, 1.05, 21)
  if (typeof value !== "object" || value === null)
    throw new ThemeOptionsError(path, "must be a ratio or a per-mode pair")
  const pair = value as { light?: unknown; dark?: unknown }
  checkNumber(`${path}.light`, pair.light, 1.05, 21)
  checkNumber(`${path}.dark`, pair.dark, 1.05, 21)
}

function validateThemeOptions(input: ThemeOptions): ThemeOptions {
  if (typeof input !== "object" || input === null)
    throw new ThemeOptionsError("options", "must be an object")
  if (typeof input.seeds !== "object" || input.seeds === null)
    throw new ThemeOptionsError("seeds", "must be an object")
  if (input.seeds.accent === undefined)
    throw new ThemeOptionsError("seeds.accent", "is required")
  for (const [name, seed] of Object.entries(input.seeds))
    checkColor(`seeds.${name}`, seed)
  checkBoolean("preserveSeed", input.preserveSeed)
  checkNumber("vividness", input.vividness, 0, 2)
  checkNumber("hueShift", input.hueShift, 0, 3)
  checkNumber("neutralTint", input.neutralTint, 0, 4)
  checkNumber("neutralHue", input.neutralHue)
  if (input.background !== undefined) {
    if (typeof input.background !== "object" || input.background === null)
      throw new ThemeOptionsError("background", "must be an object")
    checkNumber("background.light", input.background.light, 90, 100)
    if (input.background.dark !== "oled")
      checkNumber("background.dark", input.background.dark, 0, 20)
  }
  checkBoolean("strictOnSolid", input.strictOnSolid)
  checkEnum("guaranteePolicy", input.guaranteePolicy, [
    "relaxed",
    "default",
    "strict",
  ])
  if (input.borders !== undefined) {
    if (typeof input.borders !== "object" || input.borders === null)
      throw new ThemeOptionsError("borders", "must be an object")
    for (const [palette, spec] of Object.entries(input.borders)) {
      if (typeof spec !== "object" || spec === null)
        throw new ThemeOptionsError(`borders.${palette}`, "must be an object")
      for (const job of ["400", "500", "600"] as const)
        checkBorderTarget(`borders.${palette}.${job}`, spec[job])
    }
  }
  checkEnum("chartPalette", input.chartPalette, ["tonal", "vivid", "muted"])
  return input
}

export interface ModeOutput {
  /** The app background (= neutral step 25). */
  background: string
  scales: Record<string, Record<StepName, string>>
  /** Solved solid-label foregrounds. */
  on: Record<string, { "700": string; "800": string }>
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

const CORE_ORDER = ["neutral", "accent", "success", "warning", "danger", "info"]

export function createTheme(input: string | ThemeOptions): Theme {
  const options = validateThemeOptions(
    typeof input === "string" ? { seeds: { accent: input } } : input,
  )

  const vividness = options.vividness ?? 1
  const hueShift = options.hueShift ?? 1
  const neutralTint = options.neutralTint ?? 1
  const guaranteePolicy = options.guaranteePolicy ?? "default"
  const strictOnSolid =
    (options.strictOnSolid ?? false) || guaranteePolicy === "strict"
  const relaxedBorders = guaranteePolicy === "relaxed"
  const preserveSeed = options.preserveSeed ?? false

  // D2 — border placement targets, resolved per palette per mode (a palette's
  // own entry wins over the `'*'` wildcard; a plain number serves both modes).
  const borderTargetsFor = (
    name: string,
    mode: Mode,
  ): BorderTargets | undefined => {
    const spec = options.borders?.[name] ?? options.borders?.["*"]
    if (!spec) return undefined
    const targets: BorderTargets = {}
    for (const job of ["400", "500", "600"] as const) {
      const value = spec[job]
      if (value === undefined) continue
      const ratio = typeof value === "number" ? value : value[mode]
      if (ratio !== undefined) targets[job] = ratio
    }
    return Object.keys(targets).length > 0 ? targets : undefined
  }

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
    if (name in seeds || value === undefined) continue
    seeds[name] = classify(toOklch(value))
  }

  // Backgrounds (D9/D12): transpose skeletons when the user moves the floor.
  const lightBg = options.background?.light ?? LIGHT_BG_LSTAR
  const darkBgOption = options.background?.dark
  const darkBg = darkBgOption === "oled" ? 0 : (darkBgOption ?? DARK_BG_LSTAR)
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
        name === "neutral"
          ? tintPeak
          : Math.min(seed.c, NEUTRAL_WHISPER_CEILING),
      strictOnSolid,
      relaxedBorders,
      preserveSeed: preserveSeed && name === "accent",
    }
    const light = buildScale({
      ...shared,
      mode: "light",
      skeleton: neutral ? skeletons.light.neutral : skeletons.light.chromatic,
      borderTargets: borderTargetsFor(name, "light"),
    })
    // Step 700 is mode-invariant (verified on Radix) — share the light solve.
    const dark = buildScale({
      ...shared,
      mode: "dark",
      skeleton: neutral ? skeletons.dark.neutral : skeletons.dark.chromatic,
      sharedSolid: { solid: light.steps["700"], on: light.on["700"] },
      borderTargets: borderTargetsFor(name, "dark"),
    })
    built.light[name] = light
    built.dark[name] = dark

    seedDelta[name] = deltaEok(seed, light.steps["700"])

    // D7 — price every seed move: the window clamp, and (for user-supplied
    // seeds; the synthetic neutral only contributes hue+tint) the snap bound.
    if (light.solidClamped)
      warnings.push(
        `${name}: seed lightness sits outside the solid job window; solid clamped to L* ${lstarOf(light.steps["700"]).toFixed(1)}`,
      )
    if (
      name !== "neutral" &&
      name in options.seeds &&
      !(preserveSeed && name === "accent") &&
      seedDelta[name] > SEED_SNAP_BOUND
    )
      warnings.push(
        `${name}: emitted solid deviates from the seed (ΔEok ${seedDelta[name].toFixed(3)} > ${SEED_SNAP_BOUND} snap bound)`,
      )

    for (const mode of ["light", "dark"] as const) {
      const scale = built[mode][name]!
      const borderTargets = borderTargetsFor(name, mode)
      const results = verifyScale(name, mode, scale, {
        strictOnSolid,
        borderTargets,
      })
      guarantees.push(...results)
      warnings.push(
        ...verifyLadder(name, mode, scale, borderTargets !== undefined),
      )
      // D2 — price every target bought under the default floor.
      for (const [job, floor] of [
        ["400", BARS.border400],
        ["500", BARS.border500],
        ["600", BARS.border600],
      ] as const) {
        const target = borderTargets?.[job]
        if (target !== undefined && target < floor)
          warnings.push(
            `${name}/${mode}: border-${job} target ${target} sits below the ${floor} default floor`,
          )
      }
      if (preserveSeed && name === "accent") {
        for (const miss of results.filter(
          (r) => !r.passes && r.name === "on-solid",
        ))
          warnings.push(
            `accent/${mode}: preserveSeed pins the solid; ${miss.fg} lands at WCAG ${miss.wcag.toFixed(2)} / Lc ${miss.lc.toFixed(1)} (bars ${miss.wcagTarget}/${miss.lcTarget})`,
          )
      }
    }
  }

  // D10 — CVD gate on the emitted status solids, reported not thrown.
  const statusSolids = (["success", "warning", "danger", "info"] as const).map(
    (name) => built.light[name]!.steps["700"],
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
  const accentSolid = built.light.accent!.steps["700"]
  for (const [i, name] of (
    ["success", "warning", "danger", "info"] as const
  ).entries()) {
    const d = deltaEok(accentSolid, statusSolids[i]!)
    if (d < CVD_GATE.accentProximity)
      warnings.push(
        `accent solid is nearly indistinguishable from ${name} (ΔEok ${d.toFixed(3)})`,
      )
  }

  // D11 — chart palettes from the brand accent, one set per mode. The
  // categorical default is tonal (shadcn parity: shades of one brand hue,
  // lightness-encoded); the hue-spread strategies pick one hue sequence for
  // both modes and maximize their CVD gates by construction, so only the
  // tonal ladder is priced here.
  const chartPalette = options.chartPalette ?? "tonal"
  const hueSpread =
    chartPalette === "tonal"
      ? undefined
      : categoricalPalettes(accentSeed, 8, CATEGORICAL_CHROMA[chartPalette])
  const chartSet = (mode: Mode) => {
    let categorical: Oklch[]
    if (hueSpread) categorical = hueSpread[mode]
    else {
      categorical = tonalCategoricalPalette(accentSeed, 8, mode)
      const gate = tonalGateReport(categorical)
      if (!gate.passes)
        warnings.push(
          `${mode} tonal chart palette misses its gate (min adjacent ΔL* ${gate.minAdjacent.toFixed(1)}, monotonic ${gate.monotonic})`,
        )
    }
    return {
      categorical: categorical.map(oklchCss),
      sequential: sequentialPalette(accentSeed.h, 7, mode).map(oklchCss),
      diverging: divergingPalette(
        accentSeed.h,
        built[mode].neutral!.steps["100"],
        3,
        mode,
      ).map(oklchCss),
    }
  }
  const charts = { light: chartSet("light"), dark: chartSet("dark") }

  const modeOutput = (mode: Mode): ModeOutput => {
    const background = built[mode].neutral!.steps["25"]!
    const scales: ModeOutput["scales"] = {}
    const on: ModeOutput["on"] = {}
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
      on[name] = {
        "700": oklchCss(scale.on["700"]),
        "800": oklchCss(scale.on["800"]),
      }
    }
    return { background: oklchCss(background), scales, on }
  }

  // preserveSeed on-solid misses already carry their own warning; relaxed
  // policy excuses border misses from `ok` but still surfaces them.
  const misses = guarantees.filter(
    (g) =>
      !g.passes &&
      !(preserveSeed && g.scale === "accent" && g.name === "on-solid"),
  )
  const failed = misses.filter(
    (g) => !(relaxedBorders && g.name.startsWith("border")),
  )
  for (const f of misses)
    warnings.push(
      `${f.scale}/${f.mode} ${f.name} (${f.fg} on ${f.bg}): WCAG ${f.wcag.toFixed(2)}/${f.wcagTarget} Lc ${f.lc.toFixed(1)}/${f.lcTarget}`,
    )

  return {
    light: modeOutput("light"),
    dark: modeOutput("dark"),
    charts,
    report: { ok: failed.length === 0, guarantees, warnings, seedDelta },
  }
}
