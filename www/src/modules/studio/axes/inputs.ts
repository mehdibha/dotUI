/* Inputs — the field family's look. Every field renders through Input /
   InputGroup (TextArea, SearchField, Combobox, DateField, NumberField, OTP),
   so both axes are enum params on `input` and reach them all.

   Engine: `input.style` (the shell) and `input.hover` (the pointer state;
   focus and invalid keep their own border). */

import type { Resolved, StudioState } from "./index"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
}

export const STYLE_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "line", label: "Line" },
  { value: "filled-line-bottom", label: "Filled line" },
  { value: "filled", label: "Filled" },
]

/* Hover: shadcn and Geist ship none (the default here, matching the
   registry), Spectrum and Ant darken the border, Linear tints the fill. */
export const HOVER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "border", label: "Border" },
  { value: "tint", label: "Tint" },
]

export const pick = (
  options: { value: string }[],
  value: string,
  fallback: string,
) => (options.some((o) => o.value === value) ? value : fallback)

export const WIRED = true

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
