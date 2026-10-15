import { options } from "./core/meta"
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
