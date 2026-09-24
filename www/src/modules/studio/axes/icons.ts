/* Icons — the library, and the axis that library exposes: stroke width on
   line sets, weight on Phosphor. Engine: the library reaches every registry
   icon through the provider; stroke rides on `--icon-stroke-width`, weight
   on `--icon-weight`. */

import type { IconLibraryName } from "@/registry/icons/icon-map"

import type { Resolved, StudioState } from "./index"
import { oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"

export const ICON_DEFAULTS = {
  iconLibrary: "lucide",
  iconStroke: 2,
  iconWeight: "regular",
}

export const LIBRARY_OPTIONS = [
  { value: "lucide", label: "Lucide" },
  { value: "phosphor", label: "Phosphor" },
  { value: "tabler", label: "Tabler" },
  { value: "remix", label: "Remix" },
  { value: "hugeicons", label: "Hugeicons" },
]

export const WEIGHT_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "bold", label: "Bold" },
  { value: "fill", label: "Fill" },
  { value: "duotone", label: "Duotone" },
]

export const STROKE_RANGE = { min: 1, max: 3, step: 0.25 }

export const ICON_SCHEMA: ChapterSchema<typeof ICON_DEFAULTS> = {
  iconLibrary: oneOf(LIBRARY_OPTIONS),
  iconStroke: range(STROKE_RANGE),
  iconWeight: oneOf(WEIGHT_OPTIONS),
}

export const ICON_STROKE_WIDTH_VAR = "--icon-stroke-width"
export const ICON_WEIGHT_VAR = "--icon-weight"

/** Stroke-based libraries the stroke-width axis applies to, with their defaults. */
export const STROKE_DEFAULTS: Partial<Record<IconLibraryName, number>> = {
  lucide: 2,
  tabler: 2,
  hugeicons: 1.5,
}

export function resolveIcons(state: StudioState): Resolved {
  const library = state.iconLibrary as IconLibraryName
  const tokens: Record<string, string> = {}
  const strokeDefault = STROKE_DEFAULTS[library]
  if (strokeDefault !== undefined && state.iconStroke !== strokeDefault)
    tokens[ICON_STROKE_WIDTH_VAR] = String(state.iconStroke)
  if (library === "phosphor" && state.iconWeight !== ICON_DEFAULTS.iconWeight)
    tokens[ICON_WEIGHT_VAR] = state.iconWeight
  return { tokens, icons: library === "lucide" ? undefined : library }
}
