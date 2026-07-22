import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

// Dev-only by default: the import (and the bundled reference screenshots) is
// dead-code-eliminated from production builds — brand captures must never reach
// dotui.org. VITE_PRESET_LAB=1 opts a preview deployment in.
const PresetLab =
  import.meta.env.DEV || import.meta.env.VITE_PRESET_LAB === '1'
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
