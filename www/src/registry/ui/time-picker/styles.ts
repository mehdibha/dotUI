import { createStyles } from "@/lib/styles"

import { DATE_CELLS } from "../calendar/styles"
import timePickerMeta from "./meta"

const { useStyles, styles } = createStyles(timePickerMeta, {
  base: {
    slots: {
      columns: "flex h-56 gap-1 p-1",
      column: [
        "flex w-14 scroll-py-1 flex-col gap-0.5 overflow-y-auto outline-hidden",
        "scrollbar-none [&::-webkit-scrollbar]:hidden",
      ],
      item: [
        "flex h-8 w-full shrink-0 items-center justify-center rounded-(--studio-time-picker-item-radius) text-sm tabular-nums no-highlight",
        "cursor-interactive outline-hidden transition-colors duration-(--studio-time-picker-state-duration) ease-(--studio-time-picker-state-ease)",
        DATE_CELLS,
        "focus-visible:focus-ring",
        "disabled:pointer-events-none disabled:text-(--disabled-fg,currentColor)",
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
    spacious: {},
    touch: {},
  },
})

export type TimePickerStyles = typeof styles

export { styles as timePickerStyles, useStyles }
