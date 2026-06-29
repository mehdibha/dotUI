'use client'

import { parseAbsoluteToLocal } from '@internationalized/date'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DatePicker
        granularity="hour"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Hour</Label>
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

      <DatePicker
        granularity="minute"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Minute</Label>
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

      <DatePicker
        granularity="second"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Second</Label>
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
    </div>
  )
}
