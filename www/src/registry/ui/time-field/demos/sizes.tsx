import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <>
      <TimeField>
        <Label>small (sm)</Label>
        <DateInput size="sm" />
      </TimeField>
      <TimeField>
        <Label>medium (md)</Label>
        <DateInput size="md" />
      </TimeField>
      <TimeField>
        <Label>large (lg)</Label>
        <DateInput size="lg" />
      </TimeField>
    </>
  )
}
