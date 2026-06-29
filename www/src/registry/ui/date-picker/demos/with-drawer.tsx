import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DatePicker className="max-w-xs" aria-label="Meeting date">
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Drawer placement="bottom">
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Drawer>
    </DatePicker>
  )
}
