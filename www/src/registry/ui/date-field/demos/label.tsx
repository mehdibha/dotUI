import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DateField aria-label="Meeting date">
        <Label>Meeting date</Label>
        <DateInput />
      </DateField>
      <DateField aria-label="Meeting date" />
    </div>
  )
}
