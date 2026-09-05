import { createStyles } from "@/lib/styles"

import tooltipMeta from "./meta"

/* Entrances ride the motion tokens (base.css): the character curve and the
   enter / exit durations. Exits keep a plain ease-out. Synced with popover —
   change both together. */
const entrance =
  "transition-[transform,opacity,scale] duration-enter ease-enter will-change-[transform,opacity,scale] exiting:duration-exit exiting:ease-out motion-reduce:transition-none"

const nudge =
  "entering:transform-(--origin) exiting:transform-(--origin) placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]"

const { useStyles, styles } = createStyles(tooltipMeta, {
  base: {
    slots: {
      content: [
        "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-(--tooltip-radius) px-3 py-1.5 text-center text-xs forced-color-adjust-none outline-none",
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
          content:
            "bg-tooltip text-fg-on-tooltip shadow-[var(--shadow-overlay,none)]",
          arrow: "[&>svg]:fill-tooltip",
        },
      },
      // The arrow overlaps the panel edge by 1px and strokes its own border.
      surface: {
        slots: {
          content:
            "border bg-popover text-fg shadow-[var(--shadow-overlay,var(--shadow-md))]",
          arrow:
            "placement-left:-ml-px placement-right:-mr-px placement-top:-mt-px placement-bottom:-mb-px [&>svg]:fill-popover [&>svg]:stroke-border",
        },
      },
    },
    motion: {
      scale: {
        slots: {
          content: [
            entrance,
            "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
            "[--slide-offset:--spacing(0.5)]",
            nudge,
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
            "[--slide-offset:--spacing(2)]",
            nudge,
          ],
        },
      },
      none: {},
    },
  },
})

export type TooltipStyles = typeof styles

export { useStyles }
