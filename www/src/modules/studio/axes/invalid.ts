/* Invalid — how the system flags a failed value, everywhere at once. One
   axis, treatment: the danger border with a plain message (dotUI today,
   shadcn) vs the message line carrying an icon (Material, Spectrum, Carbon,
   Polaris) vs GOV.UK's left bar with a bold message above the field.

   Engine: the `error` enum param on `field` — every field root (text field,
   select, date picker…) wears the field styles. */

import type { Resolved, StudioState } from "./index"

export const INVALID_DEFAULTS = {
  inputError: "border",
}

export const ERROR_OPTIONS = [
  { value: "border", label: "Border" },
  { value: "message", label: "Message" },
  { value: "bar", label: "Bar" },
]

export const WIRED = true

export function resolveInvalid(state: StudioState): Resolved {
  const error = ERROR_OPTIONS.some((o) => o.value === state.inputError)
    ? state.inputError
    : "border"
  return { params: { field: { error } } }
}
