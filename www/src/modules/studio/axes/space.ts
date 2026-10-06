/* Density — which of the registry's three hand-tuned tiers every component
   wears (heights, insets, gaps, and the text size that rides with them). The
   spacing unit stays Tailwind's 4px.

   Engine: `density` selects the tier layer `useStyles` composes live and the
   publisher flattens into the shipped classes. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SPACE_DEFAULTS = {
  density: "default",
}

/** The tiers as the registry ships them; `control` is the md control height
 *  in spacing units. */
export const DENSITY_TIERS = [
  {
    id: "compact",
    label: "Compact",
    description: "Tight, for data-dense tools",
    control: 7,
  },
  {
    id: "default",
    label: "Default",
    description: "Balanced, for most products",
    control: 8,
  },
  {
    id: "comfortable",
    label: "Comfortable",
    description: "Roomy, for touch and content",
    control: 9,
  },
] as const

export type DensityTier = (typeof DENSITY_TIERS)[number]

export const densityTier = (id: string): DensityTier =>
  DENSITY_TIERS.find((tier) => tier.id === id) ?? DENSITY_TIERS[1]

export const SPACE_SCHEMA: ChapterSchema<typeof SPACE_DEFAULTS> = {
  density: oneOf(DENSITY_TIERS.map((tier) => ({ value: tier.id }))),
}

export function resolveSpace(state: Effective): Resolved {
  return { density: densityTier(state.density).id }
}

export const chapter = defineChapter({
  id: "space",
  defaults: SPACE_DEFAULTS,
  schema: SPACE_SCHEMA,
  resolve: resolveSpace,
})
