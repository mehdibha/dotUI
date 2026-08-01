import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const RegistriesPage = lazy(() =>
  import('@/modules/registries/page').then((m) => ({
    default: m.RegistriesPage,
  })),
)

export const Route = createFileRoute('/internal/registries')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Registry directory · dotUI' }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <RegistriesPage />
    </Suspense>
  )
}
