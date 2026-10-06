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

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { FONT } from "./schema"
import type { ChapterSchema } from "./schema"

export const TYPE_DEFAULTS = {
  // Same as body until pinned; --font-heading falls back to the body face.
  headingFont: "same",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
}

export const TYPE_SCHEMA: ChapterSchema<typeof TYPE_DEFAULTS> = {
  headingFont: FONT,
  bodyFont: FONT,
  monoFont: FONT,
}

export function resolveType(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  if (state.bodyFont !== DEFAULT_BODY_FAMILY)
    tokens["--font-sans"] = fontStack(state.bodyFont)
  // The theme's own fallback follows the body: a heading on the body family
  // encodes as nothing.
  if (state.headingFont !== state.bodyFont)
    tokens["--font-heading"] = fontStack(state.headingFont)
  if (state.monoFont !== DEFAULT_MONO_FAMILY)
    tokens["--font-mono"] = fontStack(state.monoFont)
  return { tokens }
}

export const chapter = defineChapter({
  id: "type",
  defaults: TYPE_DEFAULTS,
  schema: TYPE_SCHEMA,
  resolve: resolveType,
  follows: { headingFont: [{ kind: "same", id: "same", from: "bodyFont" }] },
})
