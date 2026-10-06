/* Dialogs — how a modal layer meets the page and how its panel is built.
   Members: dialog (the panel's parts), modal, drawer; sheets, alert dialogs
   and the command palette shell ride on them.

   Engine: one scrim for every modal layer — `--color-scrim` (the overlay, or
   the page tone for Wash, at the strength's alpha) and `--studio-scrim-blur`,
   both read by modal and drawer. Sections and Actions fold into one
   composite `dialog.footer` param, so no slot takes classes from two
   params. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "frosted",
  dialogBackdropStrength: "medium",
  dialogFrost: "strong",
  dialogSections: "open",
  dialogActions: "end",
  dialogClose: "quiet",
  dialogPosition: "center",
  dialogEntrance: "scale",
  drawerEdge: "docked",
  mobileDialogs: "center",
}

export const BACKDROP_OPTIONS = [
  {
    value: "scrim",
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
  {
    value: "frosted",
    label: "Frosted",
    credits: ["shadcn", "Supabase", "Untitled UI", "HeroUI (blur)"],
  },
  {
    value: "wash",
    label: "Wash",
    credits: ["Geist", "Primer", "Linear (side panel)", "Stripe"],
  },
]

export const STRENGTH_OPTIONS = [
  {
    value: "light",
    label: "Light",
    credits: [
      "shadcn nova, vega, lyra (10%)",
      "shadcn sera (20%)",
      "Catalyst (25%)",
    ],
  },
  {
    value: "medium",
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
  {
    value: "heavy",
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
]

export const FROST_OPTIONS = [
  {
    value: "subtle",
    label: "Subtle",
    credits: ["shadcn nova, vega, lyra, mira, maia (4px)", "Supabase (4px)"],
  },
  {
    value: "strong",
    label: "Strong",
    credits: ["shadcn sera, luma, rhea (8px)", "Untitled UI (6px)"],
  },
]

export const SECTIONS_OPTIONS = [
  {
    value: "open",
    label: "Open",
    description: "Radix",
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
  {
    value: "on-scroll",
    label: "On scroll",
    description: "Material 3",
    credits: ["Material 3", "Atlassian", "Stripe"],
  },
  {
    value: "divided",
    label: "Divided",
    description: "Supabase",
    credits: ["Supabase", "Spectrum 1", "Ant Design 4"],
  },
  {
    value: "footer-band",
    label: "Footer band",
    description: "Geist",
    credits: ["shadcn nova", "Geist"],
  },
  {
    value: "header-band",
    label: "Header band",
    description: "Polaris",
    credits: ["Polaris"],
  },
]

export const ACTIONS_OPTIONS = [
  {
    value: "end",
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
  { value: "spread", label: "Spread", credits: ["Geist"] },
  {
    value: "stack",
    label: "Stack",
    credits: ["Duolingo", "Notion", "Apple (3+ alert actions)"],
  },
  { value: "bleed", label: "Bleed", credits: ["Carbon"] },
]

export const CLOSE_OPTIONS = [
  {
    value: "quiet",
    label: "Quiet",
    credits: ["shadcn nova, vega, mira, lyra, maia", "Primer", "Polaris"],
  },
  { value: "filled", label: "Filled", credits: ["shadcn luma, rhea, sera"] },
  { value: "faint", label: "Faint", credits: ["Supabase"] },
]

export const POSITION_OPTIONS = [
  {
    value: "center",
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
  {
    value: "top",
    label: "Top",
    credits: [
      "Ant Design",
      "Chakra",
      "Mantine",
      "Catalyst",
      "Linear (upper third)",
    ],
  },
]

export const ENTRANCE_OPTIONS = [
  {
    value: "scale",
    label: "Scale",
    description: "shadcn",
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
  {
    value: "rise",
    label: "Rise",
    description: "Polaris",
    credits: ["Radix Themes (nearest)", "Spectrum 2", "Polaris", "Atlassian"],
  },
  {
    value: "drop",
    label: "Drop",
    description: "Carbon",
    credits: ["Carbon", "Mantine"],
  },
]

export const EDGE_OPTIONS = [
  {
    value: "docked",
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
  {
    value: "detached",
    label: "Detached",
    credits: [
      "shadcn Drawer mira, luma, maia, rhea",
      "Linear (side panel)",
      "Material 3 (detached side sheet)",
      "Apple (iOS 26 sheets)",
    ],
  },
]

export const MOBILE_OPTIONS = [
  {
    value: "center",
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
  {
    value: "sheet",
    label: "Sheet",
    credits: ["Geist", "Polaris", "Catalyst", "Apple", "Stripe", "Untitled UI"],
  },
  {
    value: "fullscreen",
    label: "Fullscreen",
    credits: ["Carbon", "Atlassian"],
  },
]

export const DIALOG_SCHEMA: ChapterSchema<typeof DIALOG_DEFAULTS> = {
  dialogBackdrop: oneOf(BACKDROP_OPTIONS),
  dialogBackdropStrength: oneOf(STRENGTH_OPTIONS),
  dialogFrost: oneOf(FROST_OPTIONS),
  dialogSections: oneOf(SECTIONS_OPTIONS),
  dialogActions: oneOf(ACTIONS_OPTIONS),
  dialogClose: oneOf(CLOSE_OPTIONS),
  dialogPosition: oneOf(POSITION_OPTIONS),
  dialogEntrance: oneOf(ENTRANCE_OPTIONS),
  drawerEdge: oneOf(EDGE_OPTIONS),
  mobileDialogs: oneOf(MOBILE_OPTIONS),
}

const SCRIM_ALPHA: Record<string, number> = { light: 10, medium: 40, heavy: 80 }
const FROST_BLUR: Record<string, string> = {
  subtle: "var(--blur-xs)",
  strong: "var(--blur-sm)",
}

/** The footer's edge for a Sections pick: none, a rule, or a band. */
const FOOTER_EDGE: Record<string, string> = {
  divided: "-rule",
  "header-band": "-rule",
  "footer-band": "-band",
}

