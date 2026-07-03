import { Link as RouterLink } from '@tanstack/react-router'
import type { ToOptions } from '@tanstack/react-router'

import {
  SidebarMenuButton as SidebarMenuButtonPrimitive,
  SidebarMenuSubButton as SidebarMenuSubButtonPrimitive,
} from './base'
import type {
  SidebarMenuButtonProps as BaseSidebarMenuButtonProps,
  SidebarMenuSubButtonProps as BaseSidebarMenuSubButtonProps,
} from './base'

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './base'
export type {
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
} from './base'

type SidebarMenuButtonProps = Omit<BaseSidebarMenuButtonProps, 'href'> & {
  href?: string | ToOptions
}

function SidebarMenuButton({ href, ...props }: SidebarMenuButtonProps) {
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) {
    return <SidebarMenuButtonPrimitive {...props} />
  }
  // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <SidebarMenuButtonPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
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

type SidebarMenuSubButtonProps = Omit<BaseSidebarMenuSubButtonProps, 'href'> & {
  href?: string | ToOptions
}

function SidebarMenuSubButton({ href, ...props }: SidebarMenuSubButtonProps) {
  if (href === undefined) {
    return <SidebarMenuSubButtonPrimitive {...props} />
  }
  const hrefString = typeof href === 'object' ? (href.to ?? '#') : href
  return (
    <SidebarMenuSubButtonPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
          return <span {...domProps} />
        }
        if (typeof href === 'object') {
          const { href: _domHref, ...routerDomProps } = domProps
          return <RouterLink {...href} {...routerDomProps} />
        }
        return <a {...domProps} />
      }}
      {...props}
    />
  )
}

export type { SidebarMenuButtonProps, SidebarMenuSubButtonProps }
export { SidebarMenuButton, SidebarMenuSubButton }
