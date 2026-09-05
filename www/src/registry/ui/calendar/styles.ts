import { createStyles } from "@/lib/styles"

import calendarMeta from "./meta"

/* The single calendar paints the cell; the range calendar paints the inner
   chip and uses the cell as the band. Day shape owns every radius: rounded
   and circle share the pill band ends and the xs row-edge rounding (spelled
   out twice — the publisher's extractor reads literals only), square runs
   edge to edge. Today markers land on both elements, each scoped to its
   calendar. */

const { useStyles, styles } = createStyles(calendarMeta, {
  base: {
    slots: {
      root: "flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--calendar-cell-radius)] [--cell-size:var(--calendar-cell-size)]",
      header: "flex items-center gap-2",
      heading: "flex-1 text-center text-sm font-medium",
      grid: "grid grid-cols-7 gap-y-2",
      gridHeader: "contents *:[tr]:contents",
      gridHeaderCell: "text-xs font-normal text-fg-muted",
      gridBody: "contents *:[tr]:contents",
      cell: [
        "relative flex aspect-square size-full items-center justify-center text-center text-sm font-medium no-highlight",
        "min-w-(--cell-size) cursor-interactive",
        "disabled:text-(--disabled-fg,currentColor) unavailable:text-fg-disabled unavailable:line-through outside-month:text-fg-disabled",
        "in-data-range-calendar:not-outside-month:selected:bg-accent-muted",
        "focus-reset in-data-calendar:transition-shadow in-data-calendar:hover:bg-accent-muted in-data-calendar:focus-visible:focus-ring in-data-calendar:selected:not-outside-month:bg-accent in-data-calendar:selected:not-outside-month:text-fg-on-accent",
        "outside-month:pointer-events-none",
        "in-data-calendar:not-outside-month:invalid:selected:bg-danger in-data-calendar:not-outside-month:invalid:selected:text-fg-on-danger",
      ],
      cellInner:
        "flex size-full items-center justify-center focus-reset transition-shadow not-in-selection-start:not-in-selection-end:hover:bg-accent-muted in-focus-visible:focus-ring in-data-calendar:contents in-selection-start:not-in-outside-month:bg-accent in-selection-start:not-in-outside-month:text-fg-on-accent in-selection-end:not-in-outside-month:bg-accent in-selection-end:not-in-outside-month:text-fg-on-accent",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    dayShape: {
      rounded: {
        slots: {
          cell: [
            "in-data-calendar:rounded-(--cell-radius)",
            "selection-start:rounded-l-full selection-end:rounded-r-full",
            "in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
            "in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
            "in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
            "in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
          ],
          cellInner: "rounded-(--cell-radius)",
        },
      },
      circle: {
        slots: {
          cell: [
            "in-data-calendar:rounded-full",
            "selection-start:rounded-l-full selection-end:rounded-r-full",
            "in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
            "in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
            "in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)",
            "in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)",
          ],
          cellInner: "rounded-full",
        },
      },
      square: {},
    },
    today: {
      none: {},
      ring: {
        slots: {
          cell: "in-data-calendar:data-today:inset-ring in-data-calendar:data-today:inset-ring-accent",
          cellInner:
            "in-data-range-calendar:in-data-today:inset-ring in-data-range-calendar:in-data-today:inset-ring-accent",
        },
      },
      fill: {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:not-hover:bg-muted",
          cellInner:
            "in-data-range-calendar:in-data-today:not-in-selected:not-hover:bg-muted",
        },
      },
      numeral: {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:text-fg-accent",
          cellInner:
            "in-data-range-calendar:in-data-today:not-in-selected:text-fg-accent",
        },
      },
    },
  },
})

export type CalendarStyles = typeof styles

export { styles as calendarStyles, useStyles }
