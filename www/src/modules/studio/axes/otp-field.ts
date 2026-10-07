/* OTP field — whether the digit cells attach into one row or stand apart,
   each wearing the field shell. Engine: `otp-field.cells` styles the group
   that lays the inputs out. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const OTP_FIELD_DEFAULTS = {
  otpStyle: "attached",
}

export const OTP_STYLE_VALUES = ["attached", "separate"] as const

export const OTP_FIELD_SCHEMA: ChapterSchema<typeof OTP_FIELD_DEFAULTS> = {
  otpStyle: oneOf(OTP_STYLE_VALUES),
}

export function resolveOtpField(state: Effective): Resolved {
  return {
    params: {
      "otp-field": { cells: state.otpStyle },
    },
  }
}

export const chapter = defineChapter({
  id: "otp-field",
  defaults: OTP_FIELD_DEFAULTS,
  schema: OTP_FIELD_SCHEMA,
  resolve: resolveOtpField,
  rules: [
    {
      // Attached cells' bottom rules merge into one line.
      id: "otp-field/underline-separates-cells",
      target: "otpStyle",
      when: { key: "inputStyle", in: ["underline", "indicator"] },
      effect: { kind: "pin", value: "separate" },
      cause: "inputStyle",
    },
  ],
})
