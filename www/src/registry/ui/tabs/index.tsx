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
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <TabPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <TabPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
          return <div {...domProps} />
        }
        if (typeof href === 'object') {
          // RouterLink treats a literal `href` as authoritative and recomputes
          // to/search/hash from it, dropping the ToOptions fields.
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
