'use client'

import React from 'react'
import { Mail } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField } from '@/registry/ui/otp-field'

const CORRECT_CODE = '123456'

export default function Demo() {
  const [value, setValue] = React.useState('')
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (value.length !== 6) {
      setError('Enter all six digits.')
      return
    }
    setError(null)
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      if (value !== CORRECT_CODE) {
        setError('That code is incorrect or expired.')
      }
    }, 1200)
  }

  return (
    <form
      noValidate
      className="flex w-full max-w-xs flex-col gap-4 rounded-lg border bg-bg p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mail className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">Verify your email</h3>
        <p className="text-sm text-fg-muted">We sent a code to jane@acme.com</p>
      </div>
      <OTPField
        length={6}
        name="code"
        value={value}
        onChange={(next) => {
          setValue(next)
          if (error) setError(null)
        }}
        isInvalid={Boolean(error)}
        isDisabled={isPending}
      >
        <Label className="sr-only">Email verification code</Label>
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <Description>The code expires in 10 minutes.</Description>
        )}
      </OTPField>
      <Button type="submit" className="w-full" isPending={isPending}>
        Continue
      </Button>
    </form>
  )
}
