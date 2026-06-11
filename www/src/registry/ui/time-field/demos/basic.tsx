import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField aria-label="Event time">
      <DateInput />
    </TimeField>
  )
}
