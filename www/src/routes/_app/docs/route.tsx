import { createFileRoute, getRouteApi, Outlet } from '@tanstack/react-router'
import type * as PageTree from 'fumadocs-core/page-tree'

import { DocsSidebar } from '@/modules/docs/docs-sidebar'

export const Route = createFileRoute('/_app/docs')({
  component: DocsLayout,
})

const appRoute = getRouteApi('/_app')

function DocsLayout() {
  const { pageTree } = appRoute.useLoaderData()
  const items = pageTree.children as PageTree.Node[]

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] [--sidebar-width:240px]">
      <aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] w-(--sidebar-width) shrink-0 md:block">
        <DocsSidebar items={items} />
        <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent lg:flex" />
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
