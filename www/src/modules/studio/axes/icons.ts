/* Icons — the library, and the axis that library exposes: stroke width on
   line sets, weight on Phosphor. Engine: the library reaches every registry
   icon through the provider; stroke rides on `--icon-stroke-width`, weight
   on `--icon-weight`. */

import type { IconLibraryName } from "@/registry/icons/icon-map"

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const ICON_DEFAULTS = {
  iconLibrary: "lucide",
  iconStroke: 2,
  iconWeight: "regular",
}

export const LIBRARY_OPTIONS = [
  {
    value: "lucide",
    label: "Lucide",
    description:
      "Outline icons on a 24px grid, 2px stroke, round caps and joins.",
    seenIn: ["shadcn/ui", "Supabase"],
  },
  {
    value: "phosphor",
    label: "Phosphor",
    description:
      "Outline icons in six weights, thin to fill plus duotone; Weight " +
      "picks one, Stroke doesn't apply.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "tabler",
    label: "Tabler",
    description:
      "Outline icons on a 24px grid with a 2px stroke; over 6,000 icons.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "remix",
    label: "Remix",
    description:
      "Line icons drawn as filled outlines, so Stroke doesn't apply — " +
      "the line weight is fixed.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "hugeicons",
    label: "Hugeicons",
    description:
      "Rounded outline icons drawn for a 1.5px stroke; at the default " +
      "Stroke of 2 they match Lucide's weight.",
    seenIn: ["shadcn/ui"],
  },
]

export const WEIGHT_OPTIONS = [
  {
    value: "thin",
    label: "Thin",
    description: "The lightest strokes — close to a hairline at 16px.",
    seenIn: ["Material 3"],
  },
  {
    value: "light",
    label: "Light",
    description: "Strokes a step under Regular.",
    seenIn: ["Material 3"],
  },
  {
    value: "regular",
    label: "Regular",
    description: "Phosphor's default outline weight.",
    seenIn: ["Material 3"],
  },
  {
    value: "bold",
    label: "Bold",
    description: "The heaviest outline strokes.",
    seenIn: ["Material 3"],
  },
  {
    value: "fill",
    label: "Fill",
    description: "Solid glyphs — shapes filled, details knocked out.",
    seenIn: ["Material 3"],
  },
  {
    value: "duotone",
    label: "Duotone",
    description: "Regular outlines over a 20%-opacity fill of the same color.",
  },
]

/** Where the Stroke slider runs. */
export const ICON_STROKE_RANGE = { min: 1, max: 3, step: 0.25 }

export const ICON_STROKE_WIDTH_VAR = "--icon-stroke-width"
export const ICON_WEIGHT_VAR = "--icon-weight"

/** Stroke-based libraries the stroke-width axis applies to, with their defaults. */
export const STROKE_DEFAULTS: Partial<Record<IconLibraryName, number>> = {
  lucide: 2,
  tabler: 2,
  hugeicons: 1.5,
}

export function resolveIcons(state: StudioState): Resolved {
  const library = LIBRARY_OPTIONS.some((o) => o.value === state.iconLibrary)
    ? (state.iconLibrary as IconLibraryName)
    : "lucide"
  const tokens: Record<string, string> = {}
  const strokeDefault = STROKE_DEFAULTS[library]
  if (strokeDefault !== undefined && state.iconStroke !== strokeDefault)
    tokens[ICON_STROKE_WIDTH_VAR] = String(state.iconStroke)
  if (library === "phosphor" && state.iconWeight !== ICON_DEFAULTS.iconWeight)
    tokens[ICON_WEIGHT_VAR] = state.iconWeight
  return { tokens, icons: library === "lucide" ? undefined : library }
}

export const ICON_SPEC = {
  label: "Icons",
  description:
    "The icon library every registry icon is drawn from, and the one " +
    "weight control that library has: stroke width on line sets, weight on " +
    "Phosphor.",
  axes: {
    iconLibrary: {
      label: "Library",
      description:
        "Which icon set draws every icon in the components — chevrons, " +
        "checks, close buttons, spinners. The export installs that " +
        "package and imports from it.",
      value: { type: "enum", options: LIBRARY_OPTIONS },
      guidance:
        "These are the five shadcn/ui's builder offers, Lucide by default. " +
        "Systems with their own set (Material 3's Material Symbols, " +
        "Primer's Octicons, Carbon's icons) can't be matched exactly: pick Lucide or " +
        "Tabler for a neutral outline look, Phosphor when the system needs " +
        "a lighter, heavier or filled icon.",
    },
    iconStroke: {
      label: "Stroke",
      description:
        "Stroke width of line icons in SVG units on the 24px grid, for " +
        "Lucide, Tabler and Hugeicons. Phosphor and Remix ignore it.",
      value: { type: "number", ...ICON_STROKE_RANGE },
      guidance:
        "Lucide and Tabler are drawn at 2, Hugeicons at 1.5; Material " +
        "Symbols varies weight from 100 to 700 on its own axis. 1.5 pairs " +
        "with light, airy type; 2 is the common default; above 2 only for " +
        "large icons or a heavy UI.",
    },
    iconWeight: {
      label: "Weight",
      description:
        "Phosphor's style: stroke weight from thin to bold, a solid fill, " +
        "or duotone. Applies only when Library is Phosphor.",
      value: { type: "enum", options: WEIGHT_OPTIONS },
      guidance:
        "Material Symbols offers the same range as a variable font (weight " +
        "100–700 plus a fill axis). Regular suits most UIs; Light pairs " +
        "with thin type, Bold with heavy type; Fill reads playful and " +
        "consumer, Duotone illustrative.",
    },
  },
} satisfies ChapterSpec<typeof ICON_DEFAULTS>
