import type { Density } from "@/registry/types"

import { options } from "./core/meta"
import { DENSITY_VALUES } from "./space"

export const DENSITY_OPTIONS = options(DENSITY_VALUES, {
  compact: {
    label: "Compact",
    credits: ["shadcn mira", "Ant Design (compact)"],
  },
  default: {
    label: "Default",
    credits: ["shadcn nova", "Primer", "Radix Themes", "Fluent 2"],
  },
  comfortable: {
    label: "Comfortable",
    credits: ["shadcn vega", "Geist", "Mantine", "Catalyst"],
  },
  spacious: {
    label: "Spacious",
    credits: ["Carbon", "Material 3", "Airbnb"],
  },
  touch: { label: "Touch", credits: ["Duolingo", "Spotify"] },
})

/** Each tier as the registry ships it, in px: the button ladder (xs, sm,
 *  md, lg), the list row and the control text. */
export const DENSITY_TIERS: Record<
  Density,
  {
    ladder: readonly [number, number, number, number]
    row: number
    text: number
  }
> = {
  compact: { ladder: [20, 24, 28, 32], row: 28, text: 12 },
  default: { ladder: [24, 28, 32, 36], row: 28, text: 14 },
  comfortable: { ladder: [28, 32, 36, 40], row: 32, text: 14 },
  spacious: { ladder: [28, 32, 40, 48], row: 36, text: 14 },
  touch: { ladder: [28, 32, 48, 56], row: 40, text: 16 },
}

export const densityTier = (id: string) =>
  DENSITY_TIERS[id as Density] ?? DENSITY_TIERS.default

export const OPTIONS = { density: DENSITY_OPTIONS }
