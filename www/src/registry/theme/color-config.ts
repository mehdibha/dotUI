/**
 * `ColorConfig` v2 — the persisted recipe for a design system's colors.
 *
 * Stores seeds + engine axes, never expanded ramps: `resolveColorConfig`
 * (in `primitives.ts`) feeds these to the `@dotui/colors` engine. One engine,
 * no algorithm menu — the v1 `{algorithm, knobs}` shape migrates below.
 */

import { STATUS_SEEDS, toOklch } from "@dotui/colors"

import type {
  PrimaryColorSource,
  TokenOverride,
  TokenOverrides,
  TokenTargetSpec,
} from "./types"
import { JOB_STEPS, type JobName } from "./types"

/** WCAG ratio vs the app background (1.05–21), one value or per mode. */
type BorderTarget = number | { light?: number; dark?: number }

export interface ColorConfig {
  v: 2
  seeds: {
    /** The brand accent — the one required input. */
    accent: string
    /** Absent → auto-tinted from the accent hue at whisper chroma (engine D8). */
    neutral?: string
    success?: string
    warning?: string
    danger?: string
    info?: string
    /** Splits selection controls + focus onto their own ramp (else = primary). */
    selection?: string
  }
  /** App-background lightness per mode (L*: light 90–100, dark 0–20); dark accepts OLED black. */
  background?: { light?: number; dark?: number | "oled" }
  /** Scales the fitted chroma curve, 0–2 (1 ≈ Radix, ~1.33 ≈ Tailwind). */
  vividness?: number
  /** Scalar on the hue-band bend table, 0–3 (1.6 ≈ Tailwind warm bends). */
  hueShift?: number
  /** Scales the neutral whisper tint, 0–4 (0 = pure gray). */
  neutralTint?: number
  /** OKLCH hue the neutral tint leans toward (absent = follow the accent). */
  neutralHue?: number
  /** Pin the accent verbatim at the solid step; the report prices it. */
  preserveSeed?: boolean
  /**
   * Guarantee policy (engine D2): `relaxed` prices border-floor misses as
   * warnings; `strict` solves solid labels to the full WCAG 4.5. Stored only
   * when non-default — absent means the default policy.
   */
  guaranteePolicy?: "relaxed" | "strict"
  /**
   * Border placement targets (engine D2): WCAG vs the app background per
   * border job, one value or per-mode values, keyed by palette (`'*'` = all).
   */
  borders?: Record<
    string,
    { "400"?: BorderTarget; "500"?: BorderTarget; "600"?: BorderTarget }
  >
  /**
   * Ramp the primary-action tokens draw from. Stored only as `'accent'`
   * (brand-colored primary); absent means the default neutral (black/white).
   */
  primary?: "accent"
  /**
   * Per-token remaps (T5): token name → (palette, job), one destination or a
   * per-mode pair. Applied by the semantic resolver; unknown names are inert.
   */
  overrides?: TokenOverrides
  /**
   * Categorical chart series (engine D11): absent = tonal shades of the accent
   * (shadcn parity); `vivid` / `muted` spread hues around it.
   */
  chartPalette?: "vivid" | "muted"
}
export type PaletteSeeds = ColorConfig["seeds"]

/**
 * dotUI's default palette: a blue brand accent, auto-tinted neutral, and the
 * engine's CVD-gated status defaults (kept ABSENT so an untouched palette
 * still encodes to `undefined` — the codec diffs against this default).
 */
export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  v: 2,
  seeds: { accent: "#438cd6" },
  background: { dark: 2 },
}

/** Engine status defaults, re-exported for the customizer's seed pickers. */
export const DEFAULT_STATUS_SEEDS = STATUS_SEEDS

/** True when the engine can parse `value` as a color (its render-time bar). */
function isColor(value: unknown): value is string {
  if (typeof value !== "string") return false
  try {
    toOklch(value)
    return true
  } catch {
    return false
  }
}

