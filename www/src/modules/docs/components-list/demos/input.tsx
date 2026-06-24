'use client'

import { cn } from '@/registry/lib/utils'
import { Input } from '@/registry/ui/input'

import { demoFocusProps, useTypewriter } from '../autoplay'

export function InputDemo() {
  const { value, active } = useTypewriter('Hello world')
  const focus = demoFocusProps(active)
  return (
    <Input
      value={value}
      readOnly
      placeholder="Enter text..."
      data-demo-focus={focus['data-demo-focus']}
      className={cn('w-full', focus.className)}
    />
  )
}
