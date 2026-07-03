import { createFileRoute, notFound } from '@tanstack/react-router'

import { SectionNotes } from '@/components/explorer/section-notes'
import { StepRoleExplorer } from '@/components/explorer/step-role-explorer'
import { getSystem } from '@/data'

export const Route = createFileRoute('/systems/$slug/scale')({
  loader: ({ params }) => {
    const system = getSystem(params.slug)
    if (!system.colors.stepRoles) throw notFound()
    return { system }
  },
  component: ScaleSection,
})

function ScaleSection() {
  const { system } = Route.useLoaderData()
  const { colors } = system
  return (
    <div>
      <p className="text-sm text-fg-muted">
        The scale model: what each step means, on any scale. Click a step.
      </p>
      <div className="mt-5">
        <StepRoleExplorer
          stepRoles={colors.stepRoles!}
          ramps={colors.ramps}
          modes={colors.modes}
        />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'scale')}
      />
    </div>
  )
}
