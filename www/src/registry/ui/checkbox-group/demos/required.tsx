import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { CheckboxGroup } from '@/registry/ui/checkbox-group'
import { FieldGroup, Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <CheckboxGroup defaultValue={['nextjs']} isRequired>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Checkbox value="nextjs">
          <CheckboxControl />
          <Label>Next.js</Label>
        </Checkbox>
        <Checkbox value="remix">
          <CheckboxControl />
          <Label>Remix</Label>
        </Checkbox>
        <Checkbox value="gatsby">
          <CheckboxControl />
          <Label>Gatsby</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  )
}
