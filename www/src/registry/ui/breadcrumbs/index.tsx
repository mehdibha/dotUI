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
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // the current-page breadcrumb into an <a href="">.
  if (href === undefined) {
    return <BreadcrumbLinkPrimitive {...props} />
  }
  // `ToOptions.to` defaults to the current route, so a hash/search-only
  // object (e.g. `{ hash: 'section' }`) is valid and has no `.to` — fall
  // back to a placeholder so it's still treated as a link.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  // react-aria renders a disabled Link as a <span> natively; skip the custom
  // render so the expected element type matches.
  if (props.isDisabled) {
    return <BreadcrumbLinkPrimitive href={hrefString} {...props} />
  }
  return (
    <BreadcrumbLinkPrimitive
      href={hrefString}
      render={({ ref, ...domProps }) => {
        // react-aria expects a <span> for disabled links. The isDisabled prop check
        // above can't see links disabled through context (e.g. `<Breadcrumbs isDisabled>`),
        // but the computed DOM props carry data-disabled in that case.
        if ((domProps as Record<string, unknown>)['data-disabled']) {
          return <span ref={ref as React.Ref<HTMLSpanElement>} {...domProps} />
        }
        if (typeof href === 'object') {
          // Drop the literal `href` DOM prop: TanStack Router's `navigate`
          // treats a stray `href` as authoritative and re-derives `to`/
          // `search`/`hash` from it, silently discarding the ToOptions
          // fields (e.g. `hash`) we actually want to navigate with.
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
