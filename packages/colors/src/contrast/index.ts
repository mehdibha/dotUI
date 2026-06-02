/**
 * Contrast algorithm — public surface.
 *
 * The OKLCH contrast-target generator: ramps solved to per-step target contrasts
 * against the mode background, with paired on-* foregrounds. Emits `oklch()`.
 */

export { createContrastThemeOptionsSchema } from "./schema";
export { type CreateContrastThemeOptions, createContrastTheme } from "./theme";
