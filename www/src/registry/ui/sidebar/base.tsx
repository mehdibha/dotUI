'use client'

import * as React from 'react'
import { PanelLeftIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as HeaderPrimitives from 'react-aria-components/Header'
import * as HeadingPrimitives from 'react-aria-components/Heading'
import * as LinkPrimitives from 'react-aria-components/Link'
import { Provider } from 'react-aria-components/slots'
import { useSlotId } from 'react-aria/private/utils/useId'
import { useControlledState } from 'react-stately/useControlledState'

import { useIsMobile } from '@/registry/hooks/use-mobile'
import { createContext } from '@/registry/lib/context'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Drawer } from '@/registry/ui/drawer'
import { Separator } from '@/registry/ui/separator'
import { Skeleton } from '@/registry/ui/skeleton'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import type { TooltipContentProps } from '@/registry/ui/tooltip'

import { useStyles } from './styles'

// MARK: sidebarStyles

const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarState = 'expanded' | 'collapsed'

interface SidebarContextValue {
  state: SidebarState
  isOpen: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const [SidebarContext, useSidebarContext] = createContext<SidebarContextValue>({
  name: 'SidebarProvider',
  strict: true,
})

/** Access the sidebar's open/collapsed state and toggles from any descendant. */
function useSidebar(): SidebarContextValue {
  return useSidebarContext('useSidebar')
}

// MARK: Separator

interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function SidebarProvider({
  defaultOpen = true,
  isOpen: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const { wrapper } = useStyles()()
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [isOpen, setOpen] = useControlledState<boolean>(
    openProp,
    defaultOpen,
    onOpenChange,
  )

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((open) => !open)
    } else {
      setOpen(!isOpen)
    }
  }, [isMobile, isOpen, setOpen])

  // Toggle with ⌘B / Ctrl+B. Inlined (rather than the use-keyboard-shortcut hook)
  // so the shipped sidebar stays a single self-contained file.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleSidebar])

  const state: SidebarState = isOpen ? 'expanded' : 'collapsed'

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      isOpen,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, isOpen, setOpen, isMobile, openMobile, toggleSidebar],
  )

  return (
    <SidebarContext value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={wrapper({ className })}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  )
}

// MARK: Separator

type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'

// Exposes the owning Sidebar's `collapsible` mode to descendants (e.g. so menu
// buttons only show their collapsed tooltip when the sidebar actually shrinks to
// icons, not for offcanvas/none).
const SidebarItemContext = React.createContext<{
  collapsible: SidebarCollapsible
}>({ collapsible: 'offcanvas' })

/**
 * Wraps the sidebar's children so a `<Heading>` (e.g. in `SidebarHeader`) labels
 * the nav landmark, while content/footer headings are reset (`null`) so they don't
 * claim that label — each `SidebarGroup` re-establishes its own labelling id.
 */
function SidebarNav({
  headingId,
  collapsible,
  children,
}: {
  headingId?: string
  collapsible: SidebarCollapsible
  children: React.ReactNode
}) {
  return (
    <SidebarItemContext value={{ collapsible }}>
      <Provider
        values={[[HeadingPrimitives.HeadingContext, { id: headingId }]]}
      >
        {children}
      </Provider>
    </SidebarItemContext>
  )
}

interface SidebarProps extends React.ComponentProps<'nav'> {
  side?: 'left' | 'right'
  /**
   * The visual style of the sidebar. `inset` is designed for `side="left"`.
   * @default 'sidebar'
   */
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: SidebarCollapsible
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const { root, gap, container, inner, mobile } = useStyles()()
  const headingId = useSlotId()

  if (collapsible === 'none') {
    return (
      <nav
        data-slot="sidebar"
        aria-label="Sidebar"
        aria-labelledby={headingId}
        className={inner({ className: cn('w-(--sidebar-width)', className) })}
        {...props}
      >
        <SidebarNav headingId={headingId} collapsible={collapsible}>
          {children}
        </SidebarNav>
      </nav>
    )
  }

