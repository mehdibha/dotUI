/* Space — density picks which of the registry's three hand-tuned tiers every
   component wears (heights, insets, gaps, and the text size that rides with
   them); the unit scales every spacing utility under it.

   Engine: `density` selects the tier layer `useStyles` composes live and the
   publisher flattens into the shipped classes. The unit is Tailwind's
   `--spacing`, written on `:root` — live and in the exported theme alike. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

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
    description:
      "28px controls and menu items with 12px text; tighter gaps and " +
      "paddings throughout.",
    seenIn: ["shadcn/ui", "Ant Design"],
    control: 7,
    item: 7,
    inset: 4,
    gap: 1,
    textPx: 12,
  },
  {
    id: "default",
    label: "Default",
    description: "32px controls and 28px menu items with 14px text.",
    seenIn: ["shadcn/ui", "Ant Design"],
    control: 8,
    item: 8,
    inset: 4,
    gap: 1.5,
    textPx: 14,
  },
  {
    id: "comfortable",
    label: "Comfortable",
    description:
      "36px controls and 32px menu items with 14px text, and roomier card " +
      "and dialog insets.",
    seenIn: ["shadcn/ui"],
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

export function resolveSpace(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.spacingUnit !== SPACE_DEFAULTS.spacingUnit)
    tokens["--spacing"] = `${state.spacingUnit / 16}rem`
  return { tokens, density: densityTier(state.density).id }
}

export const SPACE_SPEC = {
  label: "Space",
  description:
    "How dense the system is: which tier of component sizes every " +
    "component wears, and the spacing unit all sizes, paddings and gaps " +
    "are multiples of.",
  axes: {
    density: {
      label: "Density",
      description:
        "One of three hand-tuned size tiers: control and item heights, " +
        "paddings, gaps, and the text size inside controls and cards. " +
        "Heights are counted in spacing units, so they also scale with Unit.",
      value: {
        type: "enum",
        options: DENSITY_TIERS.map(({ id, label, description, seenIn }) => ({
          value: id,
          label,
          description,
          seenIn,
        })),
      },
      guidance:
        "shadcn/ui ships all three as styles (Mira, Nova, Vega at 28, 32 " +
        "and 36px buttons). Ant Design's compact algorithm drops controls " +
        "32→28px and text 14→12px; Cloudscape's compact mode only tightens " +
        "paddings and margins; Material 3 steps heights down 4dp per " +
        "density level. Compact suits dashboards and data-heavy tools, " +
        "Comfortable consumer products.",
    },
    spacingUnit: {
      label: "Unit",
      description:
        "Tailwind's --spacing: the length every spacing utility multiplies, " +
        "so it scales control heights, paddings, gaps and sizes together. " +
        "Text and radius don't follow it.",
      value: { type: "number", unit: "px", ...UNIT_RANGE },
      guidance:
        "4px is the base in Tailwind, Ant Design (sizeUnit), Cloudscape and " +
        "Radix Themes, whose scaling setting (90–110%) is the same idea " +
        "applied to text as well. Below 4px tightens a dense tool; above " +
        "suits touch-first products.",
    },
  },
} satisfies ChapterSpec<typeof SPACE_DEFAULTS>
