'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

import { Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField, OTPFieldSeparator } from '@/registry/ui/otp-field'

import { useTypewriter } from '../autoplay'

// Layout effect on the client, no-op on the server (avoids the SSR warning).
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function OTPFieldDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { value, active } = useTypewriter('284917', {
    startDelay: 200,
    charInterval: 220,
    holdAfter: 1600,
  })
  // Focus follows the next empty slot, like a real OTP entry.
  const current = active ? Math.min(value.length, 5) : -1

  // Focus the active input directly, not via a DemoFocus wrapper: the wrapper
  // element would break the Group's direct-child border-collapse/radius selectors.
  useIsoLayoutEffect(() => {
    const inputs = ref.current?.querySelectorAll(
      '[data-slot="otp-field-input"]',
    )
    inputs?.forEach((el, i) => {
      if (i === current) el.setAttribute('data-focused', '')
      else el.removeAttribute('data-focused')
    })
  })

  return (
    <OTPField length={6} value={value} onChange={() => {}}>
      <Label>Code</Label>
      <div ref={ref} className="flex items-center">
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
