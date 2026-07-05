import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { findNeighbour } from 'fumadocs-core/page-tree'

import { siteConfig } from '@/config/site'
import { nodeText } from '@/lib/node-text'
import { docsSource } from '@/lib/source'
import { truncateOnWord } from '@/lib/text'
import { DocsCopyPage } from '@/modules/docs/docs-copy-page'
import { DocsPager } from '@/modules/docs/docs-pager'
import { PageLastUpdate } from '@/modules/docs/last-update'
import { mdxComponents } from '@/modules/docs/mdx-components'
import {
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from '@/modules/docs/page-layout'
import { MiniTOC, TOC, TOCProvider } from '@/modules/docs/toc'
import browserCollections from '@/.source/browser'

export const Route = createFileRoute('/_app/docs/$')({
  component: DocsPage,
  // Docs content only changes with a build/deploy (Vercel purges the CDN cache
  // on deploy), so never background-revalidate it on re-match.
  staleTime: Infinity,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? 'Docs'
    const description = loaderData?.description
    const truncatedDescription = description
      ? truncateOnWord(description, 148, true)
      : undefined
    const url = loaderData?.url ?? '/docs'
    const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(title)}${truncatedDescription ? `&description=${encodeURIComponent(truncatedDescription)}` : ''}`

    return {
      meta: [
        { title: `${title} - ${siteConfig.name}` },
        ...(description ? [{ name: 'description', content: description }] : []),
        { property: 'og:title', content: title },
        ...(truncatedDescription
          ? [{ property: 'og:description', content: truncatedDescription }]
          : []),
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${siteConfig.url}${url}` },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        ...(truncatedDescription
          ? [{ name: 'twitter:description', content: truncatedDescription }]
          : []),
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
      links: [
        // Markdown alternate for AI agents — served by the /docs/{$}.md route.
        // The docs index (url "/docs") is exposed as /docs/index.md by that route.
        {
          rel: 'alternate',
          type: 'text/markdown',
          href: `${siteConfig.url}${url === '/docs' ? '/docs/index' : url}.md`,
        },
      ],
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    // Try to get the page, fallback to index for empty slugs
    let page = docsSource.getPage(slugs)
    if (!page && slugs.length === 0) {
      page = docsSource.getPage(['index'])
    }
    if (!page) throw notFound()

    // Success path only (don't cache not-found responses): content is baked
    // into the build, so let Vercel's CDN cache it until the next deploy purge.
    setResponseHeader(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=31536000',
    )

    const pageTree = docsSource.getPageTree()
    const { previous, next } = findNeighbour(pageTree, page.url)
    const rawContent = await page.data.getText('processed')
    // Serializable copy of the page's toc (titles flattened to text) so the
    // header — which lives above the TOCProvider — can read it from route data.
    const { toc } = await page.data.load()

    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      rawContent,
      toc: toc.map((item) => ({
        url: item.url,
        title: nodeText(item.title),
        depth: item.depth,
      })),
      neighbours: {
        previous: previous
          ? {
              name: String(previous.name),
              path: previous.url.replace(/^\/docs\/?/, ''),
            }
          : undefined,
        next: next
          ? {
              name: String(next.name),
              path: next.url.replace(/^\/docs\/?/, ''),
            }
          : undefined,
      },
    }
  })

type SerializedNeighbours = {
  previous?: { name: string; path: string }
  next?: { name: string; path: string }
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, lastModified, default: MDX },
    {
      url,
      rawContent,
      neighbours,
    }: { url: string; rawContent: string; neighbours: SerializedNeighbours },
  ) {
    const hasToc = toc?.length

    return (
      <TOCProvider toc={toc}>
        <PageLayout className="mt-4 flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
          <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 lg:px-0 lg:py-8 dark:text-neutral-300">
            <div data-page-header="" className="relative mb-2 space-y-3 pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                  <PageHeaderHeading className="xl:leading-none">
                    {frontmatter.title}
                  </PageHeaderHeading>
                  <PageHeaderDescription>
                    {frontmatter.description}
                  </PageHeaderDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <DocsPager neighbours={neighbours} />
                  <DocsCopyPage content={rawContent} url={url} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[color-mix(in_oklab,var(--color-border)_40%,transparent)] via-[color-mix(in_oklab,var(--color-border)_90%,transparent)] to-[color-mix(in_oklab,var(--color-border)_50%,transparent)]" />
            </div>
            <div>
              <MDX components={mdxComponents} />
            </div>
            <div className="min-w-0">
              {lastModified && (
                <PageLastUpdate date={lastModified} className="mt-12" />
              )}
            </div>
          </div>
          {/* -mt-4 cancels PageLayout's mt-4 so the TOC top lines up with the
              sidebar (which isn't inside PageLayout) at scroll 0, matching the
              already-aligned scrolled/sticky state. */}
          <div className="sticky top-(--header-height) z-30 -mt-4 hidden max-h-[90svh] w-(--sidebar-width) flex-col gap-4 self-start overflow-hidden overscroll-none pb-8 xl:flex">
            {hasToc && <TOC className="pr-12" />}
          </div>
          {/* In-flow TOC column for md–xl: it reserves layout space (instead of
              floating) so the content column stays centered. Mirrors the xl
              rail's sticky/-mt-4 alignment; pt lands the lines on the title.
              px-6 lines the bars up with the header's right-edge icon glyph
              (which is inset ~8px inside its button), mirroring how the sidebar
              text lines up with the logo on the left. */}
          {hasToc && (
            <div className="sticky top-(--header-height) z-30 -mt-4 hidden w-16 shrink-0 justify-end self-start px-6 pt-10 md:flex lg:pt-12 xl:hidden">
              <MiniTOC />
            </div>
          )}
        </PageLayout>
      </TOCProvider>
    )
  },
})

function DocsPage() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)

  return (
    <Content
      url={data.url}
      rawContent={data.rawContent}
      neighbours={data.neighbours}
    />
  )
}
