/* Typography — the font roles, the heading voice and the size ladder. Axes
   are the ones shipped systems actually expose: three faces, one heading
   weight and tracking, a base size, body leading.

   Engine: faces are the `--font-*` tokens (loaded from Google Fonts, shipped
   as registry:font items); the heading voice rides on base.css's h1–h6 rule
   through `--font-weight-heading` / `--tracking-heading`; the base size and
   body leading re-point Tailwind's `--text-*` theme vars. */

import { DEFAULT_BODY_FAMILY, DEFAULT_MONO_FAMILY, fontStack } from "@/lib/fonts"

import type { Resolved, StudioState } from "./index"

export const TYPE_DEFAULTS = {
  // heading mirrors --font-heading: '' = Auto, follows body.
  headingFont: "",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  headingWeight: "600",
  headingTracking: "normal",
  typeBase: 16,
  bodyLeading: "normal",
}

export const WEIGHT_OPTIONS = [
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
]

/* Linear's two buckets. Web tracking only ever tightens with size — no shipped
   system widens a heading. */
export const TRACKING_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "tight", label: "Tight" },
  { value: "tighter", label: "Tighter" },
]

export const TRACKING_EM: Record<string, string> = {
  normal: "0em",
  tight: "-0.012em",
  tighter: "-0.022em",
}

/* Body-only, like Mantine/Chakra/Tailwind leading scales — headings keep the
   ladder's fixed leading. */
export const LEADING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
]

export const LEADING_VALUES: Record<string, number> = {
  tight: 1.45,
  normal: 1.6,
  relaxed: 1.75,
}

/* Tailwind's default ladder, in rem at a 16px base — re-emitted scaled when
   the base moves. Line heights stay Tailwind's (unitless ratios). */
const TEXT_LADDER: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.875,
  "4xl": 2.25,
  "5xl": 3,
}

/* The body sizes leading applies to; Tailwind's own ratios are the 'normal'. */
const BODY_SIZES = ["xs", "sm", "base"]

export const WIRED = true

export function resolveType(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.bodyFont !== DEFAULT_BODY_FAMILY)
    tokens["--font-sans"] = fontStack(state.bodyFont)
  // Auto ('') follows the body through the theme's own fallback; a heading
  // pinned to the body family is the same thing and encodes as nothing.
  if (state.headingFont && state.headingFont !== state.bodyFont)
    tokens["--font-heading"] = fontStack(state.headingFont)
  if (state.monoFont !== DEFAULT_MONO_FAMILY)
    tokens["--font-mono"] = fontStack(state.monoFont)
  if (state.headingWeight !== TYPE_DEFAULTS.headingWeight)
    tokens["--font-weight-heading"] = state.headingWeight
  if (state.headingTracking !== TYPE_DEFAULTS.headingTracking)
    tokens["--tracking-heading"] =
      TRACKING_EM[state.headingTracking] ?? TRACKING_EM.normal!
  if (state.typeBase !== TYPE_DEFAULTS.typeBase) {
    const scale = state.typeBase / 16
    for (const [step, rem] of Object.entries(TEXT_LADDER))
      tokens[`--text-${step}`] = `${Math.round(rem * scale * 1000) / 1000}rem`
  }
  if (state.bodyLeading !== TYPE_DEFAULTS.bodyLeading) {
    const leading = LEADING_VALUES[state.bodyLeading] ?? LEADING_VALUES.normal!
    for (const step of BODY_SIZES)
      tokens[`--text-${step}--line-height`] = String(leading)
  }
  return { tokens }
}
