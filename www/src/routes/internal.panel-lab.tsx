import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const PanelLab = lazy(() =>
  import('@/modules/panel-lab/page').then((m) => ({ default: m.PanelLab })),
)

export const Route = createFileRoute('/internal/panel-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Panel Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <PanelLab />
    </Suspense>
  )
}
