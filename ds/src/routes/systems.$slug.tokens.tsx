import { createFileRoute, notFound } from '@tanstack/react-router'

import { SectionNotes } from '@/components/explorer/section-notes'
import { TokenTable } from '@/components/explorer/token-table'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/tokens')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (system.colors.tokenGroups.length === 0) throw notFound()
    return { system }
  },
  component: TokensSection,
})

function TokensSection() {
  const { system } = Route.useLoaderData()
  const { colors } = system
  return (
    <div>
      <p className="text-sm text-fg-muted">
        The semantic and component vocabulary, searchable across names,
        references and values.
      </p>
      <div className="mt-5">
        <TokenTable groups={colors.tokenGroups} modes={colors.modes} />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'tokens')}
      />
    </div>
  )
}
