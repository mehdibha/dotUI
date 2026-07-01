import { Time } from '@internationalized/date'

import { ClockIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

export default function Demo() {
  return (
    <TimePicker
      className="w-40"
      aria-label="Event time"
      defaultValue={new Time(14, 15)}
    >
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