  if (isMobile) {
    return (
      <Drawer
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        placement={side}
        className="w-(--sidebar-width) max-w-(--sidebar-width) border-0"
        style={
          { '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties
        }
      >
        <nav
          data-slot="sidebar"
          data-mobile="true"
          aria-label="Sidebar"
          aria-labelledby={headingId}
          className={mobile({ className })}
          {...props}
        >
          <SidebarNav headingId={headingId} collapsible={collapsible}>
            {children}
          </SidebarNav>
        </nav>
      </Drawer>
    )
  }

  return (
    <div
      className={root()}
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      <div data-slot="sidebar-gap" className={gap()} />
      <div data-slot="sidebar-container" className={container()}>
        <nav
          data-slot="sidebar-inner"
          aria-label="Sidebar"
          aria-labelledby={headingId}
          className={inner({ className })}
          {...props}
        >
          <SidebarNav headingId={headingId} collapsible={collapsible}>
            {children}
          </SidebarNav>
        </nav>
      </div>
    </div>
  )
}

// MARK: Separator

interface SidebarInsetProps extends React.ComponentProps<'main'> {}

function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const { inset } = useStyles()()
  return (
    <main
      data-slot="sidebar-inset"
      className={inset({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {}

function SidebarTrigger({
  onPress,
  className,
  children,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      variant="quiet"
      size="sm"
      isIconOnly
      aria-label="Toggle Sidebar"
      className={cn('size-7', className)}
      onPress={(event) => {
        onPress?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {children ?? <PanelLeftIcon />}
    </Button>
  )
}

// MARK: Separator

interface SidebarRailProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar()
  const { rail } = useStyles()()
  return (
    <ButtonPrimitives.Button
      aria-label="Toggle Sidebar"
      excludeFromTabOrder
      onPress={toggleSidebar}
      className={composeRenderProps(className, (c) => rail({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarHeaderProps extends React.ComponentProps<
  typeof HeaderPrimitives.Header
> {}

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const { header } = useStyles()()
  return (
    <HeaderPrimitives.Header
      data-slot="sidebar-header"
      className={header({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarFooterProps extends React.ComponentProps<'div'> {}

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  const { footer } = useStyles()()
  return (
    <Provider values={[[HeadingPrimitives.HeadingContext, null]]}>
      <div
        data-slot="sidebar-footer"
        className={footer({ className })}
        {...props}
      />
    </Provider>
  )
}

// MARK: Separator

interface SidebarContentProps extends React.ComponentProps<'div'> {}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  const { content } = useStyles()()
  return (
    <Provider values={[[HeadingPrimitives.HeadingContext, null]]}>
      <div
        data-slot="sidebar-content"
        className={content({ className })}
        {...props}
      />
    </Provider>
  )
}

// MARK: Separator

interface SidebarSeparatorProps extends React.ComponentProps<
  typeof Separator
> {}

function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  const { separator } = useStyles()()
  return <Separator className={separator({ className })} {...props} />
}

// MARK: Separator

interface SidebarGroupProps extends React.ComponentProps<'div'> {}

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  const { group } = useStyles()()
  const headingId = useSlotId()
  return (
    <Provider values={[[HeadingPrimitives.HeadingContext, { id: headingId }]]}>
      <div
        data-slot="sidebar-group"
        role="group"
        aria-labelledby={headingId}
        className={group({ className })}
        {...props}
      />
    </Provider>
  )
}

// MARK: Separator

interface SidebarGroupLabelProps extends React.ComponentProps<
  typeof HeadingPrimitives.Heading
> {}

function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { groupLabel } = useStyles()()
  return (
    <HeadingPrimitives.Heading
      data-slot="sidebar-group-label"
      className={groupLabel({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarGroupActionProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function SidebarGroupAction({ className, ...props }: SidebarGroupActionProps) {
  const { groupAction } = useStyles()()
  return (
    <ButtonPrimitives.Button
      data-slot="sidebar-group-action"
      className={composeRenderProps(className, (c) =>
        groupAction({ className: c }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarGroupContentProps extends React.ComponentProps<'div'> {}

function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  const { groupContent } = useStyles()()
  return (
    <div
      data-slot="sidebar-group-content"
      className={groupContent({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuProps extends React.ComponentProps<'ul'> {}

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  const { menu } = useStyles()()
  return (
    <ul data-slot="sidebar-menu" className={menu({ className })} {...props} />
  )
}

// MARK: Separator

interface SidebarMenuItemProps extends React.ComponentProps<'li'> {}

function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  const { menuItem } = useStyles()()
  return (
    <li
      data-slot="sidebar-menu-item"
      className={menuItem({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuButtonProps extends Omit<
  React.ComponentProps<typeof ButtonPrimitives.Button>,
  'className' | 'render' | 'children'
> {
  /** Marks the item as the active page (highlighted, `aria-current` on links). */
  isActive?: boolean
  /** Control height/font. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Visual style. @default 'default' */
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

function SidebarMenuButton({
  isActive = false,
  size = 'md',
  variant = 'default',
  tooltip,
  href,
  render,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { state, isMobile } = useSidebar()
  const { collapsible } = React.useContext(SidebarItemContext)
  const { menuButton } = useStyles()()

  const sharedProps = {
    'data-slot': 'sidebar-menu-button',
    'data-size': size,
    'data-variant': variant,
    'data-active': isActive || undefined,
    className: menuButton({ className }),
  }

  const button =
    href != null ? (
      <LinkPrimitives.Link
        href={href}
        render={render}
        aria-current={isActive ? 'page' : undefined}
        {...sharedProps}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </LinkPrimitives.Link>
    ) : (
      <ButtonPrimitives.Button {...sharedProps} {...props}>
        {children}
      </ButtonPrimitives.Button>
    )

  if (!tooltip) {
    return button
  }

  const tooltipContentProps: TooltipContentProps =
    tooltip != null &&
    typeof tooltip === 'object' &&
    !React.isValidElement(tooltip) &&
    !Array.isArray(tooltip)
      ? (tooltip as TooltipContentProps)
      : { children: tooltip as React.ReactNode }

  // Only surface the tooltip when the sidebar is actually shrunk to icons —
  // not for `offcanvas` (whole panel hidden) or `none` (labels still visible).
  const showTooltip =
    state === 'collapsed' && collapsible === 'icon' && !isMobile

  return (
    <Tooltip isDisabled={!showTooltip} delay={0}>
      {button}
      <TooltipContent hideArrow placement="right" {...tooltipContentProps} />
    </Tooltip>
  )
}

// MARK: Separator

interface SidebarMenuActionProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {
  /** Reveal the action only on hover/focus of the menu item (always shown on touch). */
  showOnHover?: boolean
}

function SidebarMenuAction({
  showOnHover = false,
  className,
  ...props
}: SidebarMenuActionProps) {
  const { menuAction } = useStyles()()
  return (
    <ButtonPrimitives.Button
      data-slot="sidebar-menu-action"
      data-show-on-hover={showOnHover || undefined}
      className={composeRenderProps(className, (c) =>
        menuAction({ className: c }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuBadgeProps extends React.ComponentProps<'div'> {}

function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  const { menuBadge } = useStyles()()
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={menuBadge({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuSkeletonProps extends React.ComponentProps<'div'> {
  /** Render a leading icon-sized placeholder. */
  showIcon?: boolean
}

function SidebarMenuSkeleton({
  showIcon = false,
  className,
  ...props
}: SidebarMenuSkeletonProps) {
  const { menuSkeleton, menuSkeletonIcon, menuSkeletonText } = useStyles()()

  // Deterministic per-instance width (50%–90%) derived from the React id so SSR
  // and client render identically — Math.random() here would hydrate-mismatch.
  const id = React.useId()
  const width = React.useMemo(() => {
    let hash = 0
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    }
    return `${50 + (hash % 41)}%`
  }, [id])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={menuSkeleton({ className })}
      {...props}
    >
      {showIcon && <Skeleton className={menuSkeletonIcon()} />}
      <Skeleton
        className={menuSkeletonText()}
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </div>
  )
}

// MARK: Separator

interface SidebarMenuSubProps extends React.ComponentProps<'ul'> {}

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  const { menuSub } = useStyles()()
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={menuSub({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuSubItemProps extends React.ComponentProps<'li'> {}

function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  const { menuSubItem } = useStyles()()
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={menuSubItem({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface SidebarMenuSubButtonProps extends Omit<
  React.ComponentProps<typeof ButtonPrimitives.Button>,
  'className' | 'render' | 'children'
> {
  /** Marks the item as the active page (highlighted, `aria-current` on links). */
  isActive?: boolean
  /** Control font size. @default 'md' */
  size?: 'sm' | 'md'
  /** Render as a link to this destination instead of a button. */
  href?: string
  /** Escape hatch to render the link with a custom element (e.g. a router link). */
  render?: LinkPrimitives.LinkProps['render']
  className?: string
  children?: React.ReactNode
}

function SidebarMenuSubButton({
  isActive = false,
  size = 'md',
  href,
  render,
  className,
  children,
  ...props
}: SidebarMenuSubButtonProps) {
  const { menuSubButton } = useStyles()()

  const sharedProps = {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    'data-size': size,
    'data-active': isActive || undefined,
    className: menuSubButton({ className }),
  }

  if (href != null) {
    return (
      <LinkPrimitives.Link
        href={href}
        render={render}
        aria-current={isActive ? 'page' : undefined}
        {...sharedProps}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </LinkPrimitives.Link>
    )
  }

  return (
    <ButtonPrimitives.Button {...sharedProps} {...props}>
      {children}
    </ButtonPrimitives.Button>
  )
}

// MARK: Separator

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
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
}
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
