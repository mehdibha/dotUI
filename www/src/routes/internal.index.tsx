import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const InternalIndex = lazy(() =>
  import('@/modules/internal/page').then((m) => ({ default: m.InternalIndex })),
)

export const Route = createFileRoute('/internal/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Internal · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <InternalIndex />
    </Suspense>
  )
}
