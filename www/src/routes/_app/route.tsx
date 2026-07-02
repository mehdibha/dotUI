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

  // The /create builder is its own focused "app": it renders a builder-specific
  // top bar (StudioTopBar) in place of the site nav, so the global Header would
  // stack a second bar on top of it. Skip it there and let /create own its bar.
  // The opt-in panel-lab experiment (?lab=true) still depends on the site Header
  // above it, so keep rendering it for that view only. `--header-height` stays
  // defined here so the builder's `100svh - --header-height` math is unchanged.
  const { pathname, search } = useLocation()
  // Mirror the /create route's `lab: z.coerce.boolean()` (i.e. plain `Boolean`)
  // so the same `?lab=…` values that open the panel-lab experiment also keep the
  // site Header above it. `useLocation` here is the unvalidated parent search.
  const isLab = Boolean((search as { lab?: unknown }).lab)
  const isBuilder = pathname === '/create' && !isLab

  return (
    <div className="[--header-height:--spacing(14)]">
      {!isBuilder && <Header items={items} />}
      <main id="content">
        <Outlet />
      </main>
    </div>
  )
}
