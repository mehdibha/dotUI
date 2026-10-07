import { DENSITY_VALUES } from "./space"

const TIERS = {
  compact: {
    label: "Compact",
    description: "Tight, for data-dense tools",
    control: 7,
  },
  default: {
    label: "Default",
    description: "Balanced, for most products",
    control: 8,
  },
  comfortable: {
    label: "Comfortable",
    description: "Roomy, for touch and content",
    control: 9,
  },
}

/** The tiers as the registry ships them; `control` is the md control height
 *  in spacing units. */
export const DENSITY_TIERS = DENSITY_VALUES.map((id) => ({ id, ...TIERS[id] }))

export type DensityTier = (typeof DENSITY_TIERS)[number]

export const densityTier = (id: string): DensityTier =>
  DENSITY_TIERS.find((tier) => tier.id === id) ?? {
    id: "default",
    ...TIERS.default,
  }
