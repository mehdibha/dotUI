"use client"

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { Description, Label } from "@/registry/ui/field"

export default function Demo({
  label = "Accept terms",
  description = "",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
  isIndeterminate = false,
} = {}) {
  return (
    <Checkbox
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isIndeterminate={isIndeterminate}
    >
      <CheckboxControl />
      <div className="flex flex-col gap-1">
        {label && <Label>{label}</Label>}
        {description && <Description>{description}</Description>}
      </div>
    </Checkbox>
  )
}
