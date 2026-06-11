import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <>
      <DateField aria-label="Meeting date">
        <Label>Meeting date</Label>
        <DateInput />
      </DateField>
      <DateField aria-label="Meeting date" />
    </>
  )
}
