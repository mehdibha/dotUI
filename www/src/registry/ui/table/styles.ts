import { createStyles } from "@/lib/styles"

import tableMeta from "./meta"

const { useStyles } = createStyles(tableMeta, {
  base: {
    slots: {
      container:
        "relative isolate min-h-0 w-full scroll-pt-10 overflow-auto rounded-(--studio-table-radius) border bg-(--surface-bg,var(--color-bg))",
      table: "min-w-full text-sm text-fg outline-hidden select-ui",
      // Blur lives on the cells, not the thead: a backdrop-filter escapes the scroll container's rounded clip in Chromium.
      header: "sticky top-0 z-10",
      column: [
        "box-border h-10 cursor-default px-2.5 text-left align-middle font-medium whitespace-nowrap outline-none",
        "first:rounded-tl-[calc(var(--studio-table-radius)-1px)] last:rounded-tr-[calc(var(--studio-table-radius)-1px)]",
        "[div]:flex [div]:h-full [div]:items-center",
        "relative hover:text-fg focus-visible:z-20 focus-visible:text-fg focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-(--studio-table-cell-radius) focus-visible:before:focus-ring focus-visible:before:outline-offset-(--studio-focus-inside-offset) focus-visible:before:content-['']",
      ],
      columnContent: "flex h-full min-w-0 items-center gap-1.5",
      columnLabel: "min-w-0 flex-1 truncate",
      chromeColumn: [
        "box-border h-10 px-0 text-left align-middle outline-none",
        "first:rounded-tl-[calc(var(--studio-table-radius)-1px)] last:rounded-tr-[calc(var(--studio-table-radius)-1px)]",
        "[div]:flex [div]:h-full [div]:items-center",
        "relative focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-(--studio-table-cell-radius) focus-visible:before:focus-ring focus-visible:before:outline-offset-(--studio-focus-inside-offset) focus-visible:before:content-['']",
      ],
      selectionColumn: "w-10 min-w-10 px-2.5",
      sortIndicator:
        "size-3.5 shrink-0 text-fg-muted transition-transform duration-(--studio-table-state-duration) ease-(--studio-table-state-ease)",
      resizer: [
        "h-5 w-px translate-x-2 cursor-col-resize rounded-xs bg-border-control bg-clip-content px-2 py-1 outline-none focus-visible:focus-ring",
        "resizing:w-0.5 resizing:bg-border-focus resizing:pl-[7px]",
      ],
      body: "data-empty:h-24 data-empty:text-center data-empty:text-fg-muted",
      footer: "border-t bg-muted/50 font-medium",
      row: [
        "group/row relative box-border cursor-default border-b bg-(--surface-bg,var(--color-bg))/70 transition-colors duration-(--studio-table-state-duration) ease-(--studio-table-state-ease) outline-none last:border-b-0 in-data-striped:odd:bg-muted/40 [div]:h-full",
        "hover:bg-muted/50 pressed:bg-muted/70 selected:bg-selected/50 selected:text-fg-on-selected dragging:cursor-dragging dragging:bg-selected/30 dragging:text-fg dragging:opacity-70 drop-target:bg-selected/30",
        "focus-visible:bg-selected/30 focus-visible:focus-ring focus-visible:outline-offset-(--studio-focus-inside-offset) disabled:text-(--disabled-fg,currentColor)",
      ],
      cell: [
        "relative box-border h-10 align-middle leading-5 whitespace-nowrap outline-none",
        "bg-clip-padding px-2.5",
        "[div]:flex [div]:h-full [div]:w-full [div]:items-center",
        "[&.text-center]:justify-center [&.text-right]:justify-end",
        "focus-visible:z-20 focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-(--studio-table-cell-radius) focus-visible:before:focus-ring focus-visible:before:outline-offset-(--studio-focus-inside-offset) focus-visible:before:content-['']",
      ],
      selectionCell: [
        "w-10 min-w-10 px-2.5",
        "[div]:h-[calc(100%-1px)] [div]:justify-start",
      ],
      dragCell: [
        "w-8 min-w-8 cursor-drag px-1 text-fg-muted group-dragging/row:cursor-dragging",
        "[div]:justify-center",
      ],
      dragButton: [
        "inline-flex size-6 cursor-drag items-center justify-center rounded-(--studio-radius-control-sm) text-fg-muted transition-colors duration-(--studio-table-state-duration) ease-(--studio-table-state-ease) outline-none focus-visible:focus-ring",
        "group-hover/row:text-fg group-dragging/row:cursor-dragging focus-visible:bg-muted focus-visible:text-fg **:[svg]:size-4",
      ],
      dropIndicator: "relative z-20 h-0 outline-none",
      dropIndicatorLine: [
        "pointer-events-none relative z-30 block h-0 w-full opacity-0 transition-opacity duration-(--studio-table-state-duration) ease-(--studio-table-state-ease)",
        "before:absolute before:inset-x-2 before:top-0 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-border-focus before:shadow-[0_0_0_1px_var(--surface-bg,var(--color-bg))] before:content-['']",
      ],
      expandButton: [
        "mr-1 -ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-(--studio-radius-control-sm) text-fg-muted outline-none focus-visible:focus-ring",
        "group-disabled/row:text-(--disabled-fg,var(--color-fg-muted)) hover:bg-muted disabled:text-(--disabled-fg,var(--color-fg-muted))",
      ],
      expandIcon:
        "size-3.5 transition-transform duration-(--studio-table-state-duration) ease-(--studio-table-state-ease)",
      loadMore:
        "relative h-7 **:data-loader:absolute **:data-loader:top-0 **:data-loader:left-1/2 **:data-loader:-translate-x-1/2",
    },
  },
  density: {
    compact: {
      slots: {
        table: "text-xs",
        container: "scroll-pt-8",
        column: "h-8 px-2",
        chromeColumn: "h-8",
        selectionColumn: "px-2",
        cell: "h-8 px-2 leading-4",
        selectionCell: "px-2",
        dragCell: "px-1",
        dragButton: "size-5 **:[svg]:size-3.5",
        expandButton: "size-4.5",
        expandIcon: "size-3",
      },
    },
    default: {
      slots: {
        table: "text-sm",
        column: "h-10 px-2.5",
        chromeColumn: "h-10",
        selectionColumn: "px-2.5",
        cell: "h-10 px-2.5 leading-5",
        selectionCell: "px-2.5",
        dragCell: "px-1",
      },
    },
    comfortable: {
      slots: {
        table: "text-sm",
        container: "scroll-pt-12",
        column: "h-12 px-3",
        chromeColumn: "h-12",
        selectionColumn: "px-3",
        cell: "h-12 px-3 leading-5",
        selectionCell: "px-3",
        dragCell: "px-1.5",
      },
    },
    spacious: {
      slots: {
        table: "text-sm",
        container: "scroll-pt-12",
        column: "h-12 px-4",
        chromeColumn: "h-12",
        selectionColumn: "px-4",
        cell: "h-12 px-4 leading-5",
        selectionCell: "px-4",
        dragCell: "px-2",
      },
    },
    touch: {
      slots: {
        table: "text-sm",
        container: "scroll-pt-14",
        column: "h-14 px-4",
        chromeColumn: "h-14",
        selectionColumn: "px-4",
        cell: "h-14 px-4 leading-5",
        selectionCell: "px-4",
        dragCell: "px-2",
      },
    },
  },
  params: {
    /* The plain header blurs the rows scrolling under it; filled is opaque,
       so it needs no blur. */
    header: {
      plain: {
        slots: {
          header:
            "bg-(--surface-bg,var(--color-bg))/95 supports-[-moz-appearance:none]:bg-(--surface-bg,var(--color-bg))",
          column:
            "border-b bg-(--surface-bg,var(--color-bg))/95 backdrop-blur supports-[-moz-appearance:none]:bg-(--surface-bg,var(--color-bg))",
          chromeColumn:
            "border-b bg-(--surface-bg,var(--color-bg))/95 backdrop-blur supports-[-moz-appearance:none]:bg-(--surface-bg,var(--color-bg))",
        },
      },
      filled: {
        slots: {
          header: "bg-muted",
          column: "bg-muted",
          chromeColumn: "bg-muted",
        },
      },
    },
    headerLabel: {
      strong: { slots: { column: "text-fg" } },
      muted: { slots: { column: "text-fg-muted" } },
    },
  },
})

export { useStyles }
