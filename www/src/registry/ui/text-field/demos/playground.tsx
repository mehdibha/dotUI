"use client"

import { Description, FieldError, Label } from "@/registry/ui/field"
import { Input, type InputProps } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export default function Demo({
  label = "Email",
  placeholder = "",
  description = "",
  errorMessage = "",
  size = "md",
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: {
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  size?: InputProps["size"]
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
} = {}) {
  return (
    <TextField
      className="max-w-xs"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <Input data-control-target placeholder={placeholder} size={size} />
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  )
}
