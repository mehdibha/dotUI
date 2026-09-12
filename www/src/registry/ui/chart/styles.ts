import { createStyles } from "@/lib/styles"

import chartMeta from "./meta"

const { useStyles, styles } = createStyles(chartMeta, {
  base: {
    slots: {
      container: "relative",
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
            "**:data-[ts-key^='ring:']:[stroke-dasharray:3_3] **:data-[ts-key^='spoke:']:[stroke-dasharray:3_3] [&_.ts-chart__grid]:[stroke-dasharray:3_3]",
        },
      },
      none: {
        slots: {
          container:
            "**:data-[ts-key^='ring:']:hidden **:data-[ts-key^='spoke:']:hidden [&_.ts-chart__grid]:hidden",
        },
      },
    },
  },
})

export type ChartStyles = typeof styles

export { useStyles }
