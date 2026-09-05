import { createStyles } from "@/lib/styles"

import chartMeta from "./meta"

const { useStyles, styles } = createStyles(chartMeta, {
  base: {
    slots: {
      container: [
        "flex aspect-video justify-center text-xs",
        "[&_.recharts-cartesian-axis-tick_text]:fill-fg-muted [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
      ],
      tooltip:
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-xl",
      legend: "flex items-center justify-center gap-4",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    grid: {
      solid: {},
      dashed: {
        slots: {
          container:
            "[&_.recharts-cartesian-grid_line]:[stroke-dasharray:3_3] [&_.recharts-polar-grid_*]:[stroke-dasharray:3_3]",
        },
      },
      none: {
        slots: {
          container:
            "[&_.recharts-cartesian-grid]:hidden [&_.recharts-polar-grid]:hidden",
        },
      },
    },
  },
})

export type ChartStyles = typeof styles

export { useStyles }
