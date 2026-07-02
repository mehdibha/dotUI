import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { MenuItem as MenuItemPrimitive } from './base'
import type { MenuItemProps as BaseMenuItemProps } from './base'

export {
  Menu,
  MenuContent,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from './base'
export type {
  MenuContentProps,
  MenuItemDescriptionProps,
  MenuItemLabelProps,
  MenuProps,
  MenuSectionHeaderProps,
  MenuSectionProps,
  MenuSubProps,
} from './base'

type MenuItemProps<T> = Omit<BaseMenuItemProps<T>, 'href'> & {
  href?: string | ToOptions
}

function MenuItem<T extends object>({ href, ...props }: MenuItemProps<T>) {
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // every plain item into an <a href="">.
  const hrefString = typeof href === 'object' ? href.to : href
  if (!hrefString) {
    return <MenuItemPrimitive {...props} />
  }
  return (
    <MenuItemPrimitive
      href={hrefString}
      render={(domProps) => {
        // The `in` check narrows the div|anchor props union; render is only
        // passed for links, so the div branch is a type-level fallback.
        if (!('href' in domProps)) {
          return <div {...domProps} />
        }
        if (typeof href === 'object') {
          // Drop react-aria's echoed `href` attribute: router.navigate treats a
          // present `href` option as the navigation source, re-deriving
          // to/search/hash from the raw string and losing the ToOptions hash.
          const { href: _, ...routerLinkProps } = domProps
          return <RouterLink {...href} {...routerLinkProps} />
        }
        return <a {...domProps} />
      }}
      {...props}
    />
  )
}

export type { MenuItemProps }
export { MenuItem }
