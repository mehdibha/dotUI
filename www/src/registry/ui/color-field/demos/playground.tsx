"use client"

import { ColorField } from "@/registry/ui/color-field"
import { Description, Label } from "@/registry/ui/field"
import { Input, type InputProps } from "@/registry/ui/input"

export default function Demo({
  label = "Color",
  description = "",
  size = "md",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
}: {
  label?: string
  description?: string
  size?: InputProps["size"]
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isRequired?: boolean
} = {}) {
  return (
    <ColorField
      className="max-w-xs"
      defaultValue="#ff0000"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      <Input data-control-target size={size} />
      {description && <Description>{description}</Description>}
    </ColorField>
  )
}
