'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { FieldError, Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField } from '@/registry/ui/otp-field'

export default function Demo() {
  const [value, setValue] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [seconds, setSeconds] = React.useState(30)
  const isInvalid = submitted && value.length !== 6

  React.useEffect(() => {
    if (seconds === 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  return (
    <form
      noValidate
      className="flex w-full max-w-xs flex-col gap-4 rounded-lg border bg-bg p-5"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">Two-factor authentication</h3>
        <p className="text-sm text-fg-muted">
          Enter the code from your authenticator app.
        </p>
      </div>
      <OTPField
        length={6}
        name="code"
        value={value}
        onChange={setValue}
        isInvalid={isInvalid}
      >
        <Label className="sr-only">Authentication code</Label>
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
        <FieldError>Enter all six digits.</FieldError>
      </OTPField>
      <Button type="submit" className="w-full">
        Verify
      </Button>
      <Button
        type="button"
        variant="quiet"
        size="sm"
        className="w-full"
        isDisabled={seconds > 0}
        onPress={() => {
          setSeconds(30)
          setValue('')
          setSubmitted(false)
        }}
      >
        {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
      </Button>
    </form>
  )
}
