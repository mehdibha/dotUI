import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField, OTPFieldSeparator } from '@/registry/ui/otp-field'

export function OTPFieldDemo() {
  return (
    <OTPField length={6}>
      <Label>Code</Label>
      <div className="flex items-center">
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
        </Group>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <Group>
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
      </div>
    </OTPField>
  )
}
