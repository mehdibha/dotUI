'use client'

import React from 'react'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField } from '@/registry/ui/otp-field'

export default function Form() {
  const [value, setValue] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const isInvalid = submitted && value.length !== 6

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <OTPField
        length={6}
        name="verification-code"
        value={value}
        onChange={setValue}
        isInvalid={isInvalid}
      >
        <Label>Verification code</Label>
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
        <Description>Enter the six-digit code sent to your email.</Description>
        <FieldError>Enter all six digits.</FieldError>
      </OTPField>
      <Button type="submit" className="w-fit">
        Submit
      </Button>
    </form>
  )
}
