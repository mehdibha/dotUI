import { createStyles } from '@/modules/core/styles'

import tableMeta from './meta'

const { useStyles, styles } = createStyles(tableMeta, {
  base: {
    slots: {
      container:
        'relative isolate min-h-0 w-full scroll-pt-10 overflow-auto rounded-md border border-border bg-bg',
      table: 'min-w-full text-sm text-fg outline-hidden select-none',
      header:
        'sticky top-0 z-10 bg-bg/95 backdrop-blur supports-[-moz-appearance:none]:bg-bg',
      column: [
        'box-border h-10 cursor-default border-b border-border bg-bg/95 px-2.5 text-left align-middle font-medium whitespace-nowrap text-fg-muted focus-reset outline-hidden backdrop-blur supports-[-moz-appearance:none]:bg-bg',
        '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:items-center',
        "relative hover:text-fg focus-visible:z-20 focus-visible:text-fg focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-['']",
      ],
      columnContent: 'flex h-full min-w-0 items-center gap-1.5',
      columnLabel: 'min-w-0 flex-1 truncate',
      chromeColumn: [
        'box-border h-10 border-b border-border bg-bg/95 px-0 text-left align-middle focus-reset outline-hidden backdrop-blur supports-[-moz-appearance:none]:bg-bg',
        '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:items-center',
        "relative focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-['']",
      ],
      selectionColumn: 'w-10 min-w-10 px-2.5',
      sortIndicator:
        'size-3.5 shrink-0 text-fg-muted transition-transform duration-150',
      resizer: [
        'h-5 w-px translate-x-2 cursor-col-resize rounded-xs bg-border bg-clip-content px-2 py-1 focus-reset focus-visible:focus-ring',
        'resizing:w-0.5 resizing:bg-border-focus resizing:pl-[7px]',
      ],
      body: 'data-[empty]:h-24 data-[empty]:text-center data-[empty]:text-fg-muted',
      footer:
        'border-t bg-muted/50 font-medium [&_[role=row]]:last:border-b-0 [&>tr]:last:border-b-0',
      row: [
        'group/row relative box-border cursor-default border-b border-border bg-bg/70 focus-reset transition-colors [&:is(div)]:h-full',
        'hover:bg-muted/50 data-[state=selected]:bg-accent-muted pressed:bg-muted/70 selected:bg-accent-muted dragging:cursor-grabbing dragging:bg-accent-muted/70 dragging:text-fg dragging:opacity-70 drop-target:bg-accent-muted/70',
        'focus-visible:bg-accent-muted/70 disabled:text-fg-disabled focus-visible:[&>*:first-child]:shadow-[inset_3px_0_0_0_var(--color-border-focus)]',
      ],
      cell: [
        'relative box-border h-10 align-middle leading-5 whitespace-nowrap focus-reset outline-hidden',
        'bg-clip-padding px-2.5',
        '[&:is(div)]:flex [&:is(div)]:h-full [&:is(div)]:w-full [&:is(div)]:items-center',
        '[&.text-center]:justify-center [&.text-right]:justify-end',
        "focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-md focus-visible:before:[outline:2px_solid_var(--color-border-focus)] focus-visible:before:[outline-offset:-2px] focus-visible:before:content-[''] data-[focus-visible]:z-20 data-[focus-visible]:before:pointer-events-none data-[focus-visible]:before:absolute data-[focus-visible]:before:inset-0 data-[focus-visible]:before:rounded-md data-[focus-visible]:before:[outline:2px_solid_var(--color-border-focus)] data-[focus-visible]:before:[outline-offset:-2px] data-[focus-visible]:before:content-['']",
      ],
      selectionCell: [
        'w-10 min-w-10 px-2.5',
        '[&:is(div)]:h-[calc(100%-1px)] [&:is(div)]:justify-start',
      ],
      dragCell: [
        'w-8 min-w-8 cursor-grab px-1 text-fg-muted group-data-[dragging]/row:cursor-grabbing',
        '[&:is(div)]:justify-center',
      ],
      dragButton: [
        'inline-flex size-6 cursor-grab items-center justify-center rounded-sm text-fg-muted focus-reset transition-colors focus-visible:focus-ring',
        'group-hover/row:text-fg group-data-[dragging]/row:cursor-grabbing focus-visible:bg-muted focus-visible:text-fg **:[svg]:size-4',
      ],
      dropIndicator: 'relative z-20 h-0 focus-reset outline-hidden',
      dropIndicatorLine: [
        'pointer-events-none relative z-30 block h-0 w-full opacity-0 transition-opacity',
        "before:absolute before:inset-x-2 before:top-0 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-border-focus before:shadow-[0_0_0_1px_var(--color-bg)] before:content-['']",
      ],
      expandButton: [
        'mr-1 -ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-fg-muted focus-reset focus-visible:focus-ring',
        'hover:bg-muted disabled:text-fg-disabled',
      ],
      expandIcon: 'size-3.5 transition-transform duration-150',
      loadMore: [
        'relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2 **:data-[slot=loader]:-translate-x-1/2',
        '[&_[data-slot=loader]_svg]:size-4',
      ],
    },
  },
  density: {
    compact: {
      slots: {
        table: 'text-xs',
        container: 'scroll-pt-8',
        column: 'h-8 px-2',
        chromeColumn: 'h-8',
        selectionColumn: 'px-2',
        cell: 'h-8 px-2 leading-4',
        selectionCell: 'px-2',
        dragCell: 'px-1',
        dragButton: 'size-5 **:[svg]:size-3.5',
        expandButton: 'size-4.5',
        expandIcon: 'size-3',
      },
    },
    default: {
      slots: {
        table: 'text-sm',
        column: 'h-10 px-2.5',
        chromeColumn: 'h-10',
        selectionColumn: 'px-2.5',
        cell: 'h-10 px-2.5 leading-5',
        selectionCell: 'px-2.5',
        dragCell: 'px-1',
      },
    },
    comfortable: {
      slots: {
        table: 'text-sm',
        container: 'scroll-pt-12',
        column: 'h-12 px-3',
        chromeColumn: 'h-12',
        selectionColumn: 'px-3',
        cell: 'h-12 px-3 leading-5',
        selectionCell: 'px-3',
        dragCell: 'px-1.5',
      },
    },
  },
})

export type TableStyles = typeof styles

export { useStyles }
