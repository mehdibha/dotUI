'use client'

import { Description, FieldError, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo({
  label = 'Description',
  placeholder = 'Enter description...',
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
      <TextArea data-control-target placeholder={placeholder} />
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  )
}
