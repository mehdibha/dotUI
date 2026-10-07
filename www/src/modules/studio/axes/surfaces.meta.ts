import { options } from "./core/meta"
import type { StudioStateInput } from "./index"
import {
  EDGE_VALUES,
  LAYERS_VALUES,
  SHADOW_VALUES,
  SHELL_VALUES,
} from "./surfaces"

export const LAYERS_OPTIONS = options(LAYERS_VALUES, {
  same: {
    label: "Same",
    description: "In light, cards share the page's tone",
    credits: ["shadcn", "Primer"],
  },
  grouped: {
    label: "Grouped",
    description: "In light, white cards on a gray page",
    credits: ["Apple", "Polaris", "HeroUI"],
  },
  tonal: {
    label: "Tonal",
    description: "In light, cards a shade below the page",
    credits: ["Material 3"],
  },
})

export const EDGE_OPTIONS = options(EDGE_VALUES, {
  line: {
    label: "Line",
    credits: ["Geist", "shadcn Nova", "Primer", "Radix Themes"],
  },
  none: {
    label: "None",
    credits: ["Atlassian", "Fluent 2", "HeroUI v3", "Spectrum 2"],
  },
  bevel: { label: "Bevel", credits: ["Polaris"] },
  ledge: { label: "Ledge", credits: ["Duolingo"] },
})

export const SHADOW_OPTIONS = options(SHADOW_VALUES, {
  flat: {
    label: "Flat",
    description: "No card shadows; menus and dialogs cast",
  },
  low: {
    label: "Low",
    description: "A small shadow under cards",
    credits: ["shadcn new-york"],
  },
  medium: {
    label: "Medium",
    description: "Cards lift off the page",
    credits: ["shadcn luma"],
  },
  high: { label: "High", description: "Deep, soft shadows" },
})

export const GLASS_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description: "Opaque menus, popovers and toasts",
  },
  {
    value: "glass",
    label: "Glass",
    description: "Translucent over a blur; dialogs stay solid",
  },
]

export const SHELL_OPTIONS = options(SHELL_VALUES, {
  subtle: {
    label: "Subtle",
    description: "One step off the page",
    credits: ["shadcn"],
  },
  page: {
    label: "Page",
    description: "The page's own tone",
    credits: ["Supabase", "Carbon"],
  },
  recessed: {
    label: "Recessed",
    description: "Below the page; panels wear the card edge",
    credits: ["Linear", "Polaris"],
  },
})

export const OPTIONS = {
  surfaceLayers: LAYERS_OPTIONS,
  surfaceEdge: EDGE_OPTIONS,
  surfaceShadow: SHADOW_OPTIONS,
  shellTone: SHELL_OPTIONS,
}

/* --------------------------------- Styles --------------------------------- */

const SHADOWS: readonly string[] = SHADOW_VALUES

type StyleKey = "surfaceLayers" | "surfaceEdge" | "surfaceShadow"

export interface SurfaceStyle {
  id: string
  label: string
  /** Who draws their surfaces this way. */
  credits: string
  description: string
  values: Record<StyleKey, string>
}

const style = (
  id: string,
  label: string,
  credits: string,
  description: string,
  surfaceLayers: string,
  surfaceEdge: string,
  surfaceShadow: string,
): SurfaceStyle => ({
  id,
  label,
  credits,
  description,
  values: { surfaceLayers, surfaceEdge, surfaceShadow },
})

export const SURFACE_STYLES: SurfaceStyle[] = [
  style(
    "outlined",
    "Outlined",
    "shadcn, GitHub",
    "Hairlines, flat cards",
    "same",
    "line",
    "flat",
  ),
  style(
    "soft",
    "Soft",
    "shadcn New York, Radix",
    "Hairlines and a small shadow",
    "same",
    "line",
    "low",
  ),
  style(
    "elevated",
    "Elevated",
    "Fluent, Atlassian",
    "Shadows instead of lines",
    "same",
    "none",
    "low",
  ),
  style(
    "grouped",
    "Grouped",
    "HeroUI, Polaris",
    "White cards on a gray page",
    "grouped",
    "none",
    "low",
  ),
  style(
    "tonal",
    "Tonal",
    "Material",
    "Cards toned off the page",
    "tonal",
    "none",
    "flat",
  ),
]

/* Edges no style is built on, read as the drawn line they replace. */
const DRAWN_EDGES = new Set(["bevel", "ledge"])

/** How close the state sits to a style, 9 on it: Layers outweighs Edge,
 *  which outweighs how far apart the shadows are. */
export const styleScore = (
  state: Pick<StudioStateInput, StyleKey>,
  { values }: SurfaceStyle,
) =>
  (state.surfaceLayers === values.surfaceLayers ? 4 : 0) +
  (state.surfaceEdge === values.surfaceEdge
    ? 2
    : DRAWN_EDGES.has(state.surfaceEdge) && values.surfaceEdge === "line"
      ? 1
      : 0) +
  3 -
  Math.abs(
    SHADOWS.indexOf(state.surfaceShadow) -
      SHADOWS.indexOf(values.surfaceShadow),
  )

/** The style the state sits on, or the closest one. */
export function surfaceStyle(state: Pick<StudioStateInput, StyleKey>): {
  style: SurfaceStyle
  exact: boolean
} {
  const best = SURFACE_STYLES.reduce((a, b) =>
    styleScore(state, b) > styleScore(state, a) ? b : a,
  )
  return { style: best, exact: styleScore(state, best) === 9 }
}
