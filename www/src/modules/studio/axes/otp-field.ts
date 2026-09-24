/* OTP field — how the digit cells sit: one attached group with hairline
   dividers, separate boxes, or a bare underline per digit. Cells wear the
   Inputs style.

   Engine: `otp-field.cells` styles the OTPFieldGroup that lays the inputs out. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./inputs"
import type { ChapterSpec } from "./spec"

export const OTP_FIELD_DEFAULTS = {
  otpStyle: "group",
}

export const OTP_STYLE_OPTIONS = [
  {
    value: "group",
    label: "Group",
    description:
      "One continuous field split into digit cells by shared 1px borders; " +
      "only the outer corners are rounded.",
    seenIn: ["shadcn/ui", "Chakra UI"],
  },
  {
    value: "boxes",
    label: "Boxes",
    description:
      "Each digit in its own field wearing the Inputs style and its corner " +
      "radius, 8px apart.",
    seenIn: ["HeroUI", "coss ui", "Mantine", "Ant Design", "Chakra UI"],
  },
  {
    value: "underline",
    label: "Underline",
    description:
      "No boxes or fill: a 2px bottom line under each digit, 8px apart.",
    seenIn: ["Ant Design", "Chakra UI"],
  },
]

export function resolveOtpField(state: StudioState): Resolved {
  return {
    params: {
      "otp-field": { cells: pick(OTP_STYLE_OPTIONS, state.otpStyle, "group") },
    },
  }
}

export const OTP_FIELD_SPEC = {
  label: "OTP field",
  description:
    "How the one-time-code field lays out its digit cells. Each cell wears " +
    "the Inputs style unless Underline replaces it.",
  axes: {
    otpStyle: {
      label: "OTP field",
      description:
        "Whether digit cells join into one attached field, stand as separate " +
        "boxes, or reduce to an underline each.",
      value: { type: "enum", options: OTP_STYLE_OPTIONS },
      guidance:
        "Separate boxes are the default in 5 of 6 checked systems (HeroUI, " +
        "coss ui, Mantine, Ant Design, Chakra); shadcn/ui's attached group " +
        "is the exception, and Chakra offers it as `attached`. Underline " +
        "matches a Line input style (Ant's and Chakra's underlined/flushed " +
        "variants).",
    },
  },
} satisfies ChapterSpec<typeof OTP_FIELD_DEFAULTS>
