import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

// DEV-only: the import (and the bundled reference screenshots) is
// dead-code-eliminated from production builds — brand captures must never ship.
const PresetLab = import.meta.env.DEV
  ? lazy(() =>
      import('@/modules/preset-lab/page').then((m) => ({
        default: m.PresetLab,
      })),
    )
  : null

export const Route = createFileRoute('/internal/preset-lab')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Preset Lab · dotUI' }] }),
})

function RouteComponent() {
  if (!PresetLab) return null
  return (
    <Suspense fallback={null}>
      <PresetLab />
    </Suspense>
  )
}
