'use client'

import React from 'react'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField } from '@/registry/ui/otp-field'

export default function Controlled() {
  const [value, setValue] = React.useState('123')

  return (
    <div className="flex flex-col gap-3">
      <OTPField length={6} value={value} onChange={setValue}>
        <Label>Verification code</Label>
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
      </OTPField>
      <p className="text-sm text-fg-muted">mirrored code: {value || 'empty'}</p>
    </div>
  )
}
