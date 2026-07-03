import { useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { ContrastTable } from '@/components/explorer/contrast-table'
import { LayerDiagram } from '@/components/explorer/layer-diagram'
import { ModeSwitcher } from '@/components/explorer/mode-switcher'
import { RampGrid } from '@/components/explorer/ramp-grid'
import { SourceLinks } from '@/components/explorer/source-links'
import { SpecTable } from '@/components/explorer/spec-table'
import { TokenTable } from '@/components/explorer/token-table'
import { dataIndex } from '@/data'
import type { SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Link } from '@/ui/link'

export const Route = createFileRoute('/systems/$slug')({
  loader: ({ params }) => {
    const rosterEntry = dataIndex.roster.find(
      (entry) => entry.slug === params.slug && entry.status === 'tier1',
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    if (!rosterEntry && !system) throw notFound()
    return { rosterEntry, system }
  },
  component: SystemPage,
})

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'palette', label: 'Palette' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'focus', label: 'Focus' },
  { id: 'contrast', label: 'Contrast' },
] as const

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.sources.docs
  const repo = system?.sources.repo ?? rosterEntry?.sources.repo
  const site = system?.sources.site

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
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
          {rosterEntry?.method === 'reverse-engineered' && (
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
  const [mode, setMode] = useState(colors.modes[0] ?? 'light')
  const visibleSections = sections.filter((section) => {
    if (section.id === 'palette') return colors.ramps.length > 0
    if (section.id === 'architecture') return colors.layers.length > 0
    if (section.id === 'focus') return colors.focus.length > 0
    if (section.id === 'contrast') return colors.contrast.length > 0
    return true
  })

  return (
    <>
      <nav className="mt-8 flex flex-wrap gap-1.5 border-y py-3 text-sm">
        {visibleSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-md px-2.5 py-1 text-fg-muted transition-colors hover:bg-muted hover:text-fg"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <section id="overview" className="mt-10 scroll-mt-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="mt-4">
          <SpecTable entries={colors.overview} />
        </div>
      </section>

      {colors.layers.length > 0 && (
        <section id="architecture" className="mt-12 scroll-mt-6">
          <h2 className="text-xl font-semibold">Architecture</h2>
          <p className="mt-1 text-sm text-fg-muted">
            How raw values become component styles.
          </p>
          <div className="mt-4">
            <LayerDiagram layers={colors.layers} />
          </div>
        </section>
      )}

      {colors.ramps.length > 0 && (
        <section id="palette" className="mt-12 scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Palette</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Every shipped ramp, exactly as the system resolves it. Click a
                swatch to copy its value.
              </p>
            </div>
            <ModeSwitcher modes={colors.modes} mode={mode} onChange={setMode} />
          </div>
          <div className="mt-6">
            <RampGrid ramps={colors.ramps} mode={mode} />
          </div>
        </section>
      )}

      <section id="tokens" className="mt-12 scroll-mt-6">
        <h2 className="text-xl font-semibold">Tokens</h2>
        <p className="mt-1 text-sm text-fg-muted">
          The semantic and component vocabulary, searchable across names,
          references and values.
        </p>
        <div className="mt-4">
          <TokenTable groups={colors.tokenGroups} modes={colors.modes} />
        </div>
      </section>

      {colors.focus.length > 0 && (
        <section id="focus" className="mt-12 scroll-mt-6">
          <h2 className="text-xl font-semibold">Focus</h2>
          <p className="mt-1 text-sm text-fg-muted">
            How the focus highlight is built and where its color comes from.
          </p>
          <div className="mt-4">
            <SpecTable entries={colors.focus} />
          </div>
        </section>
      )}

      {colors.contrast.length > 0 && (
        <section id="contrast" className="mt-12 scroll-mt-6">
          <h2 className="text-xl font-semibold">Contrast</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Documented guarantees and observed measurements — never conflated.
          </p>
          <div className="mt-4">
            <ContrastTable pairs={colors.contrast} />
          </div>
        </section>
      )}

      <footer className="mt-12 border-t pt-6">
        <p className="text-xs text-fg-muted">Primary sources for this page:</p>
        <SourceLinks sources={colors.sources} className="mt-2" />
      </footer>
    </>
  )
}
