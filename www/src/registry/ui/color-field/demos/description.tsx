'use client'

import { ColorField } from '@/registry/ui/color-field'
import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  return (
    <ColorField>
      <Label>Color</Label>
      <Input />
      <Description>Enter a background color.</Description>
    </ColorField>
  )
}
