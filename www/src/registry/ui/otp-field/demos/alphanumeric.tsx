import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField } from '@/registry/ui/otp-field'

export default function Alphanumeric() {
  return (
    <OTPField length={6} validationType="alphanumeric">
      <Label>Recovery code</Label>
      <Group>
        <Input />
        <Input aria-label="Character 2" />
        <Input aria-label="Character 3" />
        <Input aria-label="Character 4" />
        <Input aria-label="Character 5" />
        <Input aria-label="Character 6" />
      </Group>
    </OTPField>
  )
}
