'use client'

import { TextArea } from '@/registry/ui/input'

import { DemoFocus, useTypewriter } from '../autoplay'

export function TextAreaDemo() {
  const { value, active } = useTypewriter('Tell us a bit about yourself.')
  return (
    <DemoFocus active={active}>
      <TextArea
        value={value}
        onChange={() => {}}
        placeholder="Enter description..."
        className="w-full"
      />
    </DemoFocus>
  )
}
