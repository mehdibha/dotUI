import { parseDate } from '@internationalized/date'

import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { RangeCalendar } from '@/registry/ui/calendar'
import { DateRangePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <DateRangePicker
      className="w-52"
      aria-label="Meeting date"
      defaultValue={{
        start: parseDate('2020-02-03'),
        end: parseDate('2020-02-12'),
      }}
    >
      <InputGroup>
        <DateInput slot="start" />
        <span>–</span>
        <DateInput slot="end" />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <DialogContent>
          <RangeCalendar />
        </DialogContent>
      </Popover>
    </DateRangePicker>
  )
}
