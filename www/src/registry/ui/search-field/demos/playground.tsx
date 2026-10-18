"use client"

import { Description, Label } from "@/registry/ui/field"
import { Input, type InputProps } from "@/registry/ui/input"
import { SearchField } from "@/registry/ui/search-field"

export default function Demo({
  label = "Search",
  description = "",
  placeholder = "Search...",
  size = "md",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: {
  label?: string
  description?: string
  placeholder?: string
  size?: InputProps["size"]
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
} = {}) {
  return (
    <SearchField
      className="max-w-xs"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <Input data-control-target placeholder={placeholder} size={size} />
      {description && <Description>{description}</Description>}
    </SearchField>
  )
}
