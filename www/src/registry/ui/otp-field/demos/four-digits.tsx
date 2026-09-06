import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { OTPField, OTPFieldGroup } from "@/registry/ui/otp-field"

export default function FourDigits() {
  return (
    <OTPField length={4}>
      <Label>PIN</Label>
      <OTPFieldGroup>
        <Input />
        <Input aria-label="Digit 2" />
        <Input aria-label="Digit 3" />
        <Input aria-label="Digit 4" />
      </OTPFieldGroup>
    </OTPField>
  )
}
