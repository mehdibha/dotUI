/* OTP field — how the digit cells sit: one attached group with hairline
   dividers (the registry today, shadcn), separate boxes (iOS), or a bare
   dash per digit (Material-ish minimal). Cells wear the Inputs style.

   Engine: `otp-field.cells` styles the OTPFieldGroup that lays the inputs out. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const OTP_FIELD_DEFAULTS = {
  otpStyle: "group",
}

export const OTP_STYLE_OPTIONS = [
  { value: "group", label: "Group" },
  { value: "boxes", label: "Boxes" },
  { value: "underline", label: "Underline" },
]

export const OTP_FIELD_SCHEMA: Schema<typeof OTP_FIELD_DEFAULTS> = {
  otpStyle: oneOf(OTP_STYLE_OPTIONS),
}

export function resolveOtpField(state: StudioState): Resolved {
  return { params: { "otp-field": { cells: state.otpStyle } } }
}
