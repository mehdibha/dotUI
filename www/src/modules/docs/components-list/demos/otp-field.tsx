'use client'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField, OTPFieldSeparator } from '@/registry/ui/otp-field'

import { DemoFocus, useTypewriter } from '../autoplay'

export function OTPFieldDemo() {
  const { value, active } = useTypewriter('284917', {
    charInterval: 220,
    holdAfter: 1600,
  })
  // Focus follows the digit being entered (the next empty slot), like a real OTP.
  const current = Math.min(value.length, 5)
  const digit = (i: number, label?: string) => (
    <DemoFocus active={active && i === current}>
      <Input aria-label={label} />
    </DemoFocus>
  )
  return (
    <OTPField length={6} value={value} onChange={() => {}}>
      <Label>Code</Label>
      <div className="flex items-center">
        <Group>
          {digit(0)}
          {digit(1, 'Digit 2')}
          {digit(2, 'Digit 3')}
        </Group>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <Group>
          {digit(3, 'Digit 4')}
          {digit(4, 'Digit 5')}
          {digit(5, 'Digit 6')}
        </Group>
      </div>
    </OTPField>
  )
}
