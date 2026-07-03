import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { ListBoxItem as ListBoxItemPrimitive } from './base'
import type { ListBoxItemProps as BaseListBoxItemProps } from './base'

export {
  ListBox,
  ListBoxItemDescription,
  ListBoxItemLabel,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from './base'
export type {
  ListBoxItemDescriptionProps,
  ListBoxItemLabelProps,
  ListBoxProps,
  ListBoxSectionHeaderProps,
  ListBoxSectionProps,
  ListBoxVirtualizerProps,
} from './base'

type ListBoxItemProps<T> = Omit<BaseListBoxItemProps<T>, 'href'> & {
  href?: string | ToOptions
}

function ListBoxItem<T extends object>({
  href,
  ...props
}: ListBoxItemProps<T>) {
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <ListBoxItemPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <ListBoxItemPrimitive
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

export type { ListBoxItemProps }
export { ListBoxItem }
