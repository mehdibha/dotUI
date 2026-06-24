'use client'

import { Label } from '@/registry/ui/field'
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from '@/registry/ui/progress-bar'

import { useValueAutoplay } from '../autoplay'

// The fill already ships `transition-all` + `origin-left`, so its `scaleX`
// transform glides on its own — we just step `value` through waypoints and the
// CSS transition (slowed/eased via the root className) animates the sweep. The
// Output reads `value` automatically, so the % label stays in sync.
export function ProgressBarDemo() {
  const { value } = useValueAutoplay([0, 35, 66, 92], { dwell: 900 })
  return (
    <ProgressBar
      value={value}
      valueLabel={`${value}%`}
      className="w-44 [&_[data-rac]]:transition-transform [&_[data-rac]]:duration-700 [&_[data-rac]]:ease-out"
    >
      <Label>Uploading…</Label>
      <ProgressBarOutput />
      <ProgressBarControl />
    </ProgressBar>
  )
}
