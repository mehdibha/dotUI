/* Density — which of the registry's three hand-tuned tiers every component
   wears (heights, insets, gaps, and the text size that rides with them); the
   spacing unit scales every spacing utility under it.

   Engine: `density` selects the tier layer `useStyles` composes live and the
   publisher flattens into the shipped classes. The unit is Tailwind's
   `--spacing`, written on `:root` — live and in the exported theme alike. */

import type { Resolved, StudioState } from "./index"
import { oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"

export const SPACE_DEFAULTS = {
  density: "default",
  /** Tailwind's --spacing, in px. */
  spacingUnit: 4,
}

/** Where the spacing slider runs: 3px is a dense desktop tool, 6px a touch UI. */
export const UNIT_RANGE = { min: 3, max: 6, step: 0.25 }

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
  spacingUnit: range(UNIT_RANGE),
}

export function resolveSpace(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.spacingUnit !== SPACE_DEFAULTS.spacingUnit)
    tokens["--spacing"] = `${state.spacingUnit / 16}rem`
  return { tokens, density: densityTier(state.density).id }
}