/** Salvage the seed table: keep only parseable seeds; a bad accent → default. */
function salvageSeeds(raw: unknown): ColorConfig["seeds"] {
  const input = (raw ?? {}) as Record<string, unknown>
  const seeds: ColorConfig["seeds"] = {
    accent: isColor(input.accent)
      ? input.accent
      : DEFAULT_COLOR_CONFIG.seeds.accent,
  }
  for (const name of [
    "neutral",
    "success",
    "warning",
    "danger",
    "info",
    "selection",
  ] as const) {
    if (isColor(input[name])) seeds[name] = input[name]
  }
  return seeds
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

/** Salvage one remap destination: a non-empty palette + a known job name. */
function salvageTargetSpec(raw: unknown): TokenTargetSpec | undefined {
  if (typeof raw !== "object" || raw === null) return undefined
  const spec = raw as { palette?: unknown; job?: unknown }
  if (typeof spec.palette !== "string" || spec.palette.length === 0)
    return undefined
  if (typeof spec.job !== "string" || !(spec.job in JOB_STEPS)) return undefined
  return { palette: spec.palette, job: spec.job as JobName }
}

/** Salvage the per-token remap table: keep only valid entries, drop empties. */
function salvageOverrides(raw: unknown): TokenOverrides | undefined {
  if (typeof raw !== "object" || raw === null) return undefined
  const overrides: TokenOverrides = {}
  for (const [token, value] of Object.entries(raw)) {
    const both = salvageTargetSpec(value)
    if (both) {
      overrides[token] = both
      continue
    }
    if (typeof value !== "object" || value === null) continue
    const pair = value as { light?: unknown; dark?: unknown }
    const override: Exclude<TokenOverride, TokenTargetSpec> = {}
    const light = salvageTargetSpec(pair.light)
    const dark = salvageTargetSpec(pair.dark)
    if (light) override.light = light
    if (dark) override.dark = dark
    if (light || dark) overrides[token] = override
  }
  return Object.keys(overrides).length > 0 ? overrides : undefined
}

/** Salvage one border target: a clamped ratio or a per-mode pair of them. */
function salvageBorderTarget(raw: unknown) {
  if (finite(raw)) return clamp(raw, 1.05, 21)
  if (typeof raw !== "object" || raw === null) return undefined
  const pair = raw as { light?: unknown; dark?: unknown }
  const target: { light?: number; dark?: number } = {}
  if (finite(pair.light)) target.light = clamp(pair.light, 1.05, 21)
  if (finite(pair.dark)) target.dark = clamp(pair.dark, 1.05, 21)
  return Object.keys(target).length > 0 ? target : undefined
}

/** Salvage the border-target table: keep only valid entries, drop empties. */
function salvageBorders(raw: unknown): ColorConfig["borders"] {
  if (typeof raw !== "object" || raw === null) return undefined
  const borders: NonNullable<ColorConfig["borders"]> = {}
  for (const [palette, spec] of Object.entries(raw)) {
    if (typeof spec !== "object" || spec === null) continue
    const entry: NonNullable<ColorConfig["borders"]>[string] = {}
    for (const job of ["400", "500", "600"] as const) {
      const target = salvageBorderTarget((spec as Record<string, unknown>)[job])
      if (target !== undefined) entry[job] = target
    }
    if (Object.keys(entry).length > 0) borders[palette] = entry
  }
  return Object.keys(borders).length > 0 ? borders : undefined
}

/**
 * Migrate any decoded color slice — v2 salvages field by field (a corrupt or
 * out-of-range axis is clamped or dropped, never taking valid siblings with
 * it); the v1 shape (`{algorithm, seeds, knobs?, primary?}`) maps onto the
 * nearest v2 axes (algorithm + per-producer knobs are gone; the one engine
 * covers their range). Unknown shapes fall back to the default, and every
 * kept seed is verified parseable — never a decode or render explosion.
 * Also the validator in front of the engine (`resolveColorConfig`).
 */
export function migrateColorConfig(input: unknown): ColorConfig {
  if (typeof input !== "object" || input === null) return DEFAULT_COLOR_CONFIG

  const raw = input as {
    v?: unknown
    seeds?: Record<string, unknown>
    background?: { light?: unknown; dark?: unknown }
    vividness?: unknown
    hueShift?: unknown
    neutralTint?: unknown
    neutralHue?: unknown
    preserveSeed?: unknown
    overrides?: unknown
    guaranteePolicy?: unknown
    borders?: unknown
    chartPalette?: unknown
    algorithm?: string
    knobs?: Record<string, unknown>
    primary?: unknown
  }

  if (raw.v === 2) {
    const config: ColorConfig = { v: 2, seeds: salvageSeeds(raw.seeds) }
    const bg = raw.background
    if (typeof bg === "object" && bg !== null) {
      const background: ColorConfig["background"] = {}
      if (finite(bg.light)) background.light = clamp(bg.light, 90, 100)
      if (finite(bg.dark)) background.dark = clamp(bg.dark, 0, 20)
      else if (bg.dark === "oled") background.dark = "oled"
      if (background.light !== undefined || background.dark !== undefined)
        config.background = background
    }
    if (finite(raw.vividness)) config.vividness = clamp(raw.vividness, 0, 2)
    if (finite(raw.hueShift)) config.hueShift = clamp(raw.hueShift, 0, 3)
    if (finite(raw.neutralTint))
      config.neutralTint = clamp(raw.neutralTint, 0, 4)
    if (finite(raw.neutralHue))
      config.neutralHue = clamp(raw.neutralHue, 0, 360)
    if (typeof raw.preserveSeed === "boolean")
      config.preserveSeed = raw.preserveSeed
    if (raw.guaranteePolicy === "relaxed" || raw.guaranteePolicy === "strict")
      config.guaranteePolicy = raw.guaranteePolicy
    const borders = salvageBorders(raw.borders)
    if (borders) config.borders = borders
    if (raw.primary === "accent") config.primary = "accent"
    const overrides = salvageOverrides(raw.overrides)
    if (overrides) config.overrides = overrides
    if (raw.chartPalette === "vivid" || raw.chartPalette === "muted")
      config.chartPalette = raw.chartPalette
    return config
  }

  if (!isColor(raw.seeds?.accent)) return DEFAULT_COLOR_CONFIG

  const seeds = salvageSeeds(raw.seeds)
  // v1's default neutral seed meant "plain gray"; v2's default is auto-tint.
  if (seeds.neutral === "#808080") delete seeds.neutral

  const config: ColorConfig = { v: 2, seeds }
  const chromaMult = raw.knobs?.chromaMult
  if (finite(chromaMult)) config.vividness = clamp(chromaMult, 0, 2)
  const hueTorsion = raw.knobs?.hueTorsion
  if (finite(hueTorsion) && hueTorsion !== 0)
    config.hueShift = clamp(Math.abs(hueTorsion) / 15, 0, 3)
  if (raw.primary === "accent") config.primary = "accent"
  return config
}

export type { PrimaryColorSource }
