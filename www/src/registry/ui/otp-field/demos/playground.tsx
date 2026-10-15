"use client"

import { Description, FieldError, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { OTPField, OTPFieldGroup } from "@/registry/ui/otp-field"

export default function Demo({
  label = "Verification code",
  description = "",
  errorMessage = "",
  length = 6,
  mask = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
} = {}) {
  return (
    <OTPField
      length={length}
      mask={mask}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <OTPFieldGroup>
        {Array.from({ length }, (_, index) => (
          <Input key={index} />
        ))}
      </OTPFieldGroup>
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </OTPField>
  )
}
