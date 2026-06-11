'use client'

import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  return (
    <ColorField>
      <Label>Color</Label>
      <Input />
    </ColorField>
  )
}
