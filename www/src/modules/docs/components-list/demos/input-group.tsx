'use client'

import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function InputGroupDemo() {
  const { value, active } = useTypewriter('john_doe')
  return (
    <InputGroup className="w-full max-w-[11.5rem]">
      <InputGroupAddon>@</InputGroupAddon>
      {/* Drive the inner control's real focus: the group lights its own ring via
          `has-[[data-input-control][data-focused]]`. */}
      <DemoFocus active={active}>
        <Input value={value} readOnly placeholder="username" />
      </DemoFocus>
    </InputGroup>
  )
}
