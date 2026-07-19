import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const ColorLab = lazy(() =>
  import('@/modules/color-lab/page').then((m) => ({ default: m.ColorLab })),
)

export const Route = createFileRoute('/internal/color-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Color Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <ColorLab />
    </Suspense>
  )
}
