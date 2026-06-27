'use client'

import { Input } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function InputDemo() {
  const { value, active } = useTypewriter('Hello world')
  return (
    <DemoFocus active={active}>
      <Input
        value={value}
        readOnly
        placeholder="Enter text..."
        className="w-full max-w-[11.5rem]"
      />
    </DemoFocus>
  )
}
