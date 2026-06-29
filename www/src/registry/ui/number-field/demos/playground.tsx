'use client'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'

export default function Demo({
  label = 'Quantity',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
} = {}) {
  return (
    <NumberField
      className="max-w-xs"
      defaultValue={1}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  )
}
