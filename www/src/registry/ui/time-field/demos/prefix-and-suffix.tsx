import { TimerIcon } from '@/registry/__generated__/icons'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <TimeField aria-label="Event time">
        <InputGroup>
          <InputGroupAddon>
            <TimerIcon />
          </InputGroupAddon>
          <DateInput />
        </InputGroup>
      </TimeField>
      <TimeField aria-label="Event time">
        <InputGroup>
          <DateInput />
          <InputGroupAddon>
            <TimerIcon />
          </InputGroupAddon>
        </InputGroup>
      </TimeField>
    </div>
  )
}
