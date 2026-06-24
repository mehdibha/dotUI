'use client'

import { cn } from '@/registry/lib/utils'
import { TextArea } from '@/registry/ui/input'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function TextAreaDemo() {
  const { value, active } = useTypewriter('Tell us a bit about yourself.')
  const focus = demoFocusProps(active)
  return (
    <TextArea
      value={value}
      onChange={() => {}}
      placeholder="Enter description..."
      data-demo-focus={focus['data-demo-focus']}
      className={cn('w-full', focus.className)}
    />
  )
}
