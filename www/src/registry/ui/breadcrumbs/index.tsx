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
  const hrefString = typeof href === 'object' ? href.to : href
  if (!hrefString) {
    return <BreadcrumbLinkPrimitive {...props} />
  }
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
          return (
            <RouterLink
              ref={ref as React.Ref<HTMLAnchorElement>}
              {...href}
              {...domProps}
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
