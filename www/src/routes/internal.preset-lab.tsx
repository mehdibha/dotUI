import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const PresetLab = lazy(() =>
  import('@/modules/preset-lab/page').then((m) => ({ default: m.PresetLab })),
)

export const Route = createFileRoute('/internal/preset-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Preset Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <PresetLab />
    </Suspense>
  )
}
