import { createStyles } from "@/lib/styles"

import popoverMeta from "./meta"

/* The entrance's timing is the studio's (styles.css); menus, selects and
   pickers ride on it. */
const entrance =
  "transition-[transform,opacity,scale] duration-(--studio-popover-enter-duration) ease-(--studio-popover-ease) will-change-[transform,opacity,scale] exiting:duration-(--studio-popover-exit-duration) exiting:ease-(--studio-popover-exit-ease) motion-reduce:transition-none"

/* `--offset` shifts the panel toward its trigger, whichever side it lands. */
const offset =
  "placement-left:[--offset:translateX(var(--slide-offset))] placement-right:[--offset:translateX(calc(var(--slide-offset)*-1))] placement-top:[--offset:translateY(var(--slide-offset))] placement-bottom:[--offset:translateY(calc(var(--slide-offset)*-1))]"

const { useStyles, styles } = createStyles(popoverMeta, {
  base: {
    slots: {
      popover: [
        "z-50 min-w-[max(var(--trigger-width),--spacing(32))] origin-(--trigger-anchor-point) rounded-(--studio-popover-radius) border-(length:--studio-overlay-stroke) border-(--overlay-border) bg-popover/(--popover-alpha) shadow-(--shadow-popover,var(--shadow-md)) [backdrop-filter:var(--popover-backdrop-filter)] forced-color-adjust-none outline-none [--surface-bg:var(--color-popover)] [--surface-radius:var(--studio-popover-radius)]",
        // Menus and pickers never squeeze a row onto two lines; the list
        // inside sets the trigger-width floor.
        "has-[[role=menu],[role=listbox]]:min-w-min",
      ],
      arrow: [
        "[&>svg]:size-2.5 [&>svg]:fill-popover/(--popover-alpha) [&>svg]:stroke-(--overlay-border) [&>svg]:stroke-(length:--studio-overlay-stroke)",
        "placement-left:-ml-(--studio-overlay-stroke) placement-right:-mr-(--studio-overlay-stroke) placement-top:-mt-(--studio-overlay-stroke) placement-bottom:-mb-(--studio-overlay-stroke) placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
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
  params: {
    motion: {
      // shadcn's: in from 8px off, toward the trigger; out in place.
      scale: {
        slots: {
          popover: [
            entrance,
            "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
            "[--slide-offset:--spacing(2)] entering:transform-(--offset)",
            offset,
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
            "[--slide-offset:--spacing(2)] entering:transform-(--offset) exiting:transform-(--offset)",
            offset,
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
