'use client'

import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function ColorFieldDemo() {
  const { value, active } = useTypewriter('#7f00ff')
  return (
    <ColorField defaultValue="#7f007f" className="w-full max-w-[11.5rem]">
      <Label>Color</Label>
      <DemoFocus active={active}>
        <Input value={value} readOnly className="w-full" />
      </DemoFocus>
    </ColorField>
  )
}
