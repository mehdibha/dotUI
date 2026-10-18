import { createStyles } from "@/lib/styles"

import {
  OVERLAY_FADE,
  OVERLAY_SCALE,
  OVERLAY_SLIDE,
  STROKED_TIP,
} from "../popover/styles"
import tooltipMeta from "./meta"

const entrance =
  "transition-[transform,opacity,scale] duration-(--studio-tooltip-enter-duration) ease-(--studio-tooltip-ease) will-change-[transform,opacity,scale] exiting:duration-(--studio-tooltip-exit-duration) exiting:ease-(--studio-tooltip-exit-ease) motion-reduce:transition-none"

const { useStyles, styles } = createStyles(tooltipMeta, {
  base: {
    slots: {
      content: [
        "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-(--studio-tooltip-radius) px-3 py-1.5 text-center text-xs forced-color-adjust-none outline-none",
      ],
      arrow: [
        "placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
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
    style: {
      inverted: {
        slots: {
          content: "bg-tooltip text-fg-on-tooltip",
          arrow: "[&>svg]:size-2.5 [&>svg]:fill-tooltip",
        },
      },
      surface: {
        slots: {
          content:
            "border-(length:--studio-overlay-stroke) border-(--overlay-border) bg-popover/(--popover-alpha) text-fg shadow-(--shadow-popover,var(--shadow-md)) [backdrop-filter:var(--popover-backdrop-filter)] [--surface-bg:var(--color-popover)]",
          arrow: STROKED_TIP,
        },
      },
    },
    tip: {
      tip: {},
      // The 10px offset clears a tip; without one the gap closes to 4px.
      none: {
        slots: {
          content:
            "placement-left:translate-x-1.5 placement-right:-translate-x-1.5 placement-top:translate-y-1.5 placement-bottom:-translate-y-1.5",
          arrow: "hidden",
        },
      },
    },
    motion: {
      scale: { slots: { content: [entrance, OVERLAY_SCALE] } },
      fade: { slots: { content: [entrance, OVERLAY_FADE] } },
      slide: { slots: { content: [entrance, OVERLAY_SLIDE] } },
      none: {},
    },
  },
})

export type TooltipStyles = typeof styles

export { useStyles }
