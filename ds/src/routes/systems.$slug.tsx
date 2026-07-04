import { createFileRoute, notFound } from '@tanstack/react-router'

import { Spectrum2Explorer } from '@/components/system'
import { dataIndex } from '@/data'
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

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.homepage
  const repo = system?.sources.repo ?? rosterEntry?.repo
  const site = system?.sources.site

  return (
    <div>
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
        </div>
      </header>

      {system ? (
        <Spectrum2Explorer system={system} rosterEntry={rosterEntry} />
      ) : (
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="mt-10 max-w-2xl rounded-lg border p-6 text-fg-muted">
            Research planned. This system&apos;s full architecture — tokens,
            color, typography, motion, and components — will be explorable here,
            rebuilt from scratch.
          </p>
        </div>
      )}
    </div>
  )
}
