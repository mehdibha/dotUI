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
import { tv } from 'tailwind-variants'

import { createContext } from '@/lib/context'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/ui/button'
import { Drawer } from '@/ui/drawer'
import { Separator } from '@/ui/separator'
import { Skeleton } from '@/ui/skeleton'
import { Tooltip, TooltipContent } from '@/ui/tooltip'
import type { TooltipContentProps } from '@/ui/tooltip'
const sidebarVariants = tv({
  slots: {
    wrapper:
      'group/sidebar-wrapper relative isolate flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
    root: 'group peer hidden text-fg md:block',
    gap: [
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-250 ease-fluid-out',
      'group-data-[collapsible=offcanvas]:w-0',
      'group-data-[side=right]:rotate-180',
      'group-data-[variant=sidebar]:group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      'group-data-[variant=floating]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
      'group-data-[variant=inset]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
    ],
    container: [
      'absolute inset-y-0 z-10 hidden w-(--sidebar-width) transition-[left,right,width] duration-250 ease-fluid-out md:flex',
      'group-data-[side=left]:left-0 group-data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]',
      'group-data-[side=right]:right-0 group-data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      'group-data-[variant=sidebar]:group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      'group-data-[variant=sidebar]:group-data-[side=left]:border-r group-data-[variant=sidebar]:group-data-[side=right]:border-l',
      'group-data-[variant=floating]:p-2 group-data-[variant=inset]:p-2',
      'group-data-[variant=floating]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
      'group-data-[variant=inset]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
    ],
    inner: [
      'flex h-full w-full flex-col bg-sidebar transition-colors duration-250 ease-fluid-out',
      'group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
    ],
    mobile: 'flex h-full w-full flex-col bg-sidebar text-fg',
    inset: [
      'relative flex w-full flex-1 flex-col bg-bg',
      'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:overflow-hidden md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
      'md:peer-data-[variant=inset]:peer-data-[side=left]:ml-0 md:peer-data-[variant=inset]:peer-data-[side=left]:peer-data-[state=collapsed]:ml-2',
      'md:peer-data-[variant=inset]:peer-data-[side=right]:mr-0 md:peer-data-[variant=inset]:peer-data-[side=right]:peer-data-[state=collapsed]:mr-2',
    ],
    rail: [
      'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-interactive outline-hidden transition-all ease-fluid-out group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-border',
      'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
      'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
      'group-data-[side=left]:group-data-[collapsible=offcanvas]:-right-2 group-data-[side=right]:group-data-[collapsible=offcanvas]:-left-2',
    ],
    header: 'flex flex-col gap-2 p-2',
    footer: 'flex flex-col gap-2 p-2',
    separator: 'mx-2 w-auto bg-border',
    content:
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
    group: 'relative flex w-full min-w-0 flex-col p-2',
    groupLabel: [
      'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium whitespace-nowrap text-fg-muted outline-hidden transition-[margin,opacity] duration-200 ease-fluid-out [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
    ],
    groupAction: [
      'absolute top-3.5 right-3 flex aspect-square w-5 cursor-interactive items-center justify-center rounded-md p-0 text-fg-muted outline-hidden transition-colors hover:bg-muted hover:text-fg focus-visible:focus-ring [&>svg]:size-4 [&>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'group-data-[collapsible=icon]:hidden',
    ],
    groupContent: 'w-full text-sm',
    menu: 'flex w-full min-w-0 flex-col gap-1',
    menuItem: 'group/menu-item relative',
    menuButton: [
      'peer/menu-button group/menu-button relative flex w-full cursor-interactive items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm whitespace-nowrap text-fg-muted outline-hidden transition-[width,height,padding,background-color,color]',
      'hover:bg-muted hover:text-fg focus-visible:focus-ring pressed:bg-muted',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[active]:bg-muted data-[active]:font-medium data-[active]:text-fg',
      'data-[size=lg]:h-12 data-[size=lg]:p-2.5 data-[size=md]:h-8 data-[size=sm]:h-7 data-[size=sm]:text-xs',
      'data-[variant=outline]:border data-[variant=outline]:bg-bg data-[variant=outline]:shadow-xs data-[variant=outline]:hover:bg-muted',
      'group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
      'group-has-data-[slot=sidebar-menu-action]/menu-item:pr-8',
      '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
    ],
    menuAction: [
      'absolute top-1.5 right-1 flex aspect-square w-5 cursor-interactive items-center justify-center rounded-md p-0 text-fg-muted outline-hidden transition-colors hover:bg-muted hover:text-fg focus-visible:focus-ring [&>svg]:size-4 [&>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=md]/menu-button:top-1.5 peer-data-[size=sm]/menu-button:top-1',
      'group-data-[collapsible=icon]:hidden',
      'data-[show-on-hover]:group-focus-within/menu-item:opacity-100 data-[show-on-hover]:group-hover/menu-item:opacity-100 data-[show-on-hover]:focus-within:opacity-100 data-[show-on-hover]:md:opacity-0',
    ],
    menuBadge: [
      'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-fg-muted tabular-nums select-none',
      'peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=md]/menu-button:top-1.5 peer-data-[size=sm]/menu-button:top-1',
      'group-data-[collapsible=icon]:hidden',
    ],
    menuSkeleton: 'flex h-8 items-center gap-2 rounded-md px-2',
    menuSkeletonIcon: 'size-4 rounded-md',
    menuSkeletonText: 'h-4 max-w-(--skeleton-width) flex-1',
    menuSub: [
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-border px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
    ],
    menuSubItem: 'group/menu-sub-item relative',
    menuSubButton: [
      'flex h-7 min-w-0 -translate-x-px cursor-interactive items-center gap-2 overflow-hidden rounded-md px-2 text-sm whitespace-nowrap text-fg-muted outline-hidden',
      'hover:bg-muted hover:text-fg focus-visible:focus-ring pressed:bg-muted',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[active]:bg-muted data-[active]:font-medium data-[active]:text-fg',
      'data-[size=md]:text-sm data-[size=sm]:text-xs',
      'group-data-[collapsible=icon]:hidden',
      '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-fg-muted',
    ],
  },
})

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
  const { wrapper } = sidebarVariants()
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
  const { root, gap, container, inner, mobile } = sidebarVariants()
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

