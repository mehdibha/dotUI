import { CalendarIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import { DatePicker } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Sheet } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <DatePicker className="w-52" aria-label="Meeting date">
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="secondary" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Sheet>
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Sheet>
    </DatePicker>
  )
}
