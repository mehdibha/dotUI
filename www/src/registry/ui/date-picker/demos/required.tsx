import { CalendarIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <DatePicker className="w-52" isRequired>
      <Label>Event date</Label>
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Popover>
    </DatePicker>
  )
}
