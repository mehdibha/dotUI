'use client'

import { useState } from 'react'

import { Button } from '@/registry/ui/button'
import { DateField } from '@/registry/ui/date-field'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      noValidate
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <DateField
        name="appointment"
        granularity="minute"
        isRequired
        isInvalid={submitted}
      >
        <Label>Appointment</Label>
        <DateInput />
        <Description>We will confirm your slot by email.</Description>
        <FieldError>Please choose a date and time.</FieldError>
      </DateField>
      <Button type="submit" className="w-full">
        Schedule
      </Button>
    </form>
  )
}
