'use client'

import { parseDate } from '@internationalized/date'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DateField } from '@/registry/ui/date-field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

const VALUE = parseDate('2024-06-12')

// Trigger → hover → click → the calendar popover unfolds and the scene zooms out.
// The trigger is the real closed input group; the surface is the real Calendar,
// its selection matching the date shown in the field.
export function DatePickerDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
      variant="popover"
      side="bottom"
      fluid
      surfaceClassName="p-2"
      trigger={
        <DateField
          className="w-full max-w-[14rem]"
          aria-label="Date"
          value={VALUE}
          onChange={() => {}}
        >
          <InputGroup className="w-full">
            <DateInput />
            <InputGroupAddon>
              <Button variant="default" size="sm" isIconOnly>
                <CalendarIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </DateField>
      }
    >
      <Calendar
        aria-label="Date"
        className="mx-auto"
        value={VALUE}
        onChange={() => {}}
      />
    </OverlayScene>
  )
}
