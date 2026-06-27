'use client'

import { Description, Field, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function FieldDemo() {
  const { value, active } = useTypewriter('john_doe')
  return (
    <Field className="w-full max-w-[11.5rem]">
      <Label>Username</Label>
      <DemoFocus active={active}>
        <Input value={value} readOnly placeholder="Enter username" />
      </DemoFocus>
      <Description>Choose a unique username</Description>
    </Field>
  )
}