export function resolveDialogs(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  const alpha = SCRIM_ALPHA[state.dialogBackdropStrength] ?? 40
  const tint = state.dialogBackdrop === "wash" ? "bg" : "overlay"
  if (tint !== "overlay" || alpha !== 40)
    tokens["--color-scrim"] =
      `color-mix(in oklab, var(--color-${tint}) ${alpha}%, transparent)`
  const blur =
    state.dialogBackdrop === "frosted" ? FROST_BLUR[state.dialogFrost] : "0"
  if (blur && blur !== FROST_BLUR.strong) tokens["--studio-scrim-blur"] = blur

  return {
    tokens,
    params: {
      dialog: {
        sections:
          state.dialogSections === "footer-band"
            ? "open"
            : state.dialogSections,
        footer: `${state.dialogActions}${FOOTER_EDGE[state.dialogSections] ?? ""}`,
        close: state.dialogClose,
      },
      modal: {
        position: state.dialogPosition,
        motion: state.motion === "none" ? "none" : state.dialogEntrance,
        mobile: state.mobileDialogs,
      },
      drawer: { edge: state.drawerEdge },
    },
  }
}

export const chapter = defineChapter({
  id: "dialogs",
  defaults: DIALOG_DEFAULTS,
  schema: DIALOG_SCHEMA,
  resolve: resolveDialogs,
  rules: [
    {
      id: "dialogs/frost-only-frosted",
      target: "dialogFrost",
      when: { key: "dialogBackdrop", notIn: ["frosted"] },
      effect: { kind: "hide" },
      cause: "dialogBackdrop",
    },
    {
      // A bled footer is its own edge: a rule or band would draw a second.
      id: "dialogs/bleed-needs-open-footer",
      target: "dialogActions",
      when: {
        key: "dialogSections",
        in: ["divided", "footer-band", "header-band"],
      },
      effect: { kind: "exclude", options: ["bleed"], fallback: "end" },
      cause: "dialogSections",
    },
  ],
})
