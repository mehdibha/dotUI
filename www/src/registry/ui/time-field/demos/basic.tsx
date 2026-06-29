import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField className="max-w-xs" aria-label="Event time">
      <DateInput />
    </TimeField>
  )
}
