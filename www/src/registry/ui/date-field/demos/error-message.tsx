import { DateField } from '@/registry/ui/date-field'
import { FieldError, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DateField className="max-w-xs" isInvalid>
      <Label>Event date</Label>
      <DateInput />
      <FieldError>Please select a date.</FieldError>
    </DateField>
  )
}
