"use client"

import { ClockIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { DialogContent } from "@/registry/ui/dialog"
import { Description, Label } from "@/registry/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { TimePicker, TimePickerColumns } from "@/registry/ui/time-picker"

export default function Demo({
  label = "Time",
  description = "",
  granularity = "minute",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: {
  label?: string
  description?: string
  granularity?: "hour" | "minute" | "second"
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
} = {}) {
  return (
    <TimePicker
      className="w-40"
      granularity={granularity}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button
            variant="secondary"
            size="sm"
            isIconOnly
            aria-label="Choose time"
          >
            <ClockIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {description && <Description>{description}</Description>}
      <Popover>
        <DialogContent>
          <TimePickerColumns />
        </DialogContent>
      </Popover>
    </TimePicker>
  )
}
