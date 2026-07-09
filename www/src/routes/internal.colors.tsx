import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const ColorPlayground = lazy(() =>
  import('@/modules/colors/playground').then((m) => ({
    default: m.ColorPlayground,
  })),
)

export const Route = createFileRoute('/internal/colors')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <ColorPlayground />
    </Suspense>
  )
}
