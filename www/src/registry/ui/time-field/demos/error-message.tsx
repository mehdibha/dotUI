import { FieldError, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField isInvalid>
      <Label>Meeting time</Label>
      <DateInput />
      <FieldError>Meetings start every 15 minutes.</FieldError>
    </TimeField>
  )
}
