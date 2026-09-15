"use client"

/* OTP field — how the digit cells sit (axes/otp-field.ts). The field look
   comes from the Inputs section. */

import { OTP_STYLE_OPTIONS } from "../axes/otp-field"
import { ControlGroup, SelectRow } from "../rows"
import type { Studio } from "../state"

export function OtpFieldSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Cells"
        value={state.otpStyle}
        onChange={set("otpStyle")}
        options={OTP_STYLE_OPTIONS}
      />
    </ControlGroup>
  )
}
