import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const PanelLabGallery = lazy(() =>
  import('@/modules/panel-lab/gallery').then((m) => ({
    default: m.PanelLabGallery,
  })),
)

export const Route = createFileRoute('/internal/panel-lab/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Panel Lab · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <PanelLabGallery />
    </Suspense>
  )
}
