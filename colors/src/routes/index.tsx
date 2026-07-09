import { createFileRoute, Link } from '@tanstack/react-router'

import {
  allChapters,
  curriculum,
  publishedChapters,
  type Chapter,
} from '@/config/curriculum'
import { Badge } from '@/ui/badge'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Learn color for design systems.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          The concepts you actually need to build a state-of-the-art color
          system in 2026 — perception, OKLCH, gamut, contrast, ramps, tokens.
          Every chapter has an interactive playground.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {allChapters.length} chapters · {publishedChapters.length} published
        </p>
      </section>

      <div className="space-y-14 pb-24">
        {curriculum.map((part) => (
          <section key={part.number}>
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Part {part.number} — {part.title}
              </h2>
              <span className="text-sm text-fg-muted">{part.tagline}</span>
            </div>
            <ul className="mt-4 border-t">
              {part.chapters.map((chapter) => (
                <ChapterRow key={chapter.slug} chapter={chapter} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

function ChapterRow({ chapter }: { chapter: Chapter }) {
  const published = chapter.status === 'published'

  return (
    <li className={published ? 'border-b' : 'border-b border-disabled'}>
      {published ? (
        <Link
          to="/$slug"
          params={{ slug: chapter.slug }}
          className="flex h-16 items-baseline gap-4"
        >
          <span className="w-6 shrink-0 font-mono text-xs text-fg-muted">
            {chapter.number}
          </span>
          <span className="font-medium">{chapter.title}</span>
        </Link>
      ) : (
        <div className="flex h-16 items-baseline gap-4">
          <span className="w-6 shrink-0 font-mono text-xs text-fg-disabled">
            {chapter.number}
          </span>
          <span className="font-medium text-fg-disabled">{chapter.title}</span>
          <Badge size="sm" className="bg-disabled text-fg-disabled">
            planned
          </Badge>
        </div>
      )}
    </li>
  )
}
