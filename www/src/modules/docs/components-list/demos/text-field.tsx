'use client'

import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

import { DemoFocus, useTypewriter } from '../autoplay'

export function TextFieldDemo() {
  const { value, active } = useTypewriter('hello@example.com')
  return (
    <TextField
      className="w-full max-w-[14rem]"
      value={value}
      onChange={() => {}}
    >
      <Label>Email</Label>
      <DemoFocus active={active}>
        <Input placeholder="hello@example.com" />
      </DemoFocus>
      <Description>Enter your email.</Description>
    </TextField>
  )
}
