import { options } from "./core/meta"
import {
  EDGE_VALUES,
  LAYERS_VALUES,
  SHADOW_VALUES,
  SHELL_VALUES,
  SURFACE_LOOK_VALUES,
} from "./surfaces"

export const LOOK_OPTIONS = options(SURFACE_LOOK_VALUES, {
  style: { label: "Style", description: "Cards take the Style's look" },
  outlined: {
    label: "Outlined",
    description: "A hairline around cards, no shadow",
  },
  raised: { label: "Raised", description: "A hairline and a small shadow" },
  floating: {
    label: "Floating",
    description: "No border; a soft shadow lifts cards",
  },
  grouped: {
    label: "Grouped",
    description: "In light, white cards on a gray page",
  },
})

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
    description: "A hairline border around cards",
    credits: ["Geist", "shadcn Nova", "Primer", "Radix Themes"],
  },
  none: {
    label: "None",
    description: "No border; shadows set cards apart",
    credits: ["Atlassian", "Fluent 2", "HeroUI v3", "Spectrum 2"],
  },
  bevel: {
    label: "Bevel",
    description: "An inset rim, lit on top, darker below",
    credits: ["Polaris"],
  },
  ledge: {
    label: "Ledge",
    description: "A solid border with a thick bottom lip",
    credits: ["Duolingo"],
  },
})

export const SHADOW_OPTIONS = options(SHADOW_VALUES, {
  flat: {
    label: "Flat",
    description: "No card shadow; menus and dialogs keep theirs",
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

export const OVERLAY_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description: "Opaque menus, popovers and toasts",
  },
  {
    value: "translucent",
    label: "Translucent",
    description: "See-through over a blur; dialogs stay solid",
    credits: ["Catalyst", "Notion", "Radix Themes", "shadcn"],
  },
]

export const SHELL_OPTIONS = options(SHELL_VALUES, {
  subtle: {
    label: "Subtle",
    description: "Sidebar a shade off the page",
    credits: ["shadcn"],
  },
  page: {
    label: "Page",
    description: "Sidebar in the page's own tone",
    credits: ["Supabase", "Carbon"],
  },
  recessed: {
    label: "Recessed",
    description: "Darker sidebar; content sits on a card",
    credits: ["Linear", "Polaris"],
  },
})

export const OPTIONS = {
  surfaceLayers: LAYERS_OPTIONS,
  surfaceEdge: EDGE_OPTIONS,
  surfaceShadow: SHADOW_OPTIONS,
  shellTone: SHELL_OPTIONS,
}
