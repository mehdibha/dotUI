'use client'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

interface DatePickerPlaygroundProps {
  label?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export function DatePickerPlayground({
  label = 'Date',
  isDisabled = false,
  isReadOnly = false,
}: DatePickerPlaygroundProps) {
  return (
    <DatePicker isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Popover>
    </DatePicker>
  )
}
