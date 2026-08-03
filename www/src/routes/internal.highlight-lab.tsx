// TEMPORARY (PR #587): shiki vs @tanstack/highlight comparison lab — delete after merge decision.

import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const HighlightLabPage = lazy(() =>
  import('@/modules/dev/highlight-lab/page').then((m) => ({
    default: m.HighlightLabPage,
  })),
)

export const Route = createFileRoute('/internal/highlight-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Highlight Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <HighlightLabPage />
    </Suspense>
  )
}