interface SidebarInsetProps extends React.ComponentProps<'main'> {}

function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const { inset } = sidebarVariants()
  return (
    <main
      data-slot="sidebar-inset"
      className={inset({ className })}
      {...props}
    />
  )
}

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

interface SidebarRailProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar()
  const { rail } = sidebarVariants()
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

interface SidebarHeaderProps extends React.ComponentProps<
  typeof HeaderPrimitives.Header
> {}

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const { header } = sidebarVariants()
  return (
    <HeaderPrimitives.Header
      data-slot="sidebar-header"
      className={header({ className })}
      {...props}
    />
  )
}

interface SidebarFooterProps extends React.ComponentProps<'div'> {}

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  const { footer } = sidebarVariants()
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

interface SidebarContentProps extends React.ComponentProps<'div'> {}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  const { content } = sidebarVariants()
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

interface SidebarSeparatorProps extends React.ComponentProps<
  typeof Separator
> {}

function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  const { separator } = sidebarVariants()
  return <Separator className={separator({ className })} {...props} />
}

interface SidebarGroupProps extends React.ComponentProps<'div'> {}

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  const { group } = sidebarVariants()
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

interface SidebarGroupLabelProps extends React.ComponentProps<
  typeof HeadingPrimitives.Heading
> {}

function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { groupLabel } = sidebarVariants()
  return (
    <HeadingPrimitives.Heading
      data-slot="sidebar-group-label"
      className={groupLabel({ className })}
      {...props}
    />
  )
}

interface SidebarGroupActionProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function SidebarGroupAction({ className, ...props }: SidebarGroupActionProps) {
  const { groupAction } = sidebarVariants()
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

interface SidebarGroupContentProps extends React.ComponentProps<'div'> {}

function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  const { groupContent } = sidebarVariants()
  return (
    <div
      data-slot="sidebar-group-content"
      className={groupContent({ className })}
      {...props}
    />
  )
}

interface SidebarMenuProps extends React.ComponentProps<'ul'> {}

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  const { menu } = sidebarVariants()
  return (
    <ul data-slot="sidebar-menu" className={menu({ className })} {...props} />
  )
}

interface SidebarMenuItemProps extends React.ComponentProps<'li'> {}

function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  const { menuItem } = sidebarVariants()
  return (
    <li
      data-slot="sidebar-menu-item"
      className={menuItem({ className })}
      {...props}
    />
  )
}

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
  const { menuButton } = sidebarVariants()

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
  const { menuAction } = sidebarVariants()
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

interface SidebarMenuBadgeProps extends React.ComponentProps<'div'> {}

function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  const { menuBadge } = sidebarVariants()
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={menuBadge({ className })}
      {...props}
    />
  )
}

interface SidebarMenuSkeletonProps extends React.ComponentProps<'div'> {
  /** Render a leading icon-sized placeholder. */
  showIcon?: boolean
}

function SidebarMenuSkeleton({
  showIcon = false,
  className,
  ...props
}: SidebarMenuSkeletonProps) {
  const { menuSkeleton, menuSkeletonIcon, menuSkeletonText } = sidebarVariants()

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

interface SidebarMenuSubProps extends React.ComponentProps<'ul'> {}

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  const { menuSub } = sidebarVariants()
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={menuSub({ className })}
      {...props}
    />
  )
}

interface SidebarMenuSubItemProps extends React.ComponentProps<'li'> {}

function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  const { menuSubItem } = sidebarVariants()
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={menuSubItem({ className })}
      {...props}
    />
  )
}

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
  const { menuSubButton } = sidebarVariants()

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
