import { parseDate } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export function DateFieldDemo() {
  return (
    <DateField
      defaultValue={parseDate('2024-06-12')}
      className="w-full max-w-[11.5rem]"
    >
      <Label>Meeting date</Label>
      <DateInput className="w-full" />
    </DateField>
  )
}
