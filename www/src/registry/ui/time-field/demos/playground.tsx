'use client'

import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo({
  label = 'Time',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
} = {}) {
  return (
    <TimeField
      className="max-w-xs"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <DateInput />
    </TimeField>
  )
}
