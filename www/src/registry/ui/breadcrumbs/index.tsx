import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { BreadcrumbLink as BreadcrumbLinkPrimitive } from './base'
import type { BreadcrumbLinkProps } from './base'

export { BreadcrumbItem, BreadcrumbSeparator, Breadcrumbs } from './base'
export type {
  BreadcrumbItemProps,
  BreadcrumbSeparatorProps,
  BreadcrumbsProps,
} from './base'

export function BreadcrumbLink({
  href,
  ...props
}: Omit<BreadcrumbLinkProps, 'href'> & { href?: string | ToOptions }) {
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <BreadcrumbLinkPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <BreadcrumbLinkPrimitive
      href={hrefString}
      render={({ ref, ...domProps }) => {
        // isDisabled can come from context (e.g. a parent Breadcrumbs), so it
        // won't show up in `props` — read it off the resolved DOM props instead.
        if ((domProps as Record<string, unknown>)['data-disabled']) {
          return <span ref={ref as React.Ref<HTMLSpanElement>} {...domProps} />
        }
        if (typeof href === 'object') {
          // RouterLink treats a literal `href` as authoritative and recomputes
          // to/search/hash from it, dropping the ToOptions fields.
          const { href: _domHref, ...routerDomProps } = domProps as Extract<
            typeof domProps,
            { href: unknown }
          >
          return (
            <RouterLink
              ref={ref as React.Ref<HTMLAnchorElement>}
              {...href}
              {...routerDomProps}
            />
          )
        }
        if (href.startsWith('/')) {
          // Internal paths need RouterLink too — a bare <a> full-page reloads.
          const { href: _domHref, ...routerDomProps } = domProps as Extract<
            typeof domProps,
            { href: unknown }
          >
          return (
            <RouterLink
              ref={ref as React.Ref<HTMLAnchorElement>}
              {...({ to: href } as ToOptions)}
              {...routerDomProps}
            />
          )
        }
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={hrefString}
            {...domProps}
          />
        )
      }}
      {...props}
    />
  )
}
