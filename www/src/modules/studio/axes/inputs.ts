/* Inputs — the field family's look. Every field renders through Input /
   InputGroup (TextArea, SearchField, Combobox, DateField, NumberField, OTP),
   so both axes are enum params on `input` and reach them all.

   Engine: `input.style` (the shell) and `input.hover` (the pointer state;
   focus and invalid keep their own border); the focus transition rides the
   `--studio-input-state-*` vars, which the token field reads too. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's input, textarea and input group: `transition-colors` on
   Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
  inputMotion: MOTION,
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

export const INPUT_SCHEMA: ChapterSchema<typeof INPUT_DEFAULTS> = {
  inputStyle: oneOf(STYLE_OPTIONS),
  inputHover: oneOf(HOVER_OPTIONS),
  inputMotion: STATE_CHANGE,
}

export function resolveInputs(state: Effective): Resolved {
  return {
    tokens: resolveStateChange("input", state.inputMotion, MOTION),
    params: {
      input: {
        style: state.inputStyle,
        hover: state.inputHover,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "inputs",
  defaults: INPUT_DEFAULTS,
  schema: INPUT_SCHEMA,
  resolve: resolveInputs,
})
