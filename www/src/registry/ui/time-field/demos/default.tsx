import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField className="max-w-xs">
      <Label>Event time</Label>
      <DateInput />
    </TimeField>
  )
}
