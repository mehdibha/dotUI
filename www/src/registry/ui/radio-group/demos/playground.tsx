"use client"

import { Description, FieldError, FieldGroup, Label } from "@/registry/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  type RadioGroupProps,
} from "@/registry/ui/radio-group"

export default function Demo({
  label = "Select frameworks",
  description = "",
  errorMessage = "",
  orientation = "vertical",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isInvalid = false,
}: RadioGroupProps & {
  label?: string
  description?: string
  errorMessage?: string
} = {}) {
  return (
    <RadioGroup
      defaultValue="react"
      orientation={orientation}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
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
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </RadioGroup>
  )
}
