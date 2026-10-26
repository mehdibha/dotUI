import { createStyles } from "@/lib/styles"

import calendarMeta from "./meta"

/** Date cells: a day or time cell that is itself selected paints the checks
 *  fill and hovers its tint. The time picker's selected cell reads it too. */
export const DATE_CELLS =
  "not-selected:hover:bg-selection-muted selected:bg-selection selected:text-fg-on-selection"

/* The row-edge rounding is spelled out twice because the publisher's extractor reads literals only. */

const { useStyles, styles } = createStyles(calendarMeta, {
  base: {
    slots: {
      root: "flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--studio-btn-radius)] [--cell-size:--spacing(8)]",
      header: "flex items-center gap-2",
      heading:
        "flex-1 text-center font-sans text-sm font-medium tracking-normal",
      grid: "grid grid-cols-7 gap-y-2",
      gridHeader: "contents *:[tr]:contents",
      gridHeaderCell: "text-xs font-normal text-fg-muted",
      gridBody: "contents *:[tr]:contents",
      cell: [
        "relative flex aspect-square size-full min-w-(--cell-size) items-center justify-center text-center text-sm font-medium no-highlight",
        "cursor-interactive transition-shadow duration-(--studio-calendar-state-duration) ease-(--studio-calendar-state-ease) outline-none",
        "disabled:text-(--disabled-fg,currentColor) unavailable:text-fg-disabled unavailable:line-through outside-month:pointer-events-none outside-month:text-fg-disabled",
      ],
      cellInner: "",
    },
    variants: {
      range: {
        false: {
          cell: [
            DATE_CELLS,
            "focus-visible:focus-ring",
            "invalid:selected:bg-danger invalid:selected:text-fg-on-danger",
          ],
          cellInner: "contents",
        },
        true: {
          cell: "group/calendar-cell selected:bg-selection-muted",
          cellInner:
            "relative flex size-full items-center justify-center transition-shadow duration-(--studio-calendar-state-duration) ease-(--studio-calendar-state-ease) outline-none group-focus-visible/calendar-cell:focus-ring group-selection-start/calendar-cell:not-group-outside-month/calendar-cell:bg-selection group-selection-start/calendar-cell:not-group-outside-month/calendar-cell:text-fg-on-selection group-selection-end/calendar-cell:not-group-outside-month/calendar-cell:bg-selection group-selection-end/calendar-cell:not-group-outside-month/calendar-cell:text-fg-on-selection not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:hover:bg-selection-muted",
        },
      },
    },
    defaultVariants: { range: false },
  },
  params: {
    dayShape: {
      same: {
        slots: {
          cell: [
            "in-data-calendar:rounded-(--cell-radius)",
            "selection-start:rounded-l-(--cell-radius) selection-end:rounded-r-(--cell-radius)",
            "in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius)",
            "in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius)",
            "in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--cell-radius)",
            "in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--cell-radius)",
          ],
          cellInner:
            "rounded-(--cell-radius) group-selected/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:rounded-[inherit]",
        },
      },
      circle: {
        slots: {
          cell: [
            "in-data-calendar:rounded-full",
            "selection-start:rounded-l-full selection-end:rounded-r-full",
            "in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-full",
            "in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-full",
            "in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-full",
            "in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-full",
          ],
          cellInner: "rounded-full",
        },
      },
    },
    // Neutral markers, then the `-selection` ones in the checks fill.
    today: {
      fill: {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:not-hover:bg-muted",
          cellInner:
            "in-data-range-calendar:group-data-today/calendar-cell:not-group-selected/calendar-cell:not-hover:bg-muted",
        },
      },
      "fill-selection": {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:not-hover:bg-selection in-data-calendar:data-today:not-selected:not-hover:text-fg-on-selection",
          cellInner:
            "in-data-range-calendar:group-data-today/calendar-cell:not-group-selected/calendar-cell:not-hover:bg-selection in-data-range-calendar:group-data-today/calendar-cell:not-group-selected/calendar-cell:not-hover:text-fg-on-selection",
        },
      },
      ring: {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:inset-ring in-data-calendar:data-today:not-selected:inset-ring-border-control",
          cellInner:
            "in-data-range-calendar:group-data-today/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:inset-ring in-data-range-calendar:group-data-today/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:inset-ring-border-control in-data-range-calendar:group-data-today/calendar-cell:group-outside-month/calendar-cell:inset-ring in-data-range-calendar:group-data-today/calendar-cell:group-outside-month/calendar-cell:inset-ring-border-control",
        },
      },
      "ring-selection": {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:text-selection in-data-calendar:data-today:not-selected:inset-ring in-data-calendar:data-today:not-selected:inset-ring-selection in-data-range-calendar:data-today:text-selection",
          cellInner:
            "in-data-range-calendar:group-data-today/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:inset-ring in-data-range-calendar:group-data-today/calendar-cell:not-group-selection-start/calendar-cell:not-group-selection-end/calendar-cell:inset-ring-selection in-data-range-calendar:group-data-today/calendar-cell:group-outside-month/calendar-cell:inset-ring in-data-range-calendar:group-data-today/calendar-cell:group-outside-month/calendar-cell:inset-ring-selection",
        },
      },
      numeral: {
        slots: { cell: "data-today:font-bold" },
      },
      "numeral-selection": {
        slots: {
          cell: "data-today:font-semibold in-data-calendar:data-today:not-selected:text-selection in-data-range-calendar:data-today:text-selection",
        },
      },
      dot: {
        slots: {
          cell: [
            "data-today:after:absolute data-today:after:bottom-1 data-today:after:left-1/2 data-today:after:size-1 data-today:after:-translate-x-1/2 data-today:after:rounded-(--cell-radius)",
            "in-data-calendar:data-today:not-selected:after:bg-fg in-data-calendar:data-today:selected:after:bg-fg-on-selection",
            "in-data-range-calendar:data-today:not-selection-start:not-selection-end:after:bg-fg in-data-range-calendar:data-today:outside-month:after:bg-fg data-today:selection-start:not-outside-month:after:bg-fg-on-selection data-today:selection-end:not-outside-month:after:bg-fg-on-selection",
          ],
        },
      },
      "dot-selection": {
        slots: {
          cell: [
            "data-today:font-semibold in-data-calendar:data-today:not-selected:text-selection in-data-range-calendar:data-today:text-selection",
            "data-today:after:absolute data-today:after:bottom-1 data-today:after:left-1/2 data-today:after:size-1 data-today:after:-translate-x-1/2 data-today:after:rounded-(--cell-radius)",
            "in-data-calendar:data-today:not-selected:after:bg-selection in-data-calendar:data-today:selected:after:bg-fg-on-selection",
            "in-data-range-calendar:data-today:not-selection-start:not-selection-end:after:bg-selection in-data-range-calendar:data-today:outside-month:after:bg-selection data-today:selection-start:not-outside-month:after:bg-fg-on-selection data-today:selection-end:not-outside-month:after:bg-fg-on-selection",
          ],
        },
      },
    },
  },
})

export { styles as calendarStyles, useStyles }
