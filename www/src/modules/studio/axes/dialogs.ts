/* Dialogs — how a modal layer meets the page and how its panel is built.
   Members: dialog (the panel's parts), modal, drawer; sheets, alert dialogs
   and the command palette shell ride on them.

   Engine: one scrim for every modal layer — `--color-scrim` (the overlay, or
   the page a step darker for Wash, at the strength's alpha) and `--studio-scrim-blur`,
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

export const BACKDROP_VALUES = ["scrim", "frosted", "wash"] as const

export const STRENGTH_VALUES = ["light", "medium", "heavy"] as const

export const FROST_VALUES = ["subtle", "strong"] as const

export const SECTIONS_VALUES = [
  "open",
  "on-scroll",
  "divided",
  "footer-band",
  "header-band",
] as const

export const ACTIONS_VALUES = ["end", "spread", "stack", "bleed"] as const

export const CLOSE_VALUES = ["quiet", "filled", "faint"] as const

export const POSITION_VALUES = ["center", "top"] as const

export const ENTRANCE_VALUES = ["scale", "rise", "drop"] as const

export const EDGE_VALUES = ["docked", "detached"] as const

export const MOBILE_VALUES = ["center", "sheet", "fullscreen"] as const

export const DIALOG_SCHEMA: ChapterSchema<typeof DIALOG_DEFAULTS> = {
  dialogBackdrop: oneOf(BACKDROP_VALUES),
  dialogBackdropStrength: oneOf(STRENGTH_VALUES),
  dialogFrost: oneOf(FROST_VALUES),
  dialogSections: oneOf(SECTIONS_VALUES),
  dialogActions: oneOf(ACTIONS_VALUES),
  dialogClose: oneOf(CLOSE_VALUES),
  dialogPosition: oneOf(POSITION_VALUES),
  dialogEntrance: oneOf(ENTRANCE_VALUES),
  drawerEdge: oneOf(EDGE_VALUES),
  mobileDialogs: oneOf(MOBILE_VALUES),
}

const SCRIM_ALPHA: Record<string, number> = { light: 10, medium: 40, heavy: 80 }
const FROST_BLUR: Record<string, string> = {
  subtle: "var(--blur-xs)",
  strong: "var(--blur-sm)",
}
// The page a step darker: Geist's gray-100 in light, near black in dark.
const WASH = "color-mix(in oklab, var(--color-bg) 96%, var(--color-overlay))"

type Backdrop = Pick<
  typeof DIALOG_DEFAULTS,
  "dialogBackdrop" | "dialogBackdropStrength" | "dialogFrost"
>

const scrimOf = (state: Backdrop) =>
  `color-mix(in oklab, ${state.dialogBackdrop === "wash" ? WASH : "var(--color-overlay)"} ${SCRIM_ALPHA[state.dialogBackdropStrength]}%, transparent)`

const blurOf = (state: Backdrop) =>
  state.dialogBackdrop === "frosted" ? FROST_BLUR[state.dialogFrost] : "0"

/** What base.css and roles.css declare, so Origin ships no token. */
export const ORIGIN_SCRIM = scrimOf(DIALOG_DEFAULTS)
export const ORIGIN_SCRIM_BLUR = blurOf(DIALOG_DEFAULTS)

/** The footer's edge for a Sections pick: none, a rule, or a band. */
const FOOTER_EDGE: Record<string, string> = {
  divided: "-rule",
  "header-band": "-rule",
  "footer-band": "-band",
}

export function resolveDialogs(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  const scrim = scrimOf(state)
  if (scrim !== ORIGIN_SCRIM) tokens["--color-scrim"] = scrim
  const blur = blurOf(state)
  if (blur && blur !== ORIGIN_SCRIM_BLUR) tokens["--studio-scrim-blur"] = blur

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
        motion: state.dialogMotion === "none" ? "none" : state.dialogEntrance,
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
      // Motion hosts the entrance row too: a pin explains it there.
      id: "dialogs/none-pins-entrance",
      target: "dialogEntrance",
      when: { key: "dialogMotion", in: ["none"] },
      effect: { kind: "pin", value: "scale" },
      cause: "dialogMotion",
    },
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
