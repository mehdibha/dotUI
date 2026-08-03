import { FieldGroup, Label } from '@/registry/ui/field'
import { Radio, RadioControl, RadioGroup } from '@/registry/ui/radio-group'

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="nextjs">
      <Label>React frameworks</Label>
      <FieldGroup>
        <Radio value="nextjs">
          <RadioControl />
          <Label>Next.js</Label>
        </Radio>
        <Radio value="remix">
          <RadioControl />
          <Label>Remix</Label>
        </Radio>
        <Radio value="gatsby">
          <RadioControl />
          <Label>Gatsby</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}
