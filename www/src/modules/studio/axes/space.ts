/* Space — density picks which of the registry's three hand-tuned tiers every
   component wears (heights, insets, gaps, and the text size that rides with
   them); the unit scales every spacing utility under it.

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

/** Where the unit slider runs: 3px is a dense desktop tool, 6px a touch UI. */
export const UNIT_RANGE = { min: 3, max: 6, step: 0.25 }

/** The tiers as the registry ships them, in spacing units, so a specimen at
 *  the current unit reads what the components will measure: the md control
 *  (button, input), a menu item, a card's inset, and the text size. */
export const DENSITY_TIERS = [
  {
    id: "compact",
    label: "Compact",
    control: 7,
    item: 7,
    inset: 4,
    gap: 1,
    textPx: 12,
  },
  {
    id: "default",
    label: "Default",
    control: 8,
    item: 8,
    inset: 4,
    gap: 1.5,
    textPx: 14,
  },
  {
    id: "comfortable",
    label: "Comfortable",
    control: 9,
    item: 9,
    inset: 6,
    gap: 1.5,
    textPx: 14,
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
