/**
 * Top-level `createTheme` options. The discriminated union below validates the
 * five BUILTIN algorithms with full per-knob typing; `oklch` is the conceptual
 * default (see `createTheme`). Any other (registered, non-builtin) algorithm id is
 * validated by {@link customThemeOptionsSchema} — shared fields strict, knobs
 * passed through and re-validated per palette by the producer's own schema.
 */

import { z } from 'zod'

import type { AlgorithmId } from './producer'
import type { Gamut } from './shared/color'
import type { ColorScale } from './shared/types'

/** Generative palettes: `primary` required (seed); others = seed string or on/off; custom names allowed. */
const generativePalettes = z
  .object({ primary: z.string() })
  .catchall(z.union([z.string(), z.boolean()]))

const paletteOverride = z.object({
  seed: z.string().optional(),
  ratios: z.array(z.number().positive()).min(2).optional(),
  tones: z.array(z.number().min(0).max(100)).min(2).optional(),
})

const modeSchema = z.union([
  z.literal(true),
  z.object({
    isDark: z.boolean().optional(),
    /** Background OKLCH lightness (0..1); defaults by isDark. */
    lightness: z.number().min(0).max(1).optional(),
    palettes: z.record(z.string(), paletteOverride).optional(),
  }),
])

const modesSchema = z.record(z.string(), modeSchema).optional()
const stepsSchema = z.array(z.string()).min(2).optional()
/** Output gamut for the generated ramps (theme-wide). Default `srgb`; `p3`/`rec2020` go wider. */
const gamutSchema = z.enum(['srgb', 'p3', 'rec2020']).optional()

const oklchArm = z.object({
  algorithm: z.literal('oklch'),
  palettes: generativePalettes,
  modes: modesSchema,
  steps: stepsSchema,
  targetGamut: gamutSchema,
  chromaMult: z.number().min(0).optional(),
  minChroma: z.number().min(0).optional(),
  hueTorsion: z.number().optional(),
  chromaMode: z.enum(['consistent', 'max']).optional(),
  preserveSeedAt: z.string().optional(),
})

const tailwindArm = oklchArm.extend({ algorithm: z.literal('tailwind') })

const contrastArm = z.object({
  algorithm: z.literal('contrast'),
  palettes: generativePalettes,
  modes: modesSchema,
  steps: stepsSchema,
  targetGamut: gamutSchema,
  ratios: z.array(z.number().positive()).min(2).optional(),
  formula: z.enum(['wcag2', 'apca']).optional(),
  saturation: z.number().min(0).max(100).optional(),
})

const materialArm = z.object({
  algorithm: z.literal('material'),
  palettes: generativePalettes,
  modes: modesSchema,
  steps: stepsSchema,
  targetGamut: gamutSchema,
  tones: z.array(z.number().min(0).max(100)).min(2).optional(),
})

const fixedArm = z.object({
  algorithm: z.literal('fixed'),
  /** Fixed palettes: each is a literal step→color ramp. */
  palettes: z.record(z.string(), z.record(z.string(), z.string())),
  modes: modesSchema,
  steps: stepsSchema,
  targetGamut: gamutSchema,
})

export const createThemeOptionsSchema = z.discriminatedUnion('algorithm', [
  oklchArm,
  tailwindArm,
  contrastArm,
  materialArm,
  fixedArm,
])

export type CreateThemeOptions = z.infer<typeof createThemeOptionsSchema>

/** Ids the discriminated union validates with full knob typing. Anything else must be a registered producer. */
export const BUILTIN_SCHEMA_IDS = [
  'oklch',
  'tailwind',
  'contrast',
  'material',
  'fixed',
] as const

/**
 * Base validation for a REGISTERED non-builtin algorithm: shared fields are strict,
 * knobs pass through untyped — each producer's own zod schema validates them per palette
 * (see `produceValidated`). Custom algorithms are seed-generative: `palettes` follows the
 * generative shape (`primary` seed required).
 */
export const customThemeOptionsSchema = z
  .object({
    algorithm: z.string(),
    palettes: generativePalettes,
    modes: modesSchema,
    steps: stepsSchema,
  })
  .catchall(z.unknown())

/**
 * A non-discriminated view of the options `createTheme` actually reads. The public API
 * validates the strict {@link CreateThemeOptions} union at runtime, but the algorithm-agnostic
 * orchestrator works against this flat superset so it never narrows on `algorithm` or casts:
 * each producer's zod schema strips the knobs it ignores. Callers that assemble options
 * dynamically (e.g. dotUI's semantic layer) can target this directly.
 */
export interface BaseThemeOptions {
  algorithm: AlgorithmId
  palettes: Record<string, string | ColorScale | boolean>
  modes?: z.infer<typeof modesSchema>
  steps?: string[]
  /** Output gamut for generated ramps (theme-wide). Default `srgb`. */
  targetGamut?: Gamut
  // oklch / tailwind
  chromaMult?: number
  minChroma?: number
  hueTorsion?: number
  chromaMode?: 'consistent' | 'max'
  preserveSeedAt?: string
  // contrast
  ratios?: number[]
  formula?: 'wcag2' | 'apca'
  saturation?: number
  // material
  tones?: number[]
}
