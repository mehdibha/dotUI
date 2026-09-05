import { createStyles } from "@/lib/styles"

import tooltipMeta from "./meta"

const { useStyles, styles } = createStyles(tooltipMeta, {
  base: {
    slots: {
      content: [
        "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-(--tooltip-radius) px-3 py-1.5 text-center text-xs forced-color-adjust-none outline-none",
        "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:--spacing(0.5)]",
        "entering:scale-95 entering:transform-(--origin) entering:opacity-0",
        "exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150",
        "placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]",
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
  },
})

export type TooltipStyles = typeof styles

export { useStyles }
