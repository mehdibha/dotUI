import { DateField } from '@/registry/ui/date-field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DateField className="max-w-xs" aria-label="Meeting date">
      <DateInput />
    </DateField>
  )
}
