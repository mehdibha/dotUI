'use client'

import { FieldGroup, Label } from '@/registry/ui/field'
import {
  Radio,
  RadioControl,
  RadioGroup,
  type RadioGroupProps,
} from '@/registry/ui/radio-group'

export default function Demo({
  label = 'Select frameworks',
  orientation = 'vertical',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: RadioGroupProps & { label?: string } = {}) {
  return (
    <RadioGroup
      defaultValue="react"
      orientation={orientation}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <Radio value="react">
          <RadioControl />
          <Label>React</Label>
        </Radio>
        <Radio value="vue">
          <RadioControl />
          <Label>Vue</Label>
        </Radio>
        <Radio value="angular">
          <RadioControl />
          <Label>Angular</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}
