/* Icons — the library, and the axis that library exposes: stroke width on
   line sets (Auto: the library's own), weight on Phosphor. Engine: the
   library reaches every registry icon through the provider; stroke rides on
   `--icon-stroke-width`, weight on `--icon-weight`. */

import type { IconLibraryName } from "@/registry/icons/icon-map"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"

export const ICON_DEFAULTS = {
  iconLibrary: "lucide",
  iconStroke: "auto" as number | "auto",
  iconWeight: "regular",
}

/* Lucide: shadcn, Supabase. Phosphor to Hugeicons are shadcn create's
   libraries (Hugeicons is shadcn mira's). Material Symbols: Material 3;
   Octicons: GitHub (Primer). */
export const LIBRARY_VALUES = [
  "lucide",
  "phosphor",
  "tabler",
  "remix",
  "hugeicons",
  "material-symbols",
  "octicons",
] as const

/* Phosphor's own weights; Regular is shadcn create's. */
export const WEIGHT_VALUES = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
] as const

export const STROKE_RANGE = { min: 1, max: 3, step: 0.25 }

export const ICON_SCHEMA: ChapterSchema<typeof ICON_DEFAULTS> = {
  iconLibrary: oneOf(LIBRARY_VALUES),
  iconStroke: range(STROKE_RANGE),
  iconWeight: oneOf(WEIGHT_VALUES),
}

export const ICON_STROKE_WIDTH_VAR = "--icon-stroke-width"
export const ICON_WEIGHT_VAR = "--icon-weight"

/** Each library's own stroke at 24px, total so Auto never falls through.
 *  Phosphor (regular: 16 on its 256 grid), Remix (2px lines), Material
 *  Symbols (weight 400 at opsz 24) and Octicons (1.5px at 16 and 24) are
 *  outlined to fills and draw no variable stroke. */
export const LIBRARY_STROKE: Record<IconLibraryName, number> = {
  lucide: 2,
  tabler: 2,
  hugeicons: 1.5,
  phosphor: 1.5,
  remix: 2,
  "material-symbols": 2,
  octicons: 1.5,
}

/** Line sets: the libraries whose stroke the axis can move. */
const LINE_SETS: IconLibraryName[] = ["lucide", "tabler", "hugeicons"]

export function resolveIcons(state: Effective): Resolved {
  const library = state.iconLibrary as IconLibraryName
  const tokens: Record<string, string> = {}
  if (state.iconStroke !== LIBRARY_STROKE[library])
    tokens[ICON_STROKE_WIDTH_VAR] = String(state.iconStroke)
  if (state.iconWeight !== ICON_DEFAULTS.iconWeight)
    tokens[ICON_WEIGHT_VAR] = state.iconWeight
  return { tokens, icons: library === "lucide" ? undefined : library }
}

export const chapter = defineChapter({
  id: "icons",
  defaults: ICON_DEFAULTS,
  schema: ICON_SCHEMA,
  resolve: resolveIcons,
  follows: {
    iconStroke: [
      { kind: "auto", id: "auto", from: "iconLibrary", table: LIBRARY_STROKE },
    ],
  },
  rules: [
    {
      id: "icons/stroke-only-line-sets",
      target: "iconStroke",
      when: { key: "iconLibrary", notIn: LINE_SETS },
      effect: { kind: "hide" },
      cause: "iconLibrary",
    },
    {
      id: "icons/weight-only-phosphor",
      target: "iconWeight",
      when: { key: "iconLibrary", notIn: ["phosphor"] },
      effect: { kind: "hide" },
      cause: "iconLibrary",
    },
  ],
})
