'use client'

import { cn } from '@/registry/lib/utils'
import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function ColorFieldDemo() {
  const { value, active } = useTypewriter('#7f00ff')
  const focus = demoFocusProps(active)
  return (
    <ColorField defaultValue="#7f007f">
      <Label>Color</Label>
      <Input
        value={value}
        readOnly
        data-demo-focus={focus['data-demo-focus']}
        className={cn('w-36', focus.className)}
      />
    </ColorField>
  )
}
