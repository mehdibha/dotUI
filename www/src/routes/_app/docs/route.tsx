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
    <div className="flex min-h-[calc(100vh-var(--header-height))] [--sidebar-width:228px]">
      <aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] w-fit shrink-0 lg:block xl:w-(--sidebar-width)">
        <DocsSidebar items={items} />
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
