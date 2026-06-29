import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DateField>
        <Label>small (sm)</Label>
        <DateInput />
      </DateField>
      <DateField>
        <Label>medium (md)</Label>
        <DateInput />
      </DateField>
      <DateField>
        <Label>large (lg)</Label>
        <DateInput />
      </DateField>
    </div>
  )
}
