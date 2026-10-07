import { options } from "./core/meta"
import {
  ACTIONS_VALUES,
  BACKDROP_VALUES,
  CLOSE_VALUES,
  EDGE_VALUES,
  ENTRANCE_VALUES,
  FROST_VALUES,
  MOBILE_VALUES,
  POSITION_VALUES,
  SECTIONS_VALUES,
  STRENGTH_VALUES,
} from "./dialogs"

export const BACKDROP_OPTIONS = options(BACKDROP_VALUES, {
  scrim: {
    label: "Scrim",
    credits: [
      "Radix Themes",
      "Material 3",
      "Polaris",
      "Ant Design",
      "Mantine",
      "Chakra",
      "Fluent 2",
      "Carbon",
      "Atlassian",
      "Spectrum 2",
      "Catalyst",
      "HeroUI",
    ],
  },
  frosted: {
    label: "Frosted",
    credits: ["shadcn", "Supabase", "Untitled UI", "HeroUI (blur)"],
  },
  wash: {
    label: "Wash",
    credits: ["Geist", "Primer", "Linear (side panel)", "Stripe"],
  },
})

export const STRENGTH_OPTIONS = options(STRENGTH_VALUES, {
  light: {
    label: "Light",
    credits: [
      "shadcn nova, vega, lyra (10%)",
      "shadcn sera (20%)",
      "Catalyst (25%)",
    ],
  },
  medium: {
    label: "Medium",
    credits: [
      "shadcn luma, rhea (30%)",
      "Material 3 (32%)",
      "Radix Themes (40%)",
      "Supabase (40%)",
      "Primer (40%)",
      "Polaris (50%)",
      "Ant Design (45%)",
      "Atlassian",
    ],
  },
  heavy: {
    label: "Heavy",
    credits: [
      "shadcn mira, maia (80%)",
      "Geist (80%)",
      "Untitled UI (70%)",
      "Stripe (70%)",
      "Mantine (60%)",
      "Notion (60%)",
    ],
  },
})

export const FROST_OPTIONS = options(FROST_VALUES, {
  subtle: {
    label: "Subtle",
    credits: ["shadcn nova, vega, lyra, mira, maia (4px)", "Supabase (4px)"],
  },
  strong: {
    label: "Strong",
    credits: ["shadcn sera, luma, rhea (8px)", "Untitled UI (6px)"],
  },
})

export const SECTIONS_OPTIONS = options(SECTIONS_VALUES, {
  open: {
    label: "Open",
    credits: [
      "Radix Themes",
      "shadcn",
      "Fluent 2",
      "Ant Design 5",
      "Chakra",
      "HeroUI",
      "Catalyst",
      "Mantine",
      "Spectrum 2",
      "Apple",
    ],
  },
  "on-scroll": {
    label: "On scroll",
    credits: ["Material 3", "Atlassian", "Stripe"],
  },
  divided: {
    label: "Divided",
    credits: ["Supabase", "Spectrum 1", "Ant Design 4"],
  },
  "footer-band": {
    label: "Footer band",
    credits: ["shadcn nova", "Geist"],
  },
  "header-band": {
    label: "Header band",
    credits: ["Polaris"],
  },
})

export const ACTIONS_OPTIONS = options(ACTIONS_VALUES, {
  end: {
    label: "End",
    credits: [
      "shadcn",
      "Primer",
      "Material 3",
      "Fluent 2",
      "Ant Design",
      "Chakra",
      "HeroUI",
      "Atlassian",
      "Spectrum 2",
      "Catalyst",
      "Supabase",
      "Radix Themes",
      "Polaris",
    ],
  },
  spread: { label: "Spread", credits: ["Geist"] },
  stack: {
    label: "Stack",
    credits: ["Duolingo", "Notion", "Apple (3+ alert actions)"],
  },
  bleed: { label: "Bleed", credits: ["Carbon"] },
})

export const CLOSE_OPTIONS = options(CLOSE_VALUES, {
  quiet: {
    label: "Quiet",
    credits: ["shadcn nova, vega, mira, lyra, maia", "Primer", "Polaris"],
  },
  filled: { label: "Filled", credits: ["shadcn luma, rhea, sera"] },
  faint: { label: "Faint", credits: ["Supabase"] },
})

export const POSITION_OPTIONS = options(POSITION_VALUES, {
  center: {
    label: "Center",
    credits: [
      "shadcn",
      "Radix Themes",
      "Material 3",
      "Primer",
      "Polaris",
      "Fluent 2",
      "Spectrum 2",
      "Carbon",
      "HeroUI",
    ],
  },
  top: {
    label: "Top",
    credits: [
      "Ant Design",
      "Chakra",
      "Mantine",
      "Catalyst",
      "Linear (upper third)",
    ],
  },
})

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  scale: {
    label: "Scale",
    credits: [
      "shadcn",
      "Geist",
      "Linear",
      "Fluent 2",
      "Primer",
      "Untitled UI",
      "Chakra",
      "Ant Design",
    ],
  },
  rise: {
    label: "Rise",
    credits: ["Radix Themes (nearest)", "Spectrum 2", "Polaris", "Atlassian"],
  },
  drop: {
    label: "Drop",
    credits: ["Carbon", "Mantine"],
  },
})

export const EDGE_OPTIONS = options(EDGE_VALUES, {
  docked: {
    label: "Docked",
    credits: [
      "shadcn Drawer nova, vega, lyra, sera",
      "shadcn Sheet",
      "Vaul",
      "Material 3",
      "Primer",
      "HeroUI",
      "Fluent 2",
      "Untitled UI",
      "Geist (mobile)",
      "Polaris (mobile)",
    ],
  },
  detached: {
    label: "Detached",
    credits: [
      "shadcn Drawer mira, luma, maia, rhea",
      "Linear (side panel)",
      "Material 3 (detached side sheet)",
      "Apple (iOS 26 sheets)",
    ],
  },
})

export const MOBILE_OPTIONS = options(MOBILE_VALUES, {
  center: {
    label: "Center",
    credits: [
      "shadcn",
      "Radix Themes",
      "Material 3",
      "Fluent 2",
      "Ant Design",
      "Mantine",
      "Chakra",
      "Spectrum 2",
      "Primer",
    ],
  },
  sheet: {
    label: "Sheet",
    credits: ["Geist", "Polaris", "Catalyst", "Apple", "Stripe", "Untitled UI"],
  },
  fullscreen: { label: "Fullscreen", credits: ["Carbon", "Atlassian"] },
})

export const OPTIONS = {
  dialogBackdrop: BACKDROP_OPTIONS,
  dialogBackdropStrength: STRENGTH_OPTIONS,
  dialogFrost: FROST_OPTIONS,
  dialogSections: SECTIONS_OPTIONS,
  dialogActions: ACTIONS_OPTIONS,
  dialogClose: CLOSE_OPTIONS,
  dialogPosition: POSITION_OPTIONS,
  dialogEntrance: ENTRANCE_OPTIONS,
  drawerEdge: EDGE_OPTIONS,
  mobileDialogs: MOBILE_OPTIONS,
}
