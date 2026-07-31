import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const ControlLab = lazy(() =>
  import('@/modules/control-lab/page').then((m) => ({
    default: m.ControlLab,
  })),
)

export const Route = createFileRoute('/internal/control-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Control Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <ControlLab />
    </Suspense>
  )
}
