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
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <LinkButtonPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <LinkButtonPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
          return <span {...domProps} />
        }
        // isDisabled can come from context, so it won't show up in `props` —
        // read it off the resolved DOM props instead.
        if ((domProps as unknown as Record<string, unknown>)['data-disabled']) {
          return <span {...domProps} />
        }
        if (typeof href === 'object') {
          // RouterLink treats a literal `href` as authoritative and recomputes
          // to/search/hash from it, dropping the ToOptions fields.
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
