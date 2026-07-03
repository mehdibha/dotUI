import { useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { ModeSwitcher } from '@/components/explorer/mode-switcher'
import { RampGrid } from '@/components/explorer/ramp-grid'
import { SectionNotes } from '@/components/explorer/section-notes'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/palette')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (system.colors.ramps.length === 0) throw notFound()
    return { system }
  },
  component: PaletteSection,
})

function PaletteSection() {
  const { system } = Route.useLoaderData()
  const { colors } = system
  const [mode, setMode] = useState(colors.modes[0] ?? 'light')
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          Every shipped ramp, exactly as the system resolves it. Click a swatch
          for its dossier.
        </p>
        <ModeSwitcher modes={colors.modes} mode={mode} onChange={setMode} />
      </div>
      <div className="mt-6">
        <RampGrid ramps={colors.ramps} mode={mode} />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'palette')}
      />
    </div>
  )
}
