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
  // Only pass `href`/`render` for actual links: an explicit `href={undefined}`
  // still counts as a link prop to react-aria (`'href' in props`), which turns
  // every plain item into an <a href="">.
  const hrefString = typeof href === 'object' ? href.to : href
  if (!hrefString) {
    return <SidebarMenuButtonPrimitive {...props} />
  }
  return (
    <SidebarMenuButtonPrimitive
      href={hrefString}
      render={(domProps) => {
        // The `in` check narrows the span|anchor props union; render is only
        // passed for links, so the span branch is a type-level fallback.
        if (!('href' in domProps)) {
          return <span {...domProps} />
        }
        if (typeof href === 'object') {
          return <RouterLink {...href} {...domProps} />
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
  const hrefString = typeof href === 'object' ? href.to : href
  if (!hrefString) {
    return <SidebarMenuSubButtonPrimitive {...props} />
  }
  return (
    <SidebarMenuSubButtonPrimitive
      href={hrefString}
      render={(domProps) => {
        if (!('href' in domProps)) {
          return <span {...domProps} />
        }
        if (typeof href === 'object') {
          return <RouterLink {...href} {...domProps} />
        }
        return <a {...domProps} />
      }}
      {...props}
    />
  )
}

export type { SidebarMenuButtonProps, SidebarMenuSubButtonProps }
export { SidebarMenuButton, SidebarMenuSubButton }
