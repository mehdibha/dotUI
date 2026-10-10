import { createStyles } from "@/lib/styles"

import calendarMeta from "./meta"

/** Date cells: a day or time cell that is itself selected paints the checks
 *  fill and hovers its tint. The time picker's selected cell reads it too. */
export const DATE_CELLS =
  "not-selected:hover:bg-selection-muted selected:bg-selection selected:text-fg-on-selection"

/* A single calendar paints the cell; a range calendar paints the inner chip
   and uses the cell as the band (the checks tint). Day shape owns every
   radius: the band ends match the chip and share the row-edge rounding
   (spelled out twice — the publisher's extractor reads literals only).
   Today markers land on the element that draws the chip in each calendar. */

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
        "cursor-interactive focus-reset transition-shadow duration-(--studio-calendar-state-duration) ease-(--studio-calendar-state-ease)",
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
          cell: "selected:bg-selection-muted",
          cellInner:
            "relative flex size-full items-center justify-center focus-reset transition-shadow duration-(--studio-calendar-state-duration) ease-(--studio-calendar-state-ease) not-in-selection-start:not-in-selection-end:hover:bg-selection-muted in-focus-visible:focus-ring in-selection-start:not-in-outside-month:bg-selection in-selection-start:not-in-outside-month:text-fg-on-selection in-selection-end:not-in-outside-month:bg-selection in-selection-end:not-in-outside-month:text-fg-on-selection",
        },
      },
    },
    defaultVariants: { range: false },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
    spacious: {},
    touch: {},
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
          // Mid-range chips take the band's shape, as shadcn's one element does.
          cellInner:
            "rounded-(--cell-radius) in-selected:not-in-selection-start:not-in-selection-end:rounded-[inherit]",
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
            "in-data-range-calendar:in-data-today:not-in-selected:not-hover:bg-muted",
        },
      },
      "fill-selection": {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:not-hover:bg-selection in-data-calendar:data-today:not-selected:not-hover:text-fg-on-selection",
          cellInner:
            "in-data-range-calendar:in-data-today:not-in-selected:not-hover:bg-selection in-data-range-calendar:in-data-today:not-in-selected:not-hover:text-fg-on-selection",
        },
      },
      ring: {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:inset-ring in-data-calendar:data-today:not-selected:inset-ring-border-control",
          cellInner:
            "in-data-range-calendar:in-data-today:not-in-selection-start:not-in-selection-end:inset-ring in-data-range-calendar:in-data-today:not-in-selection-start:not-in-selection-end:inset-ring-border-control in-data-range-calendar:in-data-today:in-outside-month:inset-ring in-data-range-calendar:in-data-today:in-outside-month:inset-ring-border-control",
        },
      },
      "ring-selection": {
        slots: {
          cell: "in-data-calendar:data-today:not-selected:text-selection in-data-calendar:data-today:not-selected:inset-ring in-data-calendar:data-today:not-selected:inset-ring-selection in-data-range-calendar:data-today:text-selection",
          cellInner:
            "in-data-range-calendar:in-data-today:not-in-selection-start:not-in-selection-end:inset-ring in-data-range-calendar:in-data-today:not-in-selection-start:not-in-selection-end:inset-ring-selection in-data-range-calendar:in-data-today:in-outside-month:inset-ring in-data-range-calendar:in-data-today:in-outside-month:inset-ring-selection",
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

export type CalendarStyles = typeof styles

export { styles as calendarStyles, useStyles }
