import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import {
  SidebarMenuButton as SidebarMenuButtonPrimitive,
  SidebarMenuSubButton as SidebarMenuSubButtonPrimitive,
} from "./base"
import type {
  SidebarMenuButtonProps as BaseSidebarMenuButtonProps,
  SidebarMenuSubButtonProps as BaseSidebarMenuSubButtonProps,
} from "./base"

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
} from "./base"
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
} from "./base"

type SidebarMenuButtonProps = Omit<BaseSidebarMenuButtonProps, "href"> & {
  href?: RouterHref
}

function SidebarMenuButton({ href, ...props }: SidebarMenuButtonProps) {
  return <SidebarMenuButtonPrimitive {...routerLinkProps(href)} {...props} />
}

type SidebarMenuSubButtonProps = Omit<BaseSidebarMenuSubButtonProps, "href"> & {
  href?: RouterHref
}

function SidebarMenuSubButton({ href, ...props }: SidebarMenuSubButtonProps) {
  return <SidebarMenuSubButtonPrimitive {...routerLinkProps(href)} {...props} />
}

export type { SidebarMenuButtonProps, SidebarMenuSubButtonProps }
export { SidebarMenuButton, SidebarMenuSubButton }
