import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import { LinkButton as LinkButtonPrimitive } from './base'
import type { LinkButtonProps as BaseLinkButtonProps } from './base'

export { Button } from './base'
export type { ButtonProps } from './base'
export { buttonStyles, useStyles as useButtonStyles } from './styles'

type LinkButtonProps = Omit<BaseLinkButtonProps, 'href'> & {
  href?: string | ToOptions
}

function LinkButton({ href, ...props }: LinkButtonProps) {
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // a plain link button into an <a href="">.
  if (href === undefined) {
    return <LinkButtonPrimitive {...props} />
  }
  // `ToOptions.to` defaults to the current route, so a hash/search-only
  // object (e.g. `{ hash: 'section' }`) is valid and has no `.to` — fall
  // back to a placeholder so it's still treated as a link.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  // react-aria renders a disabled Link as a <span> natively; skip the custom
  // render so the expected element type matches.
  if (props.isDisabled) {
    return <LinkButtonPrimitive href={hrefString} {...props} />
  }
  return (
    <LinkButtonPrimitive
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

export type { LinkButtonProps }
export { LinkButton }
