import { createStyles } from "@/lib/styles"

import popoverMeta from "./meta"

/* Entrances ride the motion tokens (base.css): the character curve and the
   enter / exit durations. Exits keep a plain ease-out. Synced with tooltip —
   change both together. */
const entrance =
  "transition-[transform,opacity,scale] duration-enter ease-enter will-change-[transform,opacity,scale] exiting:duration-exit exiting:ease-out motion-reduce:transition-none"

const nudge =
  "entering:transform-(--origin) exiting:transform-(--origin) placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]"

const { useStyles, styles } = createStyles(popoverMeta, {
  base: {
    slots: {
      popover: [
        "popover z-50 min-w-[max(var(--trigger-width),--spacing(32))] origin-(--trigger-anchor-point) rounded-(--popover-radius) border border-(--overlay-border) bg-popover shadow-[var(--shadow-popover,var(--shadow-md))] [backdrop-filter:var(--overlay-backdrop-filter,none)] forced-color-adjust-none outline-none [--surface-radius:var(--popover-radius)]",
      ],
      // The tip overlaps the panel edge by 1px and strokes its own border.
      arrow: [
        "block [&>svg]:size-2.5 [&>svg]:fill-popover [&>svg]:stroke-border",
        "placement-left:-ml-px placement-right:-mr-px placement-top:-mt-px placement-bottom:-mb-px placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    motion: {
      scale: {
        slots: {
          popover: [
            entrance,
            "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
            "[--slide-offset:--spacing(0.5)]",
            nudge,
          ],
        },
      },
      fade: {
        slots: {
          popover: [entrance, "entering:opacity-0 exiting:opacity-0"],
        },
      },
      slide: {
        slots: {
          popover: [
            entrance,
            "entering:opacity-0 exiting:opacity-0",
            "[--slide-offset:--spacing(2)]",
            nudge,
          ],
        },
      },
      none: {},
    },
    tip: {
      none: { slots: { arrow: "hidden" } },
      tip: {},
    },
  },
})

export type PopoverStyles = typeof styles

export { useStyles }
