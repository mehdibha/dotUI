import { createFileRoute, notFound } from '@tanstack/react-router'

import { FocusAnatomy } from '@/components/explorer/focus-anatomy'
import { SectionNotes } from '@/components/explorer/section-notes'
import { SpecTable } from '@/components/explorer/spec-table'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/focus')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (system.colors.focus.length === 0 && !system.colors.focusRing) {
      throw notFound()
    }
    return { system }
  },
  component: FocusSection,
})

function FocusSection() {
  const { system } = Route.useLoaderData()
  const { colors } = system
  return (
    <div>
      <p className="text-sm text-fg-muted">
        How the focus highlight is built and where its color comes from.
      </p>
      {colors.focusRing && (
        <div className="mt-5">
          <FocusAnatomy
            focusRing={colors.focusRing}
            ramps={colors.ramps}
            modes={colors.modes}
          />
        </div>
      )}
      {colors.focus.length > 0 && (
        <div className="mt-8">
          <SpecTable entries={colors.focus} />
        </div>
      )}
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'focus')}
      />
    </div>
  )
}
