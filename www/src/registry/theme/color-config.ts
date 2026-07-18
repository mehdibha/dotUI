/**
 * `ColorConfig` v2 — the persisted recipe for a design system's colors.
 *
 * Stores seeds + engine axes, never expanded ramps: `resolveColorConfig`
 * (in `primitives.ts`) feeds these to the `@dotui/colors` engine. One engine,
 * no algorithm menu — the v1 `{algorithm, knobs}` shape migrates below.
 */

import { z } from 'zod'

import { STATUS_SEEDS } from '@dotui/colors'

import type { PrimaryColorSource } from './types'

export const colorConfigSchema = z.object({
  v: z.literal(2),
  seeds: z.object({
    /** The brand accent — the one required input. */
    accent: z.string(),
    /** Absent → auto-tinted from the accent hue at whisper chroma (engine D8). */
    neutral: z.string().optional(),
    success: z.string().optional(),
    warning: z.string().optional(),
    danger: z.string().optional(),
    info: z.string().optional(),
  }),
  /** App-background lightness per mode (L*); dark accepts OLED black. */
  background: z
    .object({
      light: z.number().min(90).max(100).optional(),
      dark: z.union([z.number().min(0).max(20), z.literal('oled')]).optional(),
    })
    .optional(),
  /** Scales the fitted chroma curve (1 ≈ Radix, ~1.33 ≈ Tailwind). */
  vividness: z.number().min(0).max(2).optional(),
  /** Scalar on the hue-band bend table (1.6 ≈ Tailwind warm bends). */
  hueShift: z.number().min(0).max(3).optional(),
  /** Scales the neutral whisper tint (0 = pure gray). */
  neutralTint: z.number().min(0).max(4).optional(),
  /** Pin the accent verbatim at the solid step; the report prices it. */
  preserveSeed: z.boolean().optional(),
  /**
   * Ramp the primary-action tokens draw from. Stored only as `'accent'`
   * (brand-colored primary); absent means the default neutral (black/white).
   */
  primary: z.literal('accent').optional(),
})

export type ColorConfig = z.infer<typeof colorConfigSchema>
export type PaletteSeeds = ColorConfig['seeds']

/**
 * dotUI's default palette: a blue brand accent, auto-tinted neutral, and the
 * engine's CVD-gated status defaults (kept ABSENT so an untouched palette
 * still encodes to `undefined` — the codec diffs against this default).
 */
export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  v: 2,
  seeds: { accent: '#438cd6' },
}

/** Engine status defaults, re-exported for the customizer's seed pickers. */
export const DEFAULT_STATUS_SEEDS = STATUS_SEEDS

/**
 * Migrate any decoded color slice — v2 passes through validation; the v1
 * shape (`{algorithm, seeds: {neutral, accent, …}, knobs?, primary?}`) maps
 * onto the nearest v2 axes (algorithm + per-producer knobs are gone; the one
 * engine covers their range). Unknown shapes fall back to the default —
 * never a decode explosion.
 */
export function migrateColorConfig(input: unknown): ColorConfig {
  const parsed = colorConfigSchema.safeParse(input)
  if (parsed.success) return parsed.data
  if (typeof input !== 'object' || input === null) return DEFAULT_COLOR_CONFIG

  const v1 = input as {
    algorithm?: string
    seeds?: Record<string, unknown>
    knobs?: Record<string, unknown>
    primary?: unknown
  }
  if (typeof v1.seeds?.accent !== 'string') return DEFAULT_COLOR_CONFIG

  const seeds: ColorConfig['seeds'] = { accent: v1.seeds.accent }
  for (const name of [
    'neutral',
    'success',
    'warning',
    'danger',
    'info',
  ] as const) {
    const value = v1.seeds?.[name]
    if (typeof value === 'string') seeds[name] = value
  }
  // v1's default neutral seed meant "plain gray"; v2's default is auto-tint.
  if (seeds.neutral === '#808080') delete seeds.neutral

  const config: ColorConfig = { v: 2, seeds }
  const chromaMult = v1.knobs?.chromaMult
  if (typeof chromaMult === 'number')
    config.vividness = Math.min(2, Math.max(0, chromaMult))
  const hueTorsion = v1.knobs?.hueTorsion
  if (typeof hueTorsion === 'number' && hueTorsion !== 0)
    config.hueShift = Math.min(3, Math.max(0, Math.abs(hueTorsion) / 15))
  if (v1.primary === 'accent') config.primary = 'accent'
  return config
}

export type { PrimaryColorSource }
