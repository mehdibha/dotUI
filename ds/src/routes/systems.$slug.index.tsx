import { createFileRoute } from '@tanstack/react-router'

import { OverviewCards } from '@/components/explorer/overview-cards'
import { SectionNotes } from '@/components/explorer/section-notes'
import { SourceLinks } from '@/components/explorer/source-links'
import { dataIndex } from '@/data'

export const Route = createFileRoute('/systems/$slug/')({
  // No notFound here: planned systems render the parent's placeholder.
  loader: ({ params }) => ({
    system: dataIndex.systems.find((s) => s.slug === params.slug),
  }),
  component: OverviewSection,
})

function OverviewSection() {
  const { system } = Route.useLoaderData()
  if (!system) return null
  const { colors } = system
  return (
    <div>
      <OverviewCards entries={colors.overview} />
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'overview')}
      />
      <footer className="mt-8 border-t pt-5">
        <p className="text-xs text-fg-muted">
          Primary sources for this system:
        </p>
        <SourceLinks sources={colors.sources} className="mt-2" />
      </footer>
    </div>
  )
}
