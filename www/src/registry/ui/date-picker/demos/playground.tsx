"use client"

import type { DateValue } from "react-aria-components/DatePicker"

import { CalendarIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import { DatePicker, type DatePickerProps } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { Description, Label } from "@/registry/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"

export default function Demo({
  label = "Date",
  description = "",
  granularity = "day",
  firstDayOfWeek = "sun",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
}: {
  label?: string
  description?: string
  granularity?: DatePickerProps<DateValue>["granularity"]
  firstDayOfWeek?: DatePickerProps<DateValue>["firstDayOfWeek"]
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isRequired?: boolean
} = {}) {
  return (
    <DatePicker
      className="w-fit min-w-52"
      granularity={granularity}
      firstDayOfWeek={firstDayOfWeek}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="secondary" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {description && <Description>{description}</Description>}
      <Popover>
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Popover>
    </DatePicker>
  )
}
