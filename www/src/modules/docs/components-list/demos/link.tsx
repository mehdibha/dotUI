'use client'

import { Link } from '@/registry/ui/link'

import { DemoPress, useAutoplay } from '../autoplay'

export function LinkDemo() {
  const { phase } = useAutoplay([
    { name: 'idle', duration: 950 },
    { name: 'hover', duration: 620 },
    { name: 'press', duration: 200 },
  ])
  return (
    <DemoPress phase={phase}>
      <Link href="https://x.com/mehdibha" target="_blank">
        @mehdibha
      </Link>
    </DemoPress>
  )
}
