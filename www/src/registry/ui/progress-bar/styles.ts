import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field"

import progressBarMeta from "./meta"

const { useStyles, styles } = createStyles(progressBarMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      track: "relative flex w-full items-center overflow-x-hidden rounded-full",
      fill: "h-full w-full bg-primary transition-all",
      output: "ml-auto text-fg-muted tabular-nums",
    },
    variants: {},
    defaultVariants: {},
  },
  density: {
    compact: {
      slots: {
        output: "text-xs",
      },
    },
    default: {
      slots: {
        output: "text-sm",
      },
    },
    comfortable: {
      slots: {
        output: "text-sm",
      },
    },
  },
  params: {
    track: {
      thin: {
        slots: {
          track: "h-1",
        },
      },
      thick: {
        slots: {
          track: "h-2",
        },
      },
    },
    indeterminate: {
      slide: {
        slots: {
          fill: "data-indeterminate:w-2/5 data-indeterminate:animate-progress-slide",
        },
      },
      pulse: {
        slots: {
          fill: "data-indeterminate:animate-progress-pulse",
        },
      },
    },
    /* Material 3's cut track: the fill draws the inactive track on both sides
       of itself (4px gaps, clipped by the track) so the sliding indeterminate
       segment keeps its gaps too, plus a stop dot at the track's end. */
    gap: {
      none: {
        slots: {
          track: "bg-muted",
        },
      },
      cut: {
        slots: {
          track:
            "after:absolute after:top-1/2 after:right-0 after:size-1 after:-translate-y-1/2 after:rounded-full after:bg-primary",
          fill: "relative rounded-full before:absolute before:top-0 before:right-[calc(100%+4px)] before:h-full before:w-screen before:rounded-full before:bg-muted after:absolute after:top-0 after:left-[calc(100%+4px)] after:h-full after:w-screen after:rounded-full after:bg-muted",
        },
      },
    },
  },
})

export type ProgressBarStyles = typeof styles

export { useStyles }
