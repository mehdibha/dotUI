import { createFileRoute, Link } from '@tanstack/react-router'

import { dataIndex } from '@/data'
import { Badge } from '@/ui/badge'

export const Route = createFileRoute('/')({
  component: Home,
})

const published = new Set(
  dataIndex.systems
    .filter((system) => system.status === 'published')
    .map((system) => system.slug),
)

const roster = dataIndex.roster.filter((entry) => entry.status === 'tier1')

function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          How the best design systems actually work.
        </h1>
        <p className="mt-4 text-fg-muted">
          Rigorous, citation-backed research across a curated roster of
          genuinely excellent design systems — starting with the deepest
          possible treatment of color and token systems. Every fact carries its
          source, its method, and the date it was verified.
        </p>
        <p className="mt-2 text-sm text-fg-muted">
          {roster.length} systems planned · {published.size} published — growing
          in the open.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">The roster</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((entry) => (
            <li key={entry.slug}>
              <Link
                to="/systems/$slug"
                params={{ slug: entry.slug }}
                className="flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{entry.name}</span>
                <span className="text-sm text-fg-muted">{entry.org}</span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  <Badge
                    appearance="subtle"
                    variant={published.has(entry.slug) ? 'success' : 'neutral'}
                  >
                    {published.has(entry.slug) ? 'published' : 'planned'}
                  </Badge>
                  {entry.method === 'reverse-engineered' && (
                    <Badge appearance="subtle" variant="info">
                      reverse-engineered
                    </Badge>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">The questions we ask</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Every system is researched through the same canonical question bank —
          topic pages compare one question across systems, profiles answer every
          question for one system.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {dataIndex.questionBank.map((question) => (
            <li key={question.id}>
              <Link
                to="/topics/$slug"
                params={{ slug: question.id.replace('.', '-') }}
                className="group flex items-baseline gap-3 rounded-md border px-4 py-3 transition-colors hover:bg-muted"
              >
                <code className="shrink-0 font-mono text-xs text-fg-muted">
                  {question.id}
                </code>
                <span className="text-sm group-hover:text-fg">
                  {question.prompt}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
