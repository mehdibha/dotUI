'use client'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'

import { DemoPress, useStepAutoplay } from '../autoplay'

export function NumberFieldDemo() {
  const { index, pressing } = useStepAutoplay(5, { initial: 0, dwell: 950 })
  return (
    <NumberField value={10 + index} onChange={() => {}}>
      <Label>Quantity</Label>
      <Group>
        <NumberFieldDecrement />
        <Input className="w-16" />
        <DemoPress pressing={pressing}>
          <NumberFieldIncrement />
        </DemoPress>
      </Group>
    </NumberField>
  )
}
