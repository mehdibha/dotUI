import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field"

import progressBarMeta from "./meta"

const { useStyles, styles } = createStyles(progressBarMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      track:
        "relative flex w-full items-center overflow-x-hidden rounded-(--studio-progress-radius)",
      fill: "h-full w-full bg-(--studio-progress-fill-color) transition-all duration-(--studio-progress-state-duration) ease-(--studio-progress-state-ease) data-indeterminate:w-2/5 data-indeterminate:animate-progress-slide",
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
    spacious: {
      slots: {
        output: "text-sm",
      },
    },
    touch: {
      slots: {
        output: "text-sm",
      },
    },
  },
  params: {
    track: {
      // Material 3 (4dp), shadcn nova/mira/lyra.
      thin: { slots: { track: "h-1" } },
      // Spectrum 2 (6px), Radix Themes (size 2), shadcn vega.
      medium: { slots: { track: "h-1.5" } },
      // Primer, Carbon, Ant Design, Mantine, HeroUI: 8px.
      thick: { slots: { track: "h-2" } },
      // Polaris, Duolingo: 16px.
      "x-heavy": { slots: { track: "h-4" } },
    },
    trackStyle: {
      plain: { slots: { track: "bg-muted" } },
      // Radix Themes (surface): an inset hairline drawn over the fill.
      bordered: {
        slots: {
          track:
            "bg-muted after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:inset-ring after:inset-ring-border",
        },
      },
      /* Material 3: the fill draws the inactive track on both sides of
         itself (4px gaps, clipped by the track) so the sliding segment keeps
         its gaps too, plus a stop dot at the track's end. */
      gap: {
        slots: {
          track:
            "after:absolute after:top-1/2 after:right-0 after:aspect-square after:h-full after:-translate-y-1/2 after:rounded-(--studio-progress-radius) after:bg-(--studio-progress-fill-color)",
          fill: "relative rounded-(--studio-progress-radius) before:absolute before:top-0 before:right-[calc(100%+4px)] before:h-full before:w-screen before:rounded-(--studio-progress-radius) before:bg-muted after:absolute after:top-0 after:left-[calc(100%+4px)] after:h-full after:w-screen after:rounded-(--studio-progress-radius) after:bg-muted",
        },
      },
    },
  },
})

export type ProgressBarStyles = typeof styles

export { useStyles }
