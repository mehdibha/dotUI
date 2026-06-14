import { createStyles } from '@/modules/core/styles'

import sidebarMeta from './meta'

const { useStyles, styles } = createStyles(sidebarMeta, {
  base: {
    slots: {
      // The element that establishes the sidebar layout: a flex row whose first
      // (or last, for `side="right"`) child reserves the sidebar's width and
      // whose remaining space is taken by `SidebarInset`. `relative` makes it the
      // positioning context for `Sidebar` (which is `absolute`), so the whole
      // thing is self-contained and works embedded in a page, not only full-screen.
      wrapper:
        'group/sidebar-wrapper relative isolate flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
      // The off-screen state machine: every collapsible/variant/side decision is a
      // data-attribute on this element, read by descendants via `group-data-*`.
      root: 'group peer hidden text-fg md:block',
      // In-flow spacer that reserves the sidebar's width in the layout row.
      gap: [
        'relative w-(--sidebar-width) bg-transparent transition-[width] duration-250 ease-fluid-out',
        'group-data-[collapsible=offcanvas]:w-0',
        'group-data-[side=right]:rotate-180',
        'group-data-[variant=sidebar]:group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        'group-data-[variant=floating]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
        'group-data-[variant=inset]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
      ],
      // The painted panel. Absolutely positioned over the gap so content reflows
      // around the gap while the panel can slide/resize independently.
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
      // Mobile panel content (rendered inside a Drawer at < md).
      mobile: 'flex h-full w-full flex-col bg-sidebar text-fg',
      // The main content area beside the sidebar.
      inset: [
        'relative flex w-full flex-1 flex-col bg-bg',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:overflow-hidden md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
        'md:peer-data-[variant=inset]:peer-data-[side=left]:ml-0 md:peer-data-[variant=inset]:peer-data-[side=left]:peer-data-[state=collapsed]:ml-2',
        'md:peer-data-[variant=inset]:peer-data-[side=right]:mr-0 md:peer-data-[variant=inset]:peer-data-[side=right]:peer-data-[state=collapsed]:mr-2',
      ],
      // The thin draggable strip on the inner edge that toggles the sidebar.
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
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type SidebarStyles = typeof styles

export { useStyles }
