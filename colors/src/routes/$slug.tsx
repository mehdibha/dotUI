import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import {
  getChapter,
  getPartForChapter,
  getPublishedNeighbours,
} from '@/config/curriculum'
import { siteConfig } from '@/config/site'
import { nodeText } from '@/lib/node-text'
import { chaptersSource } from '@/lib/source'
import {
  ChapterDesktopToc,
  type SerializedTocItem,
  toTocItems,
} from '@/components/chapter-toc'
import { mdxComponents } from '@/components/mdx-components'
import browserCollections from '@/.source/browser'

export const Route = createFileRoute('/$slug')({
  component: ChapterPage,
  staleTime: Infinity,
  loader: async ({ params }) => {
    const data = await serverLoader({ data: params.slug })
    await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? 'Chapter'
    const description = loaderData?.description
    const url = loaderData?.url
      ? `${siteConfig.url}${loaderData.url}`
      : siteConfig.url

    return {
      meta: [
        { title: `${title} — ${siteConfig.name}` },
        ...(description ? [{ name: 'description', content: description }] : []),
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: title },
        ...(description
          ? [{ property: 'og:description', content: description }]
          : []),
        { property: 'og:site_name', content: siteConfig.name },
      ],
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const chapter = getChapter(slug)
    // Unknown and planned-but-not-published slugs are both 404s.
    if (!chapter || chapter.status !== 'published') throw notFound()

    const page = chaptersSource.getPage([slug])
    if (!page) throw notFound()

    setResponseHeader(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=31536000',
    )

    const part = getPartForChapter(slug)
    const { toc } = await page.data.load()
    const neighbours = getPublishedNeighbours(slug)

    return {
      path: page.path,
      url: page.url,
      title: chapter.title,
      description: page.data.description,
      chapter: { number: chapter.number },
      part: part ? { number: part.number, title: part.title } : undefined,
      toc: toc.map(
        (item): SerializedTocItem => ({
          url: item.url,
          title: nodeText(item.title),
          depth: item.depth,
        }),
      ),
      neighbours: {
        previous: neighbours.previous
          ? { slug: neighbours.previous.slug, title: neighbours.previous.title }
          : undefined,
        next: neighbours.next
          ? { slug: neighbours.next.slug, title: neighbours.next.title }
          : undefined,
      },
    }
  })

type LoaderData = Awaited<ReturnType<typeof serverLoader>>
type ContentProps = {
  description?: string
  chapter: LoaderData['chapter']
  part: LoaderData['part']
  toc: SerializedTocItem[]
  neighbours: LoaderData['neighbours']
}

const clientLoader = browserCollections.docs.createClientLoader({
  component({ frontmatter, default: MDX }, props: ContentProps) {
    const { chapter, part, toc, neighbours } = props
    const tocItems = toTocItems(toc)

    return (
      <div className="relative mx-auto w-full max-w-4xl">
        {tocItems.length > 0 && (
          <div className="absolute top-13 right-full bottom-0 hidden lg:block">
            <ChapterDesktopToc
              items={tocItems}
              className="sticky top-24 mr-4"
            />
          </div>
        )}

        <div className="px-6 pt-10 pb-24">
          <header>
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeftIcon className="size-3.5" />
              Chapters
            </Link>
            <p className="font-mono text-xs text-fg-muted">
              {part
                ? `Part ${part.number} — ${part.title} · Chapter ${chapter.number}`
                : `Chapter ${chapter.number}`}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>
            {props.description && (
              <p className="mt-4 text-base text-balance text-fg-muted">
                {props.description}
              </p>
            )}
          </header>

          <div className="mt-10">
            <MDX components={mdxComponents} />
          </div>

          <Pager neighbours={neighbours} />
        </div>
      </div>
    )
  },
})

function Pager({ neighbours }: { neighbours: LoaderData['neighbours'] }) {
  const { previous, next } = neighbours
  if (!previous && !next) return null

  return (
    <nav className="mt-16 flex items-center justify-between gap-4 border-t pt-6 text-sm">
      {previous ? (
        <Link
          to="/$slug"
          params={{ slug: previous.slug }}
          className="flex items-center gap-2 text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeftIcon className="size-4 shrink-0" />
          <span className="truncate">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to="/$slug"
          params={{ slug: next.slug }}
          className="flex items-center gap-2 text-right text-fg-muted transition-colors hover:text-fg"
        >
          <span className="truncate">{next.title}</span>
          <ArrowRightIcon className="size-4 shrink-0" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

function ChapterPage() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)

  return (
    <Content
      description={data.description}
      chapter={data.chapter}
      part={data.part}
      toc={data.toc}
      neighbours={data.neighbours}
    />
  )
}
