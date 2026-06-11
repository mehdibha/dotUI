'use client'

import { Label } from '@/registry/ui/field'
import { ProgressBar, ProgressBarControl } from '@/registry/ui/progress-bar'

export default function Demo({
  label = 'Loading...',
  value = 60,
  isIndeterminate = false,
} = {}) {
  return (
    <ProgressBar value={value} isIndeterminate={isIndeterminate}>
      {label && <Label>{label}</Label>}
      <ProgressBarControl />
    </ProgressBar>
  )
}
