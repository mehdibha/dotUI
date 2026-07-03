import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { Link as LinkPrimitive } from './base'
import type { LinkProps as BaseLinkProps } from './base'

type LinkProps = Omit<BaseLinkProps, 'href'> & { href?: string | ToOptions }

function Link({ href, ...props }: LinkProps) {
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // a plain link into an <a href="">.
  if (href === undefined) {
    return <LinkPrimitive {...props} />
  }
  // `ToOptions.to` defaults to the current route, so a hash/search-only
  // object (e.g. `{ hash: 'section' }`) is valid and has no `.to` — fall
  // back to a placeholder so it's still treated as a link.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  // react-aria renders a disabled Link as a <span> natively; skip the custom
  // render so the expected element type matches.
  if (props.isDisabled) {
    return <LinkPrimitive href={hrefString} {...props} />
  }
  return (
    <LinkPrimitive
      href={hrefString}
      render={(domProps) => {
        // The `in` check narrows the span|anchor props union; render is only
        // passed for links, so the span branch is a type-level fallback.
        if (!('href' in domProps)) {
          return <span {...domProps} />
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

export type { LinkProps }
export { Link }
