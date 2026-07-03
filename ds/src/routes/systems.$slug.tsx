import {
  createFileRoute,
  Link as RouterLink,
  notFound,
  Outlet,
} from '@tanstack/react-router'

import { SpecimenMural } from '@/components/plate'
import { dataIndex } from '@/data'
import type { SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Link } from '@/ui/link'

export const Route = createFileRoute('/systems/$slug')({
  loader: ({ params }) => {
    const rosterEntry = dataIndex.roster.find(
      (entry) => entry.slug === params.slug,
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    if (!rosterEntry && !system) throw notFound()
    return { rosterEntry, system }
  },
  component: SystemPage,
})

function sectionsFor(system: SystemWithColors) {
  const { colors } = system
  const hasNotes = (id: string) =>
    colors.notes.some((note) => note.section === id)
  return [
    { path: '/systems/$slug', label: 'Overview', exact: true },
    (colors.layers.length > 0 || hasNotes('architecture')) && {
      path: '/systems/$slug/architecture',
      label: 'Architecture',
    },
    (colors.ramps.length > 0 || hasNotes('palette')) && {
      path: '/systems/$slug/palette',
      label: 'Palette',
    },
    colors.stepRoles && { path: '/systems/$slug/scale', label: 'Scale' },
    (colors.tokenGroups.length > 0 || hasNotes('tokens')) && {
      path: '/systems/$slug/tokens',
      label: 'Tokens',
    },
    (colors.focus.length > 0 || hasNotes('focus')) && {
      path: '/systems/$slug/focus',
      label: 'Focus',
    },
    (colors.contrast.length > 0 || hasNotes('contrast')) && {
      path: '/systems/$slug/contrast',
      label: 'Contrast',
    },
  ].filter(
    (section): section is { path: string; label: string; exact?: boolean } =>
      Boolean(section),
  )
}

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.homepage
  const repo = system?.sources.repo ?? rosterEntry?.repo
  const site = system?.sources.site

  return (
    <div>
      {system && (
        <SpecimenMural
          system={system}
          rows={4}
          className="flex h-24 flex-col border-b sm:h-32"
        />
      )}
      <header className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          {system && (
            <p className="font-mono text-[11px] text-fg-muted">
              added {system.createdAt} · updated {system.updatedAt} · reviewed{' '}
              {system.reviewedAt}
            </p>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-fg-muted">{org}</span>
          {docs && <Link href={docs}>Docs</Link>}
          {repo && <Link href={repo}>Source</Link>}
          {site && site !== docs && <Link href={site}>Site</Link>}
          <Badge
            appearance="subtle"
            variant={system?.status === 'published' ? 'success' : 'neutral'}
          >
            {system?.status ?? 'planned'}
          </Badge>
          {rosterEntry?.status === 'shipped-css' && (
            <Badge appearance="subtle" variant="info">
              reverse-engineered
            </Badge>
          )}
        </div>
      </header>

      {system ? (
        <>
          <nav
            aria-label="Sections"
            className="sticky top-0 z-20 mt-8 border-b bg-bg/90 backdrop-blur"
          >
            <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-6">
              {sectionsFor(system).map((section) => (
                <RouterLink
                  key={section.path}
                  to={section.path}
                  params={{ slug: system.slug }}
                  activeOptions={{ exact: section.exact ?? false }}
                  className="-mb-px border-b-2 border-transparent px-3 py-2.5 text-sm whitespace-nowrap text-fg-muted transition-colors hover:text-fg"
                  activeProps={{
                    className: 'border-fg font-medium text-fg',
                  }}
                >
                  {section.label}
                </RouterLink>
              ))}
            </div>
          </nav>
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <Outlet />
          </div>
        </>
      ) : (
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="mt-10 max-w-2xl rounded-lg border p-6 text-fg-muted">
            Research planned. This system&apos;s full color architecture —
            palette, semantic tokens, focus and contrast behavior — will be
            explorable here.
          </p>
        </div>
      )}
    </div>
  )
}
