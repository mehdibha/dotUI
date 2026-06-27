import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import type * as PageTree from 'fumadocs-core/page-tree'

import type { SerializedPageTree } from '@/lib/source'
import { Header } from '@/components/layout/header'

const getPageTree = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SerializedPageTree> => {
    const { getSerializedPageTree } = await import('@/lib/source')
    // The page tree is baked into the build, so let Vercel's CDN cache it
    // until the next deploy purge. During document SSR this header lands on
    // the HTML response itself (h3 merges it into 2xx documents only) —
    // harmless while nothing under _app renders per-request content, but
    // revisit if auth/per-user SSR ever lands here.
    setResponseHeader(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=31536000',
    )
    return getSerializedPageTree()
  },
)

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  loader: async () => {
    const pageTree = await getPageTree()
    return { pageTree }
  },
  // The page tree only changes with a build/deploy (Vercel purges the CDN
  // cache on deploy), so never background-revalidate it on re-match.
  staleTime: Infinity,
})

function AppLayout() {
  const { pageTree } = Route.useLoaderData()
  const items = pageTree.children as PageTree.Node[]

  // The reimagined "studio" builder (/create?next=true) owns its own top bar —
  // a focused app shell that merges the site-nav continuity bits (logo→home,
  // theme toggle, GitHub) into the builder's chrome. Skip the global site
  // Header there so the two bars never stack; every other route (and the other
  // /create variants) keeps the normal site Header. --header-height stays
  // defined on this layout so the builder's height math still resolves.
  const { pathname, search } = useLocation()
  const isNextBuilder =
    pathname === '/create' && (search as { next?: boolean }).next === true

  return (
    <div className="[--header-height:--spacing(14)]">
      {!isNextBuilder && <Header items={items} />}
      <main id="content">
        <Outlet />
      </main>
    </div>
  )
}
