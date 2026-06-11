import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { RangeCalendar } from '@/registry/ui/calendar'
import { DateRangePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DateRangePicker aria-label="Meeting date">
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
      <Drawer placement="bottom">
        <DialogContent>
          <RangeCalendar />
        </DialogContent>
      </Drawer>
    </DateRangePicker>
  )
}
