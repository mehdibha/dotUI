/* Typography — the three font roles. Heading, body and mono are what shipped
   systems expose and what the registry consumes (`--font-*` tokens, loaded
   from Google Fonts, shipped as registry:font items). Heading weight and
   tracking were cut (Sept 2026): only base.css's h1–h6 rule read them, every
   component title pins its own weight, so the axis never showed. */

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  fontStack,
} from "@/lib/fonts"

import type { Resolved, StudioState } from "./index"

export const TYPE_DEFAULTS = {
  // heading mirrors --font-heading: '' = Auto, follows body.
  headingFont: "",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
}

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
  return { tokens }
}
