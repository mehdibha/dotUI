import { createFileRoute, notFound } from '@tanstack/react-router'

import { SystemExplorer } from '@/components/system'
import { SystemDesktopToc } from '@/components/system/toc'
import { dataIndex } from '@/data'
import { Link } from '@/ui/link'

export const Route = createFileRoute('/systems/$slug')({
  loader: ({ params }) => {
    const catalogEntry = dataIndex.catalog.find(
      (entry) => entry.slug === params.slug,
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    if (!catalogEntry && !system) throw notFound()
    return { catalogEntry, system }
  },
  component: SystemPage,
})

function SystemPage() {
  const { catalogEntry, system } = Route.useLoaderData()
  const name = system?.name ?? catalogEntry?.name ?? ''
  const org = system?.org ?? catalogEntry?.org ?? ''
  const docs = system?.sources.docs ?? catalogEntry?.homepage
  const repo = system?.sources.repo ?? catalogEntry?.repo
  const site = system?.sources.site

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* In-page TOC floating in the left gutter, aligned with the title's
          vertical center — full list on wide gutters, collapsing to lines, then
          to the header dropdown below lg. Never affects the centered content. */}
      {system && (
        <div className="absolute top-13 right-full bottom-0 hidden lg:block">
          <SystemDesktopToc slug={system.slug} className="sticky top-24 mr-4" />
        </div>
      )}
      <header className="px-6 pt-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          <span className="text-sm text-fg-muted">by {org}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          {docs && <Link href={docs}>Docs</Link>}
          {repo && <Link href={repo}>Source</Link>}
          {site && site !== docs && <Link href={site}>Site</Link>}
        </div>
      </header>

      {system ? (
        <SystemExplorer system={system} catalogEntry={catalogEntry} />
      ) : (
        <div className="px-6 pb-16">
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
