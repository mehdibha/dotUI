import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <TimeField>
        <Label>Event time</Label>
        <DateInput />
      </TimeField>
      <TimeField aria-label="Event time" />
    </div>
  )
}
