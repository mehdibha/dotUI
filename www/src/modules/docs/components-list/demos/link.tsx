'use client'

import { useStyles as useLinkStyles } from '@/registry/ui/link/styles'

// The card itself is an <a>, so a real <Link> (also an <a>) would nest anchors.
// We render the real link STYLES on a span instead — exact, preset-accurate look
// with valid markup.
export function LinkDemo() {
  const linkStyles = useLinkStyles()
  return (
    <span data-rac="" className={linkStyles()}>
      @mehdibha
    </span>
  )
}
