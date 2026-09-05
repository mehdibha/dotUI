/* Space — the spatial system: the unit scales everything (Tailwind's
   `--spacing`), density picks the gap/inset recipe (the registry's three
   density tiers). */

import type { Resolved, StudioState } from "./index"

export const SPACE_DEFAULTS = {
  density: "default",
  /** Tailwind's --spacing, in px. */
  spacingUnit: 4,
}

export const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
]

export const DENSITY_FACTORS: Record<string, number> = {
  compact: 0.75,
  default: 1,
  comfortable: 1.25,
}

const spacePx = (n: number) => Math.round(n * 2) / 2

/** The specimen recipe: control height, paddings and gaps from unit × density. */
export function spaceRecipe(state: StudioState) {
  const unit = state.spacingUnit
  const factor = DENSITY_FACTORS[state.density] ?? 1
  return {
    unit,
    controlH: spacePx(8 * unit),
    padX: spacePx(2.5 * unit * factor),
    itemGap: spacePx(unit * factor),
    gap: spacePx(2 * unit * factor),
    inset: spacePx(3 * unit * factor),
  }
}

export const WIRED = true

export function resolveSpace(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.spacingUnit !== SPACE_DEFAULTS.spacingUnit)
    tokens["--spacing"] = `${state.spacingUnit / 16}rem`
  const density =
    state.density === "compact" || state.density === "comfortable"
      ? state.density
      : "default"
  return { tokens, density }
}
