import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { findNeighbour } from 'fumadocs-core/page-tree'
import { ChevronDownIcon } from 'lucide-react'

import { siteConfig } from '@/config/site'
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
import { TOC, TOCItems, TOCProvider } from '@/modules/docs/toc'
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

    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      rawContent,
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
          <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
            <div data-page-header="" className="relative mb-2 space-y-3 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <PageHeaderHeading className="xl:leading-none">
                    {frontmatter.title}
                  </PageHeaderHeading>
                  <PageHeaderDescription>
                    {frontmatter.description}
                  </PageHeaderDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DocsPager neighbours={neighbours} />
                  <DocsCopyPage content={rawContent} url={url} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[color-mix(in_oklab,var(--color-border)_40%,transparent)] via-[color-mix(in_oklab,var(--color-border)_90%,transparent)] to-[color-mix(in_oklab,var(--color-border)_50%,transparent)]" />
            </div>
            {/* Tablet/mobile fallback for the right-rail TOC, which is xl-only.
                Below xl there's otherwise no in-page navigation at all. */}
            {hasToc ? (
              <details className="group rounded-lg border bg-card xl:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  On this page
                  <ChevronDownIcon className="size-4 text-fg-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="relative border-t px-2 py-2">
                  <TOCItems />
                </div>
              </details>
            ) : null}
            <div>
              <MDX components={mdxComponents} />
            </div>
            <div className="min-w-0">
              {lastModified && (
                <PageLastUpdate date={lastModified} className="mt-12" />
              )}
            </div>
          </div>
          <div className="sticky top-[calc(var(--header-height)+14px)] z-30 hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
            {hasToc && <TOC className="pr-12" />}
          </div>
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
