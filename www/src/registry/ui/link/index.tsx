import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { Link as LinkPrimitive } from './base'
import type { LinkProps as BaseLinkProps } from './base'

type LinkProps = Omit<BaseLinkProps, 'href'> & { href?: string | ToOptions }

function Link({ href, ...props }: LinkProps) {
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <LinkPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <LinkPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
          return <span {...domProps} />
        }
        // isDisabled can come from context, not just props — read it off the
        // resolved DOM props instead.
        if ((domProps as unknown as Record<string, unknown>)['data-disabled']) {
          return <span {...domProps} />
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

export type { LinkProps }
export { Link }
