import { DateField } from '@/registry/ui/date-field'
import { DateInput, InputGroup } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DateField aria-label="Date">
        <DateInput />
      </DateField>
      <DateField aria-label="Date">
        <InputGroup>
          <DateInput />
        </InputGroup>
      </DateField>
    </div>
  )
}
