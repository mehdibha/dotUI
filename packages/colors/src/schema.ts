/**
 * The `createTheme` input contract as a zod schema — a build/test-time gate
 * (registry build, tests, server-side publishing). Not imported by
 * `createTheme` itself, so the client never ships zod; `ThemeOptions` is the
 * inferred type and is all the engine needs at runtime.
 */

import { z } from "zod"

import { toOklch } from "./space"

const colorString = z.string().refine(
  (value) => {
    try {
      toOklch(value)
      return true
    } catch {
      return false
    }
  },
  { message: "not a parsable CSS color" },
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
      dark: z.union([z.number().min(0).max(20), z.literal("oled")]).optional(),
    })
    .optional(),
  /**
   * D11 — the categorical series strategy: `tonal` (default) shades one brand
   * hue, `vivid` / `muted` spread hues around the accent at high / low chroma.
   */
  chartPalette: z.enum(["tonal", "vivid", "muted"]).optional(),
})

export type ThemeOptions = z.infer<typeof themeOptionsSchema>
