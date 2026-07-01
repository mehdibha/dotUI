'use client'

import { ClockIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

interface TimePickerPlaygroundProps {
  label?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export function TimePickerPlayground({
  label = 'Time',
  isDisabled = false,
  isReadOnly = false,
}: TimePickerPlaygroundProps) {
  return (
    <TimePicker
      className="w-40"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      {label && <Label>{label}</Label>}
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button
            variant="default"
            size="sm"
            isIconOnly
            aria-label="Choose time"
          >
            <ClockIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <DialogContent>
          <TimePickerColumns />
        </DialogContent>
      </Popover>
    </TimePicker>
  )
}
