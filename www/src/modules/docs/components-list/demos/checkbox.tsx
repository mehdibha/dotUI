'use client'

import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'

import { DemoPress, useToggleAutoplay } from '../autoplay'

export function CheckboxDemo() {
  const { selected, pressing } = useToggleAutoplay({ initial: true })
  return (
    <Checkbox isSelected={selected} onChange={() => {}}>
      <DemoPress pressing={pressing}>
        <CheckboxControl />
      </DemoPress>
      <Label>Accept terms</Label>
    </Checkbox>
  )
}
