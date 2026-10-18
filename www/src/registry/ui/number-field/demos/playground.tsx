"use client"

import { Description, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  type NumberFieldGroupProps,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo({
  label = "Quantity",
  description = "",
  size = "md",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
}: {
  label?: string
  description?: string
  size?: NumberFieldGroupProps["size"]
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isRequired?: boolean
} = {}) {
  return (
    <NumberField
      className="max-w-xs"
      defaultValue={1}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      <NumberFieldGroup data-control-target size={size}>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </NumberFieldGroup>
      {description && <Description>{description}</Description>}
    </NumberField>
  )
}
