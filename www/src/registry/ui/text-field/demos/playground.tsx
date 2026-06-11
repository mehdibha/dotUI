'use client'

import { Description, FieldError, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo({
  label = 'Email',
  description = '',
  errorMessage = '',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
} = {}) {
  return (
    <TextField
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  )
}
