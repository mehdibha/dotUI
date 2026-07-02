import { ClockIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

export default function Demo() {
  return (
    <div className="flex w-40 flex-col gap-6">
      <TimePicker>
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
        <Popover>
          <DialogContent>
            <TimePickerColumns />
          </DialogContent>
        </Popover>
      </TimePicker>
      <TimePicker aria-label="Event time">
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
    </div>
  )
}
