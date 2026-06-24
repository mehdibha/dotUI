import { parseDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-react'
import {
  Button,
  Calendar,
  DateInput,
  DatePicker,
  DialogContent,
  InputGroup,
  InputGroupAddon,
  Popover,
} from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

export const Default = () => (
  <div style={wrap}>
    <DatePicker
      defaultOpen
      aria-label="Meeting date"
      defaultValue={parseDate('2025-06-18')}
    >
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="default" size="sm" isIconOnly aria-label="calendar">
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
  </div>
)
