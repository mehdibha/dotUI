import { options } from "./core/meta"
import { OTP_STYLE_VALUES } from "./otp-field"

export const OTP_STYLE_OPTIONS = options(OTP_STYLE_VALUES, {
  attached: { label: "Attached", credits: ["shadcn", "Supabase"] },
  separate: {
    label: "Separate",
    credits: ["Ant", "Mantine", "Clerk", "Untitled UI", "shadcn sera"],
  },
})

export const OPTIONS = {
  otpStyle: OTP_STYLE_OPTIONS,
}
