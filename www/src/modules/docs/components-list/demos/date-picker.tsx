import { parseDate } from '@internationalized/date'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DateField } from '@/registry/ui/date-field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'

import { OverlayScene } from '../overlay-scene'

const VALUE = parseDate('2024-06-12')

// The trigger is the real closed input group; the surface is the real Calendar,
// its selection matching the date shown in the field.
export function DatePickerDemo() {
  return (
    <OverlayScene
      variant="popover"
      side="bottom"
      fluid
      openScale={0.6}
      surfaceClassName="p-2"
      trigger={
        <DateField
          className="w-full max-w-[11.5rem]"
          aria-label="Date"
          defaultValue={VALUE}
        >
          <InputGroup className="w-full">
            <DateInput />
            <InputGroupAddon>
              <Button variant="secondary" size="sm" isIconOnly>
                <CalendarIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </DateField>
      }
    >
      <Calendar aria-label="Date" className="mx-auto" defaultValue={VALUE} />
    </OverlayScene>
  )
}
