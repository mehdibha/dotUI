import { Input } from "@/registry/ui/input"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field"

export function OTPFieldDemo() {
  return (
    <OTPField length={6} defaultValue="2849">
      <div className="flex items-center">
        <OTPFieldGroup>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
        </OTPFieldGroup>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <OTPFieldGroup>
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </OTPFieldGroup>
      </div>
    </OTPField>
  )
}
