import { createStyles } from "@/lib/styles"

import tooltipMeta from "./meta"

/* The entrance's timing is the studio's (styles.css). */
const entrance =
  "transition-[transform,opacity,scale] duration-(--studio-tooltip-enter-duration) ease-(--studio-tooltip-ease) will-change-[transform,opacity,scale] exiting:duration-(--studio-tooltip-exit-duration) exiting:ease-(--studio-tooltip-exit-ease) motion-reduce:transition-none"

/* `--offset` shifts the tooltip toward its trigger, whichever side it lands. */
const offset =
  "placement-left:[--offset:translateX(var(--slide-offset))] placement-right:[--offset:translateX(calc(var(--slide-offset)*-1))] placement-top:[--offset:translateY(var(--slide-offset))] placement-bottom:[--offset:translateY(calc(var(--slide-offset)*-1))]"

const { useStyles, styles } = createStyles(tooltipMeta, {
  base: {
    slots: {
      content: [
        "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-(--studio-tooltip-radius) px-3 py-1.5 text-center text-xs forced-color-adjust-none outline-none",
      ],
      arrow: [
        "block [&>svg]:size-2.5",
        "placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      inverted: {
        slots: {
          content: "bg-tooltip text-fg-on-tooltip",
          arrow: "[&>svg]:fill-tooltip",
        },
      },
      surface: {
        slots: {
          content:
            "border bg-popover text-fg shadow-(--shadow-popover,var(--shadow-md))",
          arrow:
            "placement-left:-ml-px placement-right:-mr-px placement-top:-mt-px placement-bottom:-mb-px [&>svg]:fill-popover [&>svg]:stroke-border",
        },
      },
    },
    motion: {
      // shadcn's: in from 8px off, toward the trigger; out in place.
      scale: {
        slots: {
          content: [
            entrance,
            "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
            "[--slide-offset:--spacing(2)] entering:transform-(--offset)",
            offset,
          ],
        },
      },
      fade: {
        slots: {
          content: [entrance, "entering:opacity-0 exiting:opacity-0"],
        },
      },
      slide: {
        slots: {
          content: [
            entrance,
            "entering:opacity-0 exiting:opacity-0",
            "[--slide-offset:--spacing(2)] entering:transform-(--offset) exiting:transform-(--offset)",
            offset,
          ],
        },
      },
      none: {},
    },
  },
})

export type TooltipStyles = typeof styles

export { useStyles }
