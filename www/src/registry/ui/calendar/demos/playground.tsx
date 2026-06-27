'use client'

import { Calendar } from '@/registry/ui/calendar'

export default function Demo({
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
} = {}) {
  return (
    <Calendar
      aria-label="Date"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    />
  )
}
