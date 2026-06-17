import type * as ButtonPrimitives from 'react-aria-components/Button'
import type * as HeaderPrimitives from 'react-aria-components/Header'
import type * as HeadingPrimitives from 'react-aria-components/Heading'
import type * as LinkPrimitives from 'react-aria-components/Link'

import type { ButtonProps } from '@/registry/ui/button'
import type { SeparatorProps } from '@/registry/ui/separator'
import type { TooltipContentProps } from '@/registry/ui/tooltip'

/**
 * Provides the sidebar's open/collapsed state to everything inside it and renders
 * the layout wrapper. Wrap your whole app shell (the sidebar and its main content)
 * in a single provider.
 */
export interface SidebarProviderProps extends React.ComponentProps<'div'> {
  /**
   * Open state when uncontrolled.
   * @default true
   */
  defaultOpen?: boolean
  /** Open state when controlled. */
  isOpen?: boolean
  /** Handler called when the open state changes. */
  onOpenChange?: (open: boolean) => void
}

/**
 * The sidebar panel itself. Renders a fixed desktop panel and an off-canvas
 * Drawer on mobile, driven by the nearest `SidebarProvider`.
 */
export interface SidebarProps extends React.ComponentProps<'nav'> {
  /**
   * The side the sidebar is anchored to.
   * @default 'left'
   */
  side?: 'left' | 'right'
  /**
   * The visual style of the sidebar. `inset` is designed for `side="left"`.
   * @default 'sidebar'
   */
  variant?: 'sidebar' | 'floating' | 'inset'
  /**
   * How the sidebar collapses: slide off-screen, shrink to icons, or never.
   * @default 'offcanvas'
   */
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

/**
 * The main content area that sits next to the sidebar. Required when using the
 * `inset` variant; otherwise optional.
 */
export interface SidebarInsetProps extends React.ComponentProps<'main'> {}

/** A button that toggles the sidebar open and closed. */
export interface SidebarTriggerProps extends ButtonProps {}

/**
 * A thin, draggable rail along the inner edge of the sidebar that toggles it —
 * a mouse-friendly alternative to the trigger.
 */
export interface SidebarRailProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

/** A sticky header region at the top of the sidebar. */
export interface SidebarHeaderProps extends React.ComponentProps<
  typeof HeaderPrimitives.Header
> {}

/** A sticky footer region at the bottom of the sidebar. */
export interface SidebarFooterProps extends React.ComponentProps<'div'> {}

/** The scrollable region between the header and footer. */
export interface SidebarContentProps extends React.ComponentProps<'div'> {}

/** A separator line styled to fit inside the sidebar. */
export interface SidebarSeparatorProps extends SeparatorProps {}

/** A labelled section of the sidebar, grouping related menus. */
export interface SidebarGroupProps extends React.ComponentProps<'div'> {}

/** The label/heading of a `SidebarGroup`. Hidden when collapsed to icons. */
export interface SidebarGroupLabelProps extends React.ComponentProps<
  typeof HeadingPrimitives.Heading
> {}

/** An action button anchored to the top-right of a `SidebarGroup`. */
export interface SidebarGroupActionProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

/** The content wrapper inside a `SidebarGroup`. */
export interface SidebarGroupContentProps extends React.ComponentProps<'div'> {}

/** The list element that holds `SidebarMenuItem`s. */
export interface SidebarMenuProps extends React.ComponentProps<'ul'> {}

/** A single item (list element) in a `SidebarMenu`. */
export interface SidebarMenuItemProps extends React.ComponentProps<'li'> {}

/**
 * The interactive element inside a `SidebarMenuItem`. Renders a button, or a link
 * when `href` is provided.
 */
export interface SidebarMenuButtonProps extends Omit<
  React.ComponentProps<typeof ButtonPrimitives.Button>,
  'className' | 'render' | 'children'
> {
  /** Marks the item as the active page (highlighted, and `aria-current` on links). */
  isActive?: boolean
  /**
   * Control height and font size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Visual style.
   * @default 'default'
   */
  variant?: 'default' | 'outline'
  /** Label shown in a tooltip when the sidebar is collapsed to icons. */
  tooltip?: React.ReactNode | TooltipContentProps
  /** Render as a link to this destination instead of a button. */
  href?: string
  /** Escape hatch to render the link with a custom element (e.g. a router link). */
  render?: LinkPrimitives.LinkProps['render']
  className?: string
  children?: React.ReactNode
}

/** An action button anchored to the right of a `SidebarMenuItem`. */
export interface SidebarMenuActionProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {
  /** Reveal the action only on hover/focus of the menu item (always shown on touch). */
  showOnHover?: boolean
}

/** A badge (e.g. a count) anchored to the right of a `SidebarMenuItem`. */
export interface SidebarMenuBadgeProps extends React.ComponentProps<'div'> {}

/** A loading placeholder shaped like a `SidebarMenuButton`. */
export interface SidebarMenuSkeletonProps extends React.ComponentProps<'div'> {
  /** Render a leading icon-sized placeholder. */
  showIcon?: boolean
}

/** A nested list of sub-items, indented under a `SidebarMenuItem`. */
export interface SidebarMenuSubProps extends React.ComponentProps<'ul'> {}

/** A single item (list element) in a `SidebarMenuSub`. */
export interface SidebarMenuSubItemProps extends React.ComponentProps<'li'> {}

/**
 * The interactive element inside a `SidebarMenuSubItem`. Renders a button, or a
 * link when `href` is provided.
 */
export interface SidebarMenuSubButtonProps extends Omit<
  React.ComponentProps<typeof ButtonPrimitives.Button>,
  'className' | 'render' | 'children'
> {
  /** Marks the item as the active page (highlighted, and `aria-current` on links). */
  isActive?: boolean
  /**
   * Control font size.
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /** Render as a link to this destination instead of a button. */
  href?: string
  /** Escape hatch to render the link with a custom element (e.g. a router link). */
  render?: LinkPrimitives.LinkProps['render']
  className?: string
  children?: React.ReactNode
}
