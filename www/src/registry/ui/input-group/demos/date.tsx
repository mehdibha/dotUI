import { DateField } from '@/registry/ui/date-field'
import { DateInput, InputGroup } from '@/registry/ui/input'

export default function Demo() {
  return (
    <>
      <DateField aria-label="Date">
        <DateInput />
      </DateField>
      <DateField aria-label="Date">
        <InputGroup>
          <DateInput />
        </InputGroup>
      </DateField>
    </>
  )
}
