import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { CheckboxGroup } from '@/registry/ui/checkbox-group'
import { Description, FieldGroup, Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <div className="w-full max-w-xs space-y-6">
      <CheckboxGroup defaultValue={['email', 'push']}>
        <Label>Channels</Label>
        <Description>Where we reach you.</Description>
        <FieldGroup>
          <Checkbox value="email">
            <CheckboxControl />
            <Label>Email</Label>
          </Checkbox>
          <Checkbox value="sms">
            <CheckboxControl />
            <Label>SMS</Label>
          </Checkbox>
          <Checkbox value="push">
            <CheckboxControl />
            <Label>Push</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
      <CheckboxGroup defaultValue={['updates', 'security']}>
        <Label>Notification types</Label>
        <Description>What we notify you about.</Description>
        <FieldGroup>
          <Checkbox value="marketing">
            <CheckboxControl />
            <Label>Marketing</Label>
          </Checkbox>
          <Checkbox value="updates">
            <CheckboxControl />
            <Label>Product updates</Label>
          </Checkbox>
          <Checkbox value="security">
            <CheckboxControl />
            <Label>Security alerts</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
    </div>
  )
}
