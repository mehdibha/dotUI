/* OTP field — whether the digit cells attach into one row or stand apart,
   each wearing the field shell. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const OTP_STYLE_VALUES = ["attached", "separate"] as const

export const chapter = defineChapter({
  id: "otp-field",
  defaults: {
    otpStyle: "attached",
  },
  schema: {
    otpStyle: oneOf(OTP_STYLE_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        "otp-field": { cells: state.otpStyle },
      },
    }
  },
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
