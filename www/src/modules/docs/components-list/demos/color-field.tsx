'use client'

import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function ColorFieldDemo() {
  const { value, active } = useTypewriter('#7f00ff')
  return (
    <ColorField defaultValue="#7f007f">
      <Label>Color</Label>
      <DemoFocus active={active}>
        <Input value={value} readOnly className="w-36" />
      </DemoFocus>
    </ColorField>
  )
}
