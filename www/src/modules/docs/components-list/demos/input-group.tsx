'use client'

import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function InputGroupDemo() {
  const { value, active } = useTypewriter('john_doe')
  return (
    <InputGroup className="w-full" {...demoFocusProps(active)}>
      <InputGroupAddon>@</InputGroupAddon>
      <Input value={value} readOnly placeholder="username" />
    </InputGroup>
  )
}
