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

  // The /create Studio builder owns its full-height shell, including its own top
  // bar that carries the site Logo + theme/github for continuity. Rendering the
  // global site Header there too would stack two bars, so skip it for that one
  // route+flag — every other route (and the default /create + ?lab variants,
  // which have no bar of their own) keeps the normal site Header unchanged.
  const location = useLocation()
  const search = location.search as { studio?: boolean }
  const ownsShell = location.pathname === '/create' && Boolean(search.studio)

  return (
    <div className="[--header-height:--spacing(14)]">
      {!ownsShell && <Header items={items} />}
      <main id="content">
        <Outlet />
      </main>
    </div>
  )
}
