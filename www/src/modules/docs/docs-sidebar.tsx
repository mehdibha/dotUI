import { useEffect, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import type * as PageTree from 'fumadocs-core/page-tree'

import type { DocsPageItem } from '@/lib/source'
import { cn } from '@/registry/lib/utils'

export function DocsSidebar({ items }: { items: PageTree.Node[] }) {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Docs"
      className="scrollbar-none flex h-full scroll-fade-y flex-col gap-6 overflow-y-auto scroll-smooth rounded-2xl pt-10 pr-3 pb-6 pl-4 scroll-fade-6"
    >
      {items.map((item) => {
        if (item.type === 'folder') {
          return (
            <div key={item.$id} className="flex flex-col">
              <h4 className="mb-1 px-2 text-sm font-medium text-fg">
                {item.name}
              </h4>
              {item.children.map((child) => {
                if (child.type !== 'page') return null
                return (
                  <DocsSidebarLink
                    key={child.url}
                    item={child as DocsPageItem}
                    isActive={pathname === child.url}
                  />
                )
              })}
            </div>
          )
        }
        if (item.type === 'page') {
          return (
            <DocsSidebarLink
              key={item.url}
              item={item as DocsPageItem}
              isActive={pathname === item.url}
            />
          )
        }
        return null
      })}
    </nav>
  )
}

function DocsSidebarLink({
  item,
  isActive,
}: {
  item: DocsPageItem
  isActive: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  // In the long flat Components list the active page can sit far down the
  // overflow-y-auto nav; pull it into view on load / navigation. Guarded so it
  // only scrolls when actually out of view. `behavior: 'instant'` is required —
  // the nav uses `scroll-smooth`, which otherwise swallows this programmatic
  // scroll on mount.
  useEffect(() => {
    if (!isActive) return
    const el = ref.current
    const scroller = el?.closest('nav')
    if (!el || !scroller) return
    const er = el.getBoundingClientRect()
    const sr = scroller.getBoundingClientRect()
    if (er.top < sr.top || er.bottom > sr.bottom) {
      el.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
  }, [isActive])

  return (
    <Link
      ref={ref}
      to="/docs/$"
      params={{ _splat: item.url.replace(/^\/docs\/?/, '') }}
      className="text-[0.8rem]"
    >
      <span
        className={cn(
          'flex items-center gap-2 rounded-md bg-transparent px-2 py-1 text-fg-muted transition-colors hover:text-fg',
          isActive && 'bg-neutral font-medium text-fg',
        )}
      >
        <span>{item.name}</span>
      </span>
    </Link>
  )
}
