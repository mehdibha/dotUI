import { ClockIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { FieldError, Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

export default function Demo() {
  return (
    <TimePicker className="w-40" aria-label="Event time" isInvalid>
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
      <FieldError>Please choose a time during business hours.</FieldError>
      <Popover>
        <DialogContent>
          <TimePickerColumns />
        </DialogContent>
      </Popover>
    </TimePicker>
  )
}
