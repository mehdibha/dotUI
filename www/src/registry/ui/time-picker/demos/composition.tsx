'use client'

import { ClockIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

export default function Demo() {
  return (
    <TimePicker className="w-40">
      <Label>Event time</Label>
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
      <Description>Please select a time.</Description>
      <FieldError />
      <Popover>
        <DialogContent>
          <TimePickerColumns />
        </DialogContent>
      </Popover>
    </TimePicker>
  )
}
