'use client'

import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function TextFieldDemo() {
  const { value, active } = useTypewriter('hello@example.com')
  return (
    <TextField className="w-56" value={value} onChange={() => {}}>
      <Label>Email</Label>
      <Input placeholder="hello@example.com" {...demoFocusProps(active)} />
      <Description>Enter your email.</Description>
    </TextField>
  )
}
