/* Dialogs — how modal layers meet the page: the scrim under them, and
   whether a dialog centers or docks near the top so its top edge stays put
   as content grows.

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` is a `modal` param. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"
import type { ChapterSpec } from "./spec"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
}

export const BACKDROP_OPTIONS = [
  {
    value: "dim",
    label: "Dim",
    description:
      "A black scrim over the page — 40% with a slight blur under dialogs, " +
      "70% under drawers.",
    seenIn: [
      "shadcn/ui",
      "Material 3",
      "Chakra UI",
      "Base UI",
      "Spectrum 2",
      "Radix Themes",
      "Carbon",
      "HeroUI",
      "Mantine",
      "Primer",
    ],
  },
  {
    value: "blur",
    label: "Blur",
    description:
      "A lighter scrim with a strong blur that frosts the page — 20% black " +
      "with a large blur under dialogs, 50% with a small one under drawers.",
    seenIn: [
      "shadcn/ui",
      "React Aria",
      "coss ui",
      "HeroUI",
      "Ant Design",
      "Mantine",
    ],
  },
  {
    value: "none",
    label: "None",
    description:
      "No scrim: the page stays crisp and the panel's border and shadow " +
      "separate it.",
    seenIn: ["HeroUI"],
  },
]

export const POSITION_OPTIONS = [
  {
    value: "center",
    label: "Center",
    description: "The dialog sits in the middle of the viewport.",
    seenIn: [
      "shadcn/ui",
      "Radix Themes",
      "Base UI",
      "Carbon",
      "Fluent 2",
      "Primer",
      "React Aria",
    ],
  },
  {
    value: "top",
    label: "Top",
    description: "The dialog hangs 10% down from the top and grows downward.",
    seenIn: [
      "Ant Design",
      "Mantine",
      "Chakra UI",
      "Radix Themes",
      "Cloudscape",
      "HeroUI",
    ],
  },
]

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = pick(BACKDROP_OPTIONS, state.dialogBackdrop, "dim")
  const position = pick(POSITION_OPTIONS, state.dialogPosition, "center")
  return {
    params: { modal: { backdrop, position }, drawer: { backdrop } },
  }
}

export const DIALOG_SPEC = {
  label: "Dialogs",
  description:
    "How modal layers meet the page: the scrim under dialogs and drawers, " +
    "and where a dialog rests.",
  axes: {
    dialogBackdrop: {
      label: "Backdrop",
      description:
        "What covers the page under an open dialog or drawer — the two are " +
        "one synced group.",
      value: { type: "enum", options: BACKDROP_OPTIONS },
      guidance:
        "A plain dim scrim is the classic default (shadcn/ui new-york, " +
        "Material 3's 32% scrim, Chakra, Base UI, Spectrum 2, Radix Themes, " +
        "Carbon, Primer). A light scrim with blur is the newer look: " +
        "shadcn/ui's nova style, React Aria's starter, coss ui, and opt-ins " +
        "in HeroUI, Mantine and Ant Design. Only HeroUI offers no scrim; pick it for light, " +
        "non-blocking dialogs with a strong shadow.",
    },
    dialogPosition: {
      label: "Position",
      description:
        "Where a dialog rests in the viewport. Mobile placement lives in " +
        "the Mobile chapter.",
      value: { type: "enum", options: POSITION_OPTIONS },
      guidance:
        "Center is the default in 7 of 10 checked systems (shadcn/ui, Radix " +
        "Themes, Base UI, Carbon, Fluent 2, Primer, React Aria's starter); " +
        "Top is the default in Ant Design (100px), Mantine (5dvh) and " +
        "Chakra, and an option in Radix Themes, Cloudscape and HeroUI. Top " +
        "suits dialogs whose height changes (search, filters), since the " +
        "top edge stays put.",
    },
  },
} satisfies ChapterSpec<typeof DIALOG_DEFAULTS>
