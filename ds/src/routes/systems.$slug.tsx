import { createFileRoute, notFound } from '@tanstack/react-router'

import { dataIndex } from '@/data'
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

const questionById = new Map(dataIndex.questionBank.map((q) => [q.id, q]))

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.sources.docs
  const repo = system?.sources.repo ?? rosterEntry?.sources.repo
  const facts = system?.facts ?? []

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-fg-muted">{org}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          {docs && <Link href={docs}>Docs</Link>}
          {repo && <Link href={repo}>Source</Link>}
          <Badge
            appearance="subtle"
            variant={system?.status === 'published' ? 'success' : 'neutral'}
          >
            {system?.status ?? 'planned'}
          </Badge>
        </div>
      </header>

      {facts.length === 0 ? (
        <p className="mt-12 max-w-2xl rounded-lg border p-6 text-fg-muted">
          Research planned. Facts will appear here — each one cited, dated, and
          labeled with how it was verified.
        </p>
      ) : (
        <section className="mt-12 flex flex-col gap-8">
          {facts.map((fact) => {
            const question = questionById.get(fact.questionId)
            return (
              <article key={fact.questionId} className="rounded-lg border p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-xs text-fg-muted">
                    {fact.questionId}
                  </code>
                  <Badge appearance="subtle">{fact.method}</Badge>
                  {fact.confidence === 'inferred' && (
                    <Badge appearance="subtle" variant="warning">
                      inferred
                    </Badge>
                  )}
                  {fact.status !== 'answered' && (
                    <Badge appearance="subtle" variant="warning">
                      {fact.status}
                    </Badge>
                  )}
                </div>
                {question && (
                  <h2 className="mt-3 font-medium">{question.prompt}</h2>
                )}
                <p className="mt-2 text-sm text-fg-muted">{fact.summary}</p>
                {fact.status !== 'answered' && (
                  <p className="mt-2 text-sm text-fg-muted italic">
                    {fact.reason}
                  </p>
                )}
                <ul className="mt-4 flex flex-col gap-1 text-sm">
                  {fact.evidence.map((evidence) => (
                    <li key={evidence.url} className="flex flex-wrap gap-2">
                      <Link href={evidence.url}>{evidence.url}</Link>
                      <span className="text-fg-muted">
                        ({evidence.kind}, retrieved {evidence.retrievedAt})
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-fg-muted">
                  Verified {fact.verifiedAt}
                </p>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
