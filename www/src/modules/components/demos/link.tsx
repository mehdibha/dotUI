'use client'

import { useStyles as useLinkStyles } from '@/registry/ui/link/styles'

import { DemoState, useAutoplay } from '../autoplay'

// The card itself is an <a>, so a real <Link> (also an <a>) would nest anchors.
// We render the real link STYLES on a span instead — exact, preset-accurate look
// with valid markup — and drive its real focus-visible ring so it still animates.
export function LinkDemo() {
  const linkStyles = useLinkStyles()
  const { phase } = useAutoplay([
    { name: 'idle', duration: 1000 },
    { name: 'focus', duration: 900 },
  ])
  return (
    <DemoState flags={{ focusVisible: phase === 'focus' }}>
      <span data-rac="" className={linkStyles()}>
        @mehdibha
      </span>
    </DemoState>
  )
}
