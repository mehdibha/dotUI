import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { DocsCopyPage } from "@/modules/docs/docs-copy-page"
import { DocsPager } from "@/modules/docs/docs-pager"
import { PageLastUpdate } from "@/modules/docs/last-update"
import { mdxComponents } from "@/modules/docs/mdx-components"
import {
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/modules/docs/page-layout"
import { MiniTOC, TOC, TOCProvider } from "@/modules/docs/toc"
import browserCollections from "@/.source/browser"

type SerializedNeighbours = {
  previous?: { name: string; path: string }
  next?: { name: string; path: string }
}

// The docs rendering pipeline (MDX components, shiki, TOC) lives in this
// non-route file so it stays out of the router's critical import graph — the
// route file reaches it via `component` (code-split) and a dynamic import in
// its loader. Both resolve to this same chunk, loaded only on /docs pages.
export const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, lastModified, default: MDX },
    {
      url,
      rawContent,
      neighbours,
    }: { url: string; rawContent: string; neighbours: SerializedNeighbours },
  ) {
    const hasToc = (toc?.length ?? 0) > 0
    // Wide layout (frontmatter `full: true`): widen the content column and drop
    // the xl TOC rail; the in-flow MiniTOC column takes over at every width.
    // Width only — prose and heading styles stay identical to other docs pages.
    const full = frontmatter.full

    return (
      <TOCProvider toc={toc}>
        <PageLayout className="mt-4 flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
          <div
            className={cn(
              // Padding tracks the header's logo inset (pl-4/md:pl-6). Narrow
              // pages center at every width (left-hugging strands them far from
              // the MiniTOC); wide (full) pages nearly fill the row below lg,
              // so they hug the left edge to stay aligned with the logo, and
              // keep lg padding until xl centering slack separates them from
              // the sidebar and MiniTOC rails.
              "flex w-full min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-6 dark:text-neutral-300",
              // mr-auto: when the column hits max-w below lg, the auto margin
              // absorbs the leftover flex space so the MiniTOC column stays
              // pinned to the viewport edge (aligned with the header's menu
              // button) instead of trailing the capped column.
              full
                ? "mr-auto max-w-4xl lg:mx-auto lg:px-8 xl:px-0"
                : "mx-auto max-w-2xl lg:px-0",
            )}
          >
            <div data-page-header="" className="relative mb-2 space-y-3 pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <PageHeaderHeading className="min-w-0 xl:leading-none">
                    {frontmatter.title}
                  </PageHeaderHeading>
                  <div className="flex shrink-0 items-center gap-3">
                    <DocsCopyPage content={rawContent} url={url} />
                    <DocsPager neighbours={neighbours} />
                  </div>
                </div>
                <PageHeaderDescription>
                  {frontmatter.description}
                </PageHeaderDescription>
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
          {!full && (
            <div className="sticky top-(--header-height) z-30 -mt-4 hidden max-h-[90svh] w-(--sidebar-width) flex-col gap-4 self-start overflow-hidden overscroll-none pb-8 xl:flex">
              {hasToc && <TOC className="pr-12" />}
            </div>
          )}
          {/* In-flow TOC column for md–xl (all widths ≥md on full pages): it
              reserves layout space (instead of floating) so the content column
              stays centered. Mirrors the xl rail's sticky/-mt-4 alignment; pt
              lands the lines on the title. px-6 lines the bars up with the
              header's right-edge icon glyph (which is inset ~8px inside its
              button), mirroring how the sidebar text lines up with the logo on
              the left. */}
          {hasToc && (
            <div
              className={cn(
                "sticky top-(--header-height) z-30 -mt-4 hidden w-16 shrink-0 justify-end self-start px-6 pt-10 md:flex",
                !full && "xl:hidden",
              )}
            >
              <MiniTOC />
            </div>
          )}
        </PageLayout>
      </TOCProvider>
    )
  },
})

const route = getRouteApi("/_app/docs/$")

export function DocsPage() {
  const data = route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)

  return (
    <Content
      url={data.url}
      rawContent={data.rawContent}
      neighbours={data.neighbours}
    />
  )
}
