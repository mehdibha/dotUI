/* Density — which of the registry's hand-tuned tiers every component wears
   (heights, insets, gaps, and the text size that rides with them). The
   spacing unit stays Tailwind's 4px.

   Engine: `density` selects the tier layer `useStyles` composes live and the
   publisher flattens into the shipped classes. */

import { DENSITIES } from "@/registry/types"
import type { Density } from "@/registry/types"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SPACE_DEFAULTS = {
  density: "default",
}

export const DENSITY_VALUES = DENSITIES

export const SPACE_SCHEMA: ChapterSchema<typeof SPACE_DEFAULTS> = {
  density: oneOf(DENSITY_VALUES),
}

export function resolveSpace(state: Effective): Resolved {
  return { density: state.density as Density }
}

export const chapter = defineChapter({
  id: "space",
  defaults: SPACE_DEFAULTS,
  schema: SPACE_SCHEMA,
  resolve: resolveSpace,
})
