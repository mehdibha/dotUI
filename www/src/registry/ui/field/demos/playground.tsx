"use client"

import {
  Description,
  Field,
  FieldContent,
  FieldError,
  Label,
  type FieldProps,
} from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export default function Demo({
  orientation = "vertical",
  label = "Username",
  description = "Choose a unique username.",
  errorMessage = "This username is already taken.",
  isInvalid = false,
}: {
  orientation?: FieldProps["orientation"]
  label?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
} = {}) {
  return (
    <Field orientation={orientation} className="max-w-sm">
      <FieldContent>
        {label && <Label id="username-label">{label}</Label>}
        {description && <Description>{description}</Description>}
      </FieldContent>
      <TextField
        data-control-target
        aria-labelledby="username-label"
        isInvalid={isInvalid}
      >
        <Input placeholder="johndoe" />
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </TextField>
    </Field>
  )
}
