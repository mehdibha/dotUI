import { Time } from "@internationalized/date"

import { ClockIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TimePicker, TimePickerColumns } from "@/registry/ui/time-picker"

import { OverlayPreview } from "../overlay"

export function TimePickerDemo() {
  return (
    <TimePicker aria-label="Event time" defaultValue={new Time(9, 30)}>
      <OverlayPreview
        variant="popover"
        align="start"
        className="px-6 pt-6"
        surfaceClassName="p-1"
        trigger={
          <InputGroup className="w-40">
            <DateInput />
            <InputGroupAddon>
              <Button variant="secondary" size="sm" isIconOnly>
                <ClockIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        }
      >
        <TimePickerColumns />
      </OverlayPreview>
    </TimePicker>
  )
}
