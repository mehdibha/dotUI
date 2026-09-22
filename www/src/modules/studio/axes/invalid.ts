/* Invalid — how the system flags a failed value, everywhere at once: the
   danger border with a plain message, an icon leading the message, or
   GOV.UK's left bar with the message above the field.

   Engine: the `error` enum param on `field`. Label and message reorder
   through field's slots; the message build ships a second base file with the
   icon; the bar is a field/styles.css rule on every `data-field` root, driven
   by the value's vars. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const INVALID_DEFAULTS = {
  inputError: "border",
}

export const ERROR_OPTIONS = [
  {
    value: "border",
    label: "Border",
    description:
      "The control's border and the label turn danger; the message below " +
      "is plain danger text.",
    seenIn: ["shadcn/ui", "HeroUI", "coss ui", "Ant Design"],
  },
  {
    value: "message",
    label: "Message",
    description:
      "As Border, and the message line leads with a 1em alert-circle icon, " +
      "so the error doesn't rest on color alone.",
    seenIn: ["Geist", "Primer", "Atlassian", "Polaris", "Cloudscape"],
  },
  {
    value: "bar",
    label: "Bar",
    description:
      "As Border, plus a 3px danger bar down the whole field's left edge " +
      "(content inset 10px), with the label and a bold message moved above " +
      "the control.",
  },
]

export function resolveInvalid(state: StudioState): Resolved {
  const error = ERROR_OPTIONS.some((o) => o.value === state.inputError)
    ? state.inputError
    : "border"
  return { params: { field: { error } } }
}

export const INVALID_SPEC = {
  label: "Invalid",
  description:
    "How every field shows a failed value: its border, label and message.",
  axes: {
    inputError: {
      label: "Invalid",
      description:
        "The invalid treatment every field wears: which marks join the " +
        "danger border, and where the message sits.",
      value: { type: "enum", options: ERROR_OPTIONS },
      guidance:
        "Of 12 checked: 4 stop at the danger border and plain text " +
        "(shadcn, HeroUI, coss ui, Ant Design), 5 lead the message with an " +
        "icon (Geist, Primer, Atlassian, Polaris, Cloudscape), and 3 put " +
        "the icon inside the control instead (Spectrum 2, Carbon, Material " +
        "3). Bar is GOV.UK's pattern for long public-service forms, where an " +
        "error must be found on a scrolled page. Prefer Message when color " +
        "alone can't carry the error.",
    },
  },
} satisfies ChapterSpec<typeof INVALID_DEFAULTS>
