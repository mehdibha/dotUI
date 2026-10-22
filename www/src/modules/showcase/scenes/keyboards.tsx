import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import { OTPField, OTPFieldGroup } from "@/registry/ui/otp-field"
import { TextField } from "@/registry/ui/text-field"

export function KeyboardsScene() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <TextField type="email" autoComplete="email">
        <Label>Email</Label>
        <Input placeholder="you@company.com" />
      </TextField>
      <NumberField
        defaultValue={12.5}
        formatOptions={{ style: "currency", currency: "USD" }}
      >
        <Label>Tip</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <OTPField length={6}>
        <Label>Verification code</Label>
        <OTPFieldGroup>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </OTPFieldGroup>
      </OTPField>
    </div>
  )
}
