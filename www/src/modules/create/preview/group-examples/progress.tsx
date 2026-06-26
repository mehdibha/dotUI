import { Loader } from '@/registry/ui/loader'
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from '@/registry/ui/progress-bar'
import { Skeleton } from '@/registry/ui/skeleton'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ProgressGroupExamples() {
  return (
    <Examples>
      <Example title="Progress Bar">
        <ProgressBar
          aria-label="Progress"
          value={60}
          className="w-full max-w-sm"
        >
          <ProgressBarOutput />
          <ProgressBarControl />
        </ProgressBar>
      </Example>
      <Example title="Loader">
        <Loader />
      </Example>
      <Example title="Skeleton">
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Example>
    </Examples>
  )
}
