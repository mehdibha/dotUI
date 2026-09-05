import type { Resolved, StudioState } from "./index"

export const OTP_FIELD_DEFAULTS = {
  otpStyle: "boxes",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveOtpField(_state: StudioState): Resolved {
  return {}
}
