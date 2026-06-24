'use client'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField, OTPFieldSeparator } from '@/registry/ui/otp-field'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function OTPFieldDemo() {
  const { value, active } = useTypewriter('284917', {
    charInterval: 220,
    holdAfter: 1600,
  })
  const focus = demoFocusProps(active)
  return (
    <OTPField length={6} value={value} onChange={() => {}}>
      <Label>Code</Label>
      <div className="flex items-center">
        <Group>
          <Input {...focus} />
          <Input aria-label="Digit 2" {...focus} />
          <Input aria-label="Digit 3" {...focus} />
        </Group>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <Group>
          <Input aria-label="Digit 4" {...focus} />
          <Input aria-label="Digit 5" {...focus} />
          <Input aria-label="Digit 6" {...focus} />
        </Group>
      </div>
    </OTPField>
  )
}
