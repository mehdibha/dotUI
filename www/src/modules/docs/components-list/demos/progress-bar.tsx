import { Label } from '@/registry/ui/field'
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from '@/registry/ui/progress-bar'

export function ProgressBarDemo() {
  return (
    <ProgressBar value={66} className="w-full max-w-[11.5rem]">
      <div className="flex items-center justify-between gap-2">
        <Label>Uploading…</Label>
        <ProgressBarOutput />
      </div>
      <ProgressBarControl />
    </ProgressBar>
  )
}
