"use client"

import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo({
  label = "Quantity",
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
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}
