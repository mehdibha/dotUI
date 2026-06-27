'use client'

import { Button } from '@/registry/ui/button'

import { DemoPress, useAutoplay } from '../autoplay'

export function ButtonDemo() {
  const { phase } = useAutoplay([
    { name: 'idle', duration: 850 },
    { name: 'hover', duration: 520 },
    { name: 'press', duration: 260 },
  ])
  return (
    <DemoPress phase={phase}>
      <Button>Button</Button>
    </DemoPress>
  )
}
