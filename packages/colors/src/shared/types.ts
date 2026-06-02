/**
 * Shared output types for both Material and Contrast themes
 */

/**
 * A color ramp keyed by step name. Step count and naming are configurable
 * (e.g. "50".."950", Radix-style "1".."12", or Material tones) — the producer
 * decides the keys via {@link ModeCtx.steps}. `SCALE_STEPS` is only the default.
 */
export type ColorScale = Record<string, string>;

/** A single mode's output */
export type ThemeMode = {
	scales: Record<string, ColorScale>;
};

/** Complete theme output with multiple modes */
export type Theme = Record<string, ThemeMode>;
