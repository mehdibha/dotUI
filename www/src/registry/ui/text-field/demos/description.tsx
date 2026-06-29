'use client'

import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField className="max-w-xs">
      <Label>Email</Label>
      <Input placeholder="hello@example.com" />
      <Description>Enter your email.</Description>
    </TextField>
  )
}
