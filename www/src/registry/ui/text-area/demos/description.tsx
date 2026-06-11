'use client'

import { Description, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField>
      <Label>Description</Label>
      <TextArea />
      <Description>Type your description</Description>
    </TextField>
  )
}
