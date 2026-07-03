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
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <MenuItemPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <MenuItemPrimitive
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
        if (href.startsWith('/')) {
          // Internal paths need RouterLink too — a bare <a> full-page reloads.
          const { href: _domHref, ...routerDomProps } = domProps
          return (
            <RouterLink {...({ to: href } as ToOptions)} {...routerDomProps} />
          )
        }
        return <a {...domProps} />
      }}
      {...props}
    />
  )
}

export type { MenuItemProps }
export { MenuItem }
