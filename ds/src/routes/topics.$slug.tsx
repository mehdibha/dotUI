import { createFileRoute, notFound } from '@tanstack/react-router'

import { dataIndex } from '@/data'
import { Badge } from '@/ui/badge'
import { Link } from '@/ui/link'

export const Route = createFileRoute('/topics/$slug')({
  loader: ({ params }) => {
    const question = dataIndex.questionBank.find(
      (q) => q.id.replace('.', '-') === params.slug,
    )
    if (!question) throw notFound()
    return { question }
  },
  component: TopicPage,
})

function TopicPage() {
  const { question } = Route.useLoaderData()
  const answers = dataIndex.systems
    .map((system) => ({
      system,
      fact: system.facts.find((fact) => fact.questionId === question.id),
    }))
    .filter((entry) => entry.fact !== undefined)

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-fg-muted">{question.id}</code>
          <Badge appearance="subtle">{question.dimension}</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {question.prompt}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">{question.rationale}</p>
      </header>

      {answers.length === 0 ? (
        <p className="mt-12 max-w-2xl rounded-lg border p-6 text-fg-muted">
          No published answers yet. As systems are researched, every answer to
          this question lands here — cited and dated — and feeds the generated
          comparison matrix.
        </p>
      ) : (
        <section className="mt-12 flex flex-col gap-6">
          {answers.map(({ system, fact }) => (
            <article key={system.slug} className="rounded-lg border p-6">
              <h2 className="font-medium">{system.name}</h2>
              <p className="mt-2 text-sm text-fg-muted">{fact?.summary}</p>
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {fact?.evidence.map((evidence) => (
                  <li key={evidence.url}>
                    <Link href={evidence.url}>{evidence.url}</Link>{' '}
                    <span className="text-fg-muted">
                      ({evidence.kind}, retrieved {evidence.retrievedAt})
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-fg-muted">
                Verified {fact?.verifiedAt} · {fact?.method}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
