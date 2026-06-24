'use client'

import { Description, Field, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function FieldDemo() {
  const { value, active } = useTypewriter('john_doe')
  return (
    <Field>
      <Label>Username</Label>
      <Input
        value={value}
        readOnly
        placeholder="Enter username"
        {...demoFocusProps(active)}
      />
      <Description>Choose a unique username</Description>
    </Field>
  )
}
