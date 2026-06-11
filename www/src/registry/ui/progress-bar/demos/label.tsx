'use client'

import { Label } from '@/registry/ui/field'
import { ProgressBar, ProgressBarControl } from '@/registry/ui/progress-bar'

export default function Demo() {
  return (
    <div className="w-full space-y-4">
      <ProgressBar aria-label="Loading" value={75}>
        <ProgressBarControl />
      </ProgressBar>
      <ProgressBar value={75}>
        <Label>Loading...</Label>
        <ProgressBarControl />
      </ProgressBar>
    </div>
  )
}
