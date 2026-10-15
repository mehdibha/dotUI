"use client"

import { DateField } from "@/registry/ui/date-field"
import { Description, Label } from "@/registry/ui/field"
import { DateInput } from "@/registry/ui/input"

export default function Demo({
  label = "Date",
  description = "",
  granularity = "day",
  size = "md",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
}: {
  label?: string
  description?: string
  granularity?: "day" | "hour" | "minute" | "second"
  size?: "sm" | "md" | "lg"
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isRequired?: boolean
} = {}) {
  return (
    <DateField
      className="max-w-xs"
      granularity={granularity}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      <DateInput data-control-target size={size} />
      {description && <Description>{description}</Description>}
    </DateField>
  )
}
