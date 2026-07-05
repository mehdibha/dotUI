import { lazy, Suspense } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

// Dead in production: the playground module is only imported in DEV; otherwise 404.
const ColorPlayground = import.meta.env.DEV
  ? lazy(() =>
      import('@/dev/color-playground/playground').then((m) => ({
        default: m.ColorPlayground,
      })),
    )
  : null

export const Route = createFileRoute('/dev/color-playground')({
  component: RouteComponent,
})

function RouteComponent() {
  if (!ColorPlayground) throw notFound()
  return (
    <Suspense fallback={null}>
      <ColorPlayground />
    </Suspense>
  )
}
