import { lazy, Suspense } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { findVersion } from '@/modules/panel-lab/versions'

const PanelVersionPage = lazy(() =>
  import('@/modules/panel-lab/version-page').then((m) => ({
    default: m.PanelVersionPage,
  })),
)

export const Route = createFileRoute('/internal/panel-lab/$version')({
  loader: ({ params }) => {
    const version = findVersion(params.version)
    if (!version) throw notFound()
    // Chapters carry components — keep them out of the loader payload and
    // re-resolve from the id in the component.
    return { id: version.id, label: version.label }
  },
  component: RouteComponent,
  head: ({ loaderData }) => ({
    meta: [{ title: `Panel ${loaderData?.label ?? ''} · dotUI` }],
  }),
})

function RouteComponent() {
  const { version: id } = Route.useParams()
  const version = findVersion(id)
  if (!version) return null
  return (
    <Suspense fallback={null}>
      <PanelVersionPage version={version} />
    </Suspense>
  )
}
