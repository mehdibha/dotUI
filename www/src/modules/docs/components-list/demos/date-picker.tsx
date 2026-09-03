import { parseDate } from "@internationalized/date"

import { CalendarIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import { DateField } from "@/registry/ui/date-field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"

import { OverlayPreview } from "../overlay"

const VALUE = parseDate("2024-06-12")

export function DatePickerDemo() {
  return (
    <OverlayPreview
      variant="popover"
      align="start"
      className="px-6 pt-6"
      surfaceClassName="flex w-full justify-center p-2"
      trigger={
        <DateField className="w-full" aria-label="Date" defaultValue={VALUE}>
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
      <Calendar aria-label="Date" defaultValue={VALUE} />
    </OverlayPreview>
  )
}
