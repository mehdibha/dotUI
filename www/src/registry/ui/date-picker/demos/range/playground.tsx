'use client'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { RangeCalendar } from '@/registry/ui/calendar'
import { DateRangePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

interface DateRangePickerPlaygroundProps {
  label?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export function DateRangePickerPlayground({
  label = 'Date range',
  isDisabled = false,
  isReadOnly = false,
}: DateRangePickerPlaygroundProps) {
  return (
    <DateRangePicker isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput slot="start" />
        <span>–</span>
        <DateInput slot="end" />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <DialogContent>
          <RangeCalendar />
        </DialogContent>
      </Popover>
    </DateRangePicker>
  )
}
