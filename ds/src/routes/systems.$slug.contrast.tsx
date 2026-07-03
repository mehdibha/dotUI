import { createFileRoute, notFound } from '@tanstack/react-router'

import { ContrastLab } from '@/components/explorer/contrast-lab'
import { ContrastTable } from '@/components/explorer/contrast-table'
import { SectionNotes } from '@/components/explorer/section-notes'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/contrast')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (system.colors.contrast.length === 0) throw notFound()
    return { system }
  },
  component: ContrastSection,
})

function ContrastSection() {
  const { system } = Route.useLoaderData()
  const { colors } = system
  const guarantees = [
    ...new Map(
      colors.contrast
        .filter((pair) => pair.sweep)
        .map((pair) => [
          `${pair.sweep!.fgStep}-${pair.sweep!.bgStep}`,
          pair.sweep!,
        ]),
    ).values(),
  ]

  return (
    <div>
      <p className="text-sm text-fg-muted">
        Documented guarantees and observed measurements — never conflated.
      </p>
      <div className="mt-5">
        <ContrastTable pairs={colors.contrast} />
      </div>
      {colors.ramps.length > 0 && (
        <div className="mt-10">
          <ContrastLab
            ramps={colors.ramps}
            modes={colors.modes}
            guarantees={guarantees}
          />
        </div>
      )}
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'contrast')}
      />
    </div>
  )
}
