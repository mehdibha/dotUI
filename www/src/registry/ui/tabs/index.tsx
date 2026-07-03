import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { Tab as TabPrimitive } from './base'
import type { TabProps as BaseTabProps } from './base'

export { TabIndicator, TabList, TabPanel, Tabs } from './base'
export type {
  TabIndicatorProps,
  TabListProps,
  TabPanelProps,
  TabsProps,
} from './base'

type TabProps = Omit<BaseTabProps, 'href'> & { href?: string | ToOptions }

function Tab({ href, ...props }: TabProps) {
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // every plain tab into an <a href="">.
  if (href === undefined) {
    return <TabPrimitive {...props} />
  }
  // `ToOptions.to` defaults to the current route, so a hash/search-only
  // object (e.g. `{ hash: 'section' }`) is valid and has no `.to` — fall
  // back to a placeholder so it's still treated as a link.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <TabPrimitive
      href={hrefString}
      render={(domProps) => {
        // The `in` check narrows the div|anchor props union; render is only
        // passed for links, so the div branch is a type-level fallback.
        if (!('href' in domProps)) {
          return <div {...domProps} />
        }
        if (typeof href === 'object') {
          // Drop the literal `href` DOM prop: TanStack Router's `navigate`
          // treats a stray `href` as authoritative and re-derives `to`/
          // `search`/`hash` from it, silently discarding the ToOptions
          // fields (e.g. `hash`) we actually want to navigate with.
          const { href: _domHref, ...routerDomProps } = domProps
          return <RouterLink {...href} {...routerDomProps} />
        }
        return <a {...domProps} />
      }}
      {...props}
    />
  )
}

export type { TabProps }
export { Tab }
