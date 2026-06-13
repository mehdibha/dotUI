/**
 * Pluggable color-producer registry.
 *
 * Every generation strategy implements {@link ColorProducer} and is registered
 * by `registerBuiltins()` (see ./producers). `createTheme` resolves a producer by
 * id and calls `produce` once per palette per mode. Adding an algorithm is one
 * `registerProducer` call — nothing downstream branches on the algorithm: a
 * registered non-builtin id is accepted by `createTheme` (shared fields validated by
 * `customThemeOptionsSchema`, knobs validated by the producer's own schema), so the
 * registry — not a closed top-level union — is what gates which algorithms are usable.
 */

import type { ZodType } from 'zod'

import type { Gamut } from './shared/color'
import type { ColorScale } from './shared/types'

export type BuiltinAlgorithmId = 'oklch' | 'contrast' | 'material' | 'fixed'
/** Open union so presets (e.g. "tailwind") register without editing core types. */
export type AlgorithmId = BuiltinAlgorithmId | (string & {})

/** Per-mode context handed to a producer for one `produce` call. */
export interface ModeCtx {
  /** Mode name, e.g. "light" | "dark". */
  name: string
  /** Whether this mode is dark — controls ramp direction / tone set / on-* polarity. */
  isDark: boolean
  /** Ordered step names defining the scale shape (e.g. ["50",…,"950"] or ["1",…,"12"]). */
  steps: readonly string[]
  /** Mode background (from the neutral seed). Used by contrast-targeting producers; ignored by others. */
  background: string
  /** Target output gamut for ramp values (default `srgb`). Producers pass it to `gamutMap`. */
  gamut?: Gamut
}

/** A produced palette: the ramp plus its paired on-* foregrounds, both keyed by step. */
export interface PaletteOutput {
  scale: ColorScale
  on: ColorScale
}

/** A generation strategy. `produce` must be pure and deterministic. */
export interface ColorProducer<Opts = unknown> {
  id: AlgorithmId
  /** Validates this producer's per-palette opts (made load-bearing via `produceValidated`). */
  schema: ZodType<Opts>
  produce(opts: Opts, ctx: ModeCtx): PaletteOutput
}

const registry = new Map<string, ColorProducer<unknown>>()

/** Register (or replace) a producer. Idempotent per id. */
export function registerProducer<Opts>(producer: ColorProducer<Opts>): void {
  registry.set(producer.id, producer as unknown as ColorProducer<unknown>)
}

/** Resolve a producer by id, throwing a helpful error if it isn't registered. */
export function getProducer(id: AlgorithmId): ColorProducer<unknown> {
  const producer = registry.get(id)
  if (!producer) {
    const known = [...registry.keys()].join(', ') || 'none'
    throw new Error(
      `Unknown color algorithm "${id}". Registered producers: ${known}.`,
    )
  }
  return producer
}

/** Whether a producer is registered for `id`. */
export function hasProducer(id: AlgorithmId): boolean {
  return registry.has(id)
}

/** Validate per-palette opts via the producer's schema, then produce — makes `schema` load-bearing. */
export function produceValidated(
  id: AlgorithmId,
  opts: unknown,
  ctx: ModeCtx,
): PaletteOutput {
  const producer = getProducer(id)
  const out = producer.produce(producer.schema.parse(opts), ctx)
  if (Object.keys(out.scale).length === 0) {
    throw new Error(
      `Producer "${id}" produced an empty scale — no steps matched the palette's keys.`,
    )
  }
  return out
}
