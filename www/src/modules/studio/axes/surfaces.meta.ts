import { options } from "./core/meta"
import {
  DARK_LAYERS_VALUES,
  EDGE_VALUES,
  LAYERS_VALUES,
  OVERLAY_EDGE_VALUES,
  OVERLAY_SHADOW_VALUES,
  SHADOW_COLOR_VALUES,
  SHADOW_VALUES,
  SHELL_VALUES,
  SURFACE_LOOK_VALUES,
} from "./surfaces"

export const LOOK_OPTIONS = options(SURFACE_LOOK_VALUES, {
  outlined: {
    label: "Outlined",
    description: "Cards on the page's tone, inside an edge",
  },
  floating: {
    label: "Floating",
    description: "Cards on the page's tone, lifted by a shadow alone",
  },
  grouped: {
    label: "Grouped",
    description: "In light, edged white cards on a gray page",
  },
  tonal: {
    label: "Tonal",
    description: "Cards a shade off the page, no edge",
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
    label: "None",
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

export const SHADOW_COLOR_OPTIONS = options(SHADOW_COLOR_VALUES, {
  black: { label: "Black", description: "Neutral shadows" },
  tinted: {
    label: "Tinted",
    description: "In light, shadows take the neutral's hue",
    credits: ["Stripe", "Radix Themes", "Primer"],
  },
})

export const OVERLAY_EDGE_OPTIONS = options(OVERLAY_EDGE_VALUES, {
  cards: {
    label: "Match cards",
    description: "Menus and dialogs take the cards' edge",
  },
  line: {
    label: "Line",
    description: "A hairline, whatever the cards draw",
    credits: ["Higgsfield"],
  },
  none: {
    label: "None",
    description: "No border; shadows set them apart",
    credits: ["Airbnb"],
  },
})

const OVERLAY_SHADOWS = options(OVERLAY_SHADOW_VALUES, {
  small: { label: "Small", description: "A close shadow", credits: ["shadcn"] },
  medium: {
    label: "Medium",
    description: "Menus float clear of the page",
    credits: ["Bluesky"],
  },
  large: {
    label: "Large",
    description: "A deep, soft shadow",
    credits: ["Radix Themes", "Geist"],
  },
})

export const OVERLAY_SHADOW_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description: "Deepens with the cards' shadow",
  },
  ...OVERLAY_SHADOWS,
]

export const DARK_LAYERS_OPTIONS = options(DARK_LAYERS_VALUES, {
  lifted: {
    label: "Lifted",
    description: "Cards and menus step up from the page",
    credits: ["Material 3", "Polaris"],
  },
  flat: {
    label: "Flat",
    description: "Edged cards, menus and dialogs stay on the page tone",
    credits: ["Geist", "Untitled UI"],
  },
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
  shadowColor: SHADOW_COLOR_OPTIONS,
  overlayEdge: OVERLAY_EDGE_OPTIONS,
  overlayShadow: OVERLAY_SHADOWS,
  darkLayers: DARK_LAYERS_OPTIONS,
  shellTone: SHELL_OPTIONS,
}
