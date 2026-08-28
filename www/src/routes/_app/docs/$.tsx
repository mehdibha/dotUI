import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { findNeighbour } from "fumadocs-core/page-tree"

import { siteConfig } from "@/config/site"
import { nodeText } from "@/lib/node-text"
import { docsSource } from "@/lib/source"
import { truncateOnWord } from "@/lib/text"

import { DocsPage } from "./-docs-page"

/** Section label above the title on the OG card: the docs folder a page sits
 *  in, or "Docs" for the top-level pages that have no folder. */
function ogEyebrow(url: string) {
  const segments = url
    .replace(/^\/docs\/?/, "")
    .split("/")
    .filter(Boolean)
  if (segments.length < 2) return "Docs"
  return segments[0]!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export const Route = createFileRoute("/_app/docs/$")({
  component: DocsPage,
  // Docs content only changes with a build/deploy (Vercel purges the CDN cache
  // on deploy), so never background-revalidate it on re-match.
  staleTime: Infinity,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? []
    const data = await serverLoader({ data: slugs })
    // Same chunk the component needs — dynamic so the MDX/shiki pipeline
    // stays out of the critical route graph shared by every page.
    const { clientLoader } = await import("./-docs-page")
    await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Docs"
    const description = loaderData?.description
    const truncatedDescription = description
      ? truncateOnWord(description, 148, true)
      : undefined
    const url = loaderData?.url ?? "/docs"
    const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(title)}${truncatedDescription ? `&description=${encodeURIComponent(truncatedDescription)}` : ""}&eyebrow=${encodeURIComponent(ogEyebrow(url))}`

    return {
      meta: [
        { title: `${title} - ${siteConfig.name}` },
        ...(description ? [{ name: "description", content: description }] : []),
        { property: "og:title", content: title },
        ...(truncatedDescription
          ? [{ property: "og:description", content: truncatedDescription }]
          : []),
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${siteConfig.url}${url}` },
        { property: "og:image", content: ogImageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        ...(truncatedDescription
          ? [{ name: "twitter:description", content: truncatedDescription }]
          : []),
        { name: "twitter:image", content: ogImageUrl },
        { name: "twitter:creator", content: siteConfig.twitter.creator },
      ],
      links: [
        // Markdown alternate for AI agents — served by the /docs/{$}.md route.
        // The docs index (url "/docs") is exposed as /docs/index.md by that route.
        {
          rel: "alternate",
          type: "text/markdown",
          href: `${siteConfig.url}${url === "/docs" ? "/docs/index" : url}.md`,
        },
      ],
    }
  },
})

const serverLoader = createServerFn({ method: "GET" })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    // Try to get the page, fallback to index for empty slugs
    let page = docsSource.getPage(slugs)
    if (!page && slugs.length === 0) {
      page = docsSource.getPage(["index"])
    }
    if (!page) throw notFound()

    // Success path only (don't cache not-found responses): content is baked
    // into the build, so let Vercel's CDN cache it until the next deploy purge.
    setResponseHeader(
      "Cache-Control",
      "public, max-age=0, must-revalidate, s-maxage=31536000",
    )

    const pageTree = docsSource.getPageTree()
    const { previous, next } = findNeighbour(pageTree, page.url)
    const rawContent = await page.data.getText("processed")
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
              path: previous.url.replace(/^\/docs\/?/, ""),
            }
          : undefined,
        next: next
          ? {
              name: String(next.name),
              path: next.url.replace(/^\/docs\/?/, ""),
            }
          : undefined,
      },
    }
  })
