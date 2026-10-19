"use client"

import { Description, Label } from "@/registry/ui/field"
import { DateInput, type DateInputProps } from "@/registry/ui/input"
import { TimeField } from "@/registry/ui/time-field"

export default function Demo({
  label = "Time",
  description = "",
  granularity = "minute",
  size = "md",
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: {
  label?: string
  description?: string
  granularity?: "hour" | "minute" | "second"
  size?: DateInputProps["size"]
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
} = {}) {
  return (
    <TimeField
      className="max-w-xs"
      granularity={granularity}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <DateInput data-control-target size={size} />
      {description && <Description>{description}</Description>}
    </TimeField>
  )
}
