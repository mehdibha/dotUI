/* Inputs — the field family's look. Every field renders through Input /
   InputGroup (TextArea, SearchField, Combobox, DateField, NumberField, OTP),
   so both axes are enum params on `input` and reach them all.

   Engine: `input.style` (the shell) and `input.hover` (the pointer state;
   focus and invalid keep their own border). */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
}

export const STYLE_OPTIONS = [
  {
    value: "outline",
    label: "Outline",
    description:
      "A rounded box with a 1px control border on the field fill; focus " +
      "swaps the border color.",
    seenIn: [
      "shadcn/ui",
      "Radix Themes",
      "Mantine",
      "Chakra UI",
      "Fluent 2",
      "Ant Design",
      "Spectrum 2",
      "Material 3",
      "HeroUI",
      "coss ui",
      "Primer",
    ],
  },
  {
    value: "line",
    label: "Line",
    description:
      "No box and no fill: a single bottom border, text flush with the " +
      "label's left edge.",
    seenIn: ["Chakra UI", "Fluent 2", "Ant Design"],
  },
  {
    value: "filled-line-bottom",
    label: "Filled line",
    description:
      "A filled box with only the top corners rounded, closed by a bottom " +
      "border that takes the focus color.",
    seenIn: ["Material 3", "Carbon"],
  },
  {
    value: "filled",
    label: "Filled",
    description:
      "A rounded box of field fill with no visible border until focus or " +
      "an error draws one.",
    seenIn: ["Mantine", "Chakra UI", "Fluent 2", "Ant Design", "Radix Themes"],
  },
]

export const HOVER_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "The field doesn't react to the pointer.",
    seenIn: ["shadcn/ui", "Radix Themes", "Mantine", "Primer", "coss ui"],
  },
  {
    value: "border",
    label: "Border",
    description:
      "The border darkens one step under the pointer; a line field darkens " +
      "its underline.",
    seenIn: ["Spectrum 2", "Fluent 2", "Ant Design", "Material 3"],
  },
  {
    value: "tint",
    label: "Tint",
    description: "The field's background takes a neutral hover wash.",
    seenIn: ["Material 3", "HeroUI"],
  },
]

export const pick = (
  options: { value: string }[],
  value: string,
  fallback: string,
) => (options.some((o) => o.value === value) ? value : fallback)

export function resolveInputs(state: StudioState): Resolved {
  return {
    params: {
      input: {
        style: pick(STYLE_OPTIONS, state.inputStyle, "outline"),
        hover: pick(HOVER_OPTIONS, state.inputHover, "none"),
      },
    },
  }
}

export const INPUT_SPEC = {
  label: "Inputs",
  description:
    "The shell every text-entry field wears — text field, text area, search, " +
    "combobox, date and number fields, OTP cells — and how it answers the " +
    "pointer. Select triggers are not fields: they render as secondary " +
    "buttons and follow Buttons, so a Line or Filled form still shows " +
    "boxed Selects. Focus and invalid styling live in States.",
  axes: {
    inputStyle: {
      label: "Style",
      description:
        "The field's container: a bordered box, an underline only, a filled " +
        "box closed by an underline, or a borderless filled box. Its corners " +
        "follow the Controls radius role.",
      value: { type: "enum", options: STYLE_OPTIONS },
      guidance:
        "Outline is the default in 10 of 12 checked systems; Carbon's " +
        "default is the filled box with a bottom line, and Material 3 ships " +
        "that and Outline as equals. Filled is the common second variant " +
        "(Mantine, Chakra, Fluent 2, Ant Design, Radix Themes soft). Line " +
        "suits dense forms and editorial layouts; it drops the horizontal " +
        "padding, so it reads best with labels on top.",
    },
    inputHover: {
      label: "Hover",
      description:
        "What an idle field does under the pointer. Focus and invalid " +
        "states keep their own border and override it.",
      value: { type: "enum", options: HOVER_OPTIONS },
      guidance:
        "shadcn/ui, Radix Themes, Mantine, Primer and coss ui " +
        "skip hover; enterprise systems darken the border (Spectrum 2, " +
        "Fluent 2, Ant Design, Material 3 outlined). A tint pairs with the " +
        "Filled styles, where there is no border to darken — Material 3 " +
        "filled uses a state layer, HeroUI tints and darkens together.",
    },
  },
} satisfies ChapterSpec<typeof INPUT_DEFAULTS>
