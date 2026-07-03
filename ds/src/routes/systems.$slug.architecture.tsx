import { createFileRoute, notFound } from '@tanstack/react-router'

import { LayerDiagram } from '@/components/explorer/layer-diagram'
import { SectionNotes } from '@/components/explorer/section-notes'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/architecture')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (system.colors.layers.length === 0) throw notFound()
    return { system }
  },
  component: ArchitectureSection,
})

function ArchitectureSection() {
  const { system } = Route.useLoaderData()
  return (
    <div>
      <p className="text-sm text-fg-muted">
        How raw values become component styles.
      </p>
      <div className="mt-5">
        <LayerDiagram layers={system.colors.layers} />
      </div>
      <SectionNotes
        notes={system.colors.notes.filter(
          (note) => note.section === 'architecture',
        )}
      />
    </div>
  )
}
