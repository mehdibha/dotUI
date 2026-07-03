import { useState } from 'react'
import {
  createFileRoute,
  Link as RouterLink,
  notFound,
} from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { ContrastTable } from '@/components/explorer/contrast-table'
import { LayerDiagram } from '@/components/explorer/layer-diagram'
import { ModeSwitcher } from '@/components/explorer/mode-switcher'
import { OverviewCards } from '@/components/explorer/overview-cards'
import { RampGrid } from '@/components/explorer/ramp-grid'
import { SectionNotes } from '@/components/explorer/section-notes'
import { SourceLinks } from '@/components/explorer/source-links'
import { SpecTable } from '@/components/explorer/spec-table'
import { TokenTable } from '@/components/explorer/token-table'
import { dataIndex } from '@/data'
import type { SectionId, SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Link } from '@/ui/link'

const sectionIds = [
  'overview',
  'architecture',
  'palette',
  'tokens',
  'focus',
  'contrast',
] as const

const sectionLabels: Record<SectionId, string> = {
  overview: 'Overview',
  architecture: 'Architecture',
  palette: 'Palette',
  tokens: 'Tokens',
  focus: 'Focus',
  contrast: 'Contrast',
}

export const Route = createFileRoute('/systems/$slug')({
  validateSearch: (search): { section?: SectionId } => {
    const section = search.section
    return sectionIds.includes(section as SectionId)
      ? { section: section as SectionId }
      : {}
  },
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

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.homepage
  const repo = system?.sources.repo ?? rosterEntry?.repo
  const site = system?.sources.site

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-fg-muted">{org}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
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
        {system && (
          <p className="text-xs text-fg-muted">
            Created {system.createdAt} · Updated {system.updatedAt} · Reviewed{' '}
            {system.reviewedAt}
          </p>
        )}
      </header>

      {system ? (
        <SystemExplorer system={system} />
      ) : (
        <p className="mt-12 max-w-2xl rounded-lg border p-6 text-fg-muted">
          Research planned. This system&apos;s full color architecture —
          palette, semantic tokens, focus and contrast behavior — will be
          explorable here.
        </p>
      )}
    </div>
  )
}

function SystemExplorer({ system }: { system: SystemWithColors }) {
  const { colors } = system
  const { section } = Route.useSearch()
  const [mode, setMode] = useState(colors.modes[0] ?? 'light')

  const hasNotes = (id: SectionId) =>
    colors.notes.some((note) => note.section === id)
  const visible = sectionIds.filter((id) => {
    if (id === 'architecture') return colors.layers.length > 0 || hasNotes(id)
    if (id === 'palette') return colors.ramps.length > 0 || hasNotes(id)
    if (id === 'focus') return colors.focus.length > 0 || hasNotes(id)
    if (id === 'contrast') return colors.contrast.length > 0 || hasNotes(id)
    return true
  })
  const active = section && visible.includes(section) ? section : 'overview'
  const notes = colors.notes.filter((note) => note.section === active)

  return (
    <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-12">
      <nav
        aria-label="Sections"
        className="flex shrink-0 gap-1 overflow-x-auto lg:sticky lg:top-10 lg:h-fit lg:w-36 lg:flex-col"
      >
        {visible.map((id) => (
          <RouterLink
            key={id}
            from={Route.fullPath}
            search={id === 'overview' ? {} : { section: id }}
            replace
            className={cn(
              'rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors lg:border-l-2 lg:pl-3',
              id === active
                ? 'bg-muted font-medium lg:border-fg lg:bg-transparent'
                : 'text-fg-muted hover:text-fg lg:border-transparent',
            )}
          >
            {sectionLabels[id]}
          </RouterLink>
        ))}
      </nav>

      <div className="min-w-0 flex-1">
        {active === 'overview' && (
          <>
            <OverviewCards entries={colors.overview} />
            <footer className="mt-8 border-t pt-5">
              <p className="text-xs text-fg-muted">
                Primary sources for this system:
              </p>
              <SourceLinks sources={colors.sources} className="mt-2" />
            </footer>
          </>
        )}

        {active === 'architecture' && (
          <>
            <p className="text-sm text-fg-muted">
              How raw values become component styles.
            </p>
            <div className="mt-5">
              <LayerDiagram layers={colors.layers} />
            </div>
          </>
        )}

        {active === 'palette' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">
                Every shipped ramp, exactly as the system resolves it. Click a
                swatch to copy its value.
              </p>
              <ModeSwitcher
                modes={colors.modes}
                mode={mode}
                onChange={setMode}
              />
            </div>
            <div className="mt-6">
              <RampGrid ramps={colors.ramps} mode={mode} />
            </div>
          </>
        )}

        {active === 'tokens' && (
          <>
            <p className="text-sm text-fg-muted">
              The semantic and component vocabulary, searchable across names,
              references and values.
            </p>
            <div className="mt-5">
              <TokenTable groups={colors.tokenGroups} modes={colors.modes} />
            </div>
          </>
        )}

        {active === 'focus' && (
          <>
            <p className="text-sm text-fg-muted">
              How the focus highlight is built and where its color comes from.
            </p>
            <div className="mt-5">
              <SpecTable entries={colors.focus} />
            </div>
          </>
        )}

        {active === 'contrast' && (
          <>
            <p className="text-sm text-fg-muted">
              Documented guarantees and observed measurements — never conflated.
            </p>
            <div className="mt-5">
              <ContrastTable pairs={colors.contrast} />
            </div>
          </>
        )}

        <SectionNotes notes={notes} />
      </div>
    </div>
  )
}
