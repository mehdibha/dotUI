/**
 * Shared output types for every producer.
 */

/**
 * A color ramp keyed by step name. Step count and naming are configurable
 * (e.g. "50".."950", Radix-style "1".."12", or Material tones) — the producer
 * decides the keys via {@link ModeCtx.steps}. `SCALE_STEPS` is only the default.
 */
export type ColorScale = Record<string, string>

/** A single mode's output: primitive ramps plus their paired on-* foregrounds. */
export type ThemeMode = {
  scales: Record<string, ColorScale>
  /** Readable foreground per palette, keyed identically to `scales`. Every producer emits it. */
  on: Record<string, ColorScale>
}

/** Complete theme output, one entry per mode. */
export type Theme = Record<string, ThemeMode>
