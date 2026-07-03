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
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // every plain item into an <a href="">.
  if (href === undefined) {
    return <ListBoxItemPrimitive {...props} />
  }
  // `ToOptions.to` defaults to the current route, so a hash/search-only
  // object (e.g. `{ hash: 'section' }`) is valid and has no `.to` — fall
  // back to a placeholder so it's still treated as a link.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <ListBoxItemPrimitive
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

export type { ListBoxItemProps }
export { ListBoxItem }
