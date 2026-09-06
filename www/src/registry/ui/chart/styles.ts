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
            "[&_.ts-chart__grid]:[stroke-dasharray:3_3] [&_[data-ts-key^='ring:']]:[stroke-dasharray:3_3] [&_[data-ts-key^='spoke:']]:[stroke-dasharray:3_3]",
        },
      },
      none: {
        slots: {
          container:
            "[&_.ts-chart__grid]:hidden [&_[data-ts-key^='ring:']]:hidden [&_[data-ts-key^='spoke:']]:hidden",
        },
      },
    },
  },
})

export type ChartStyles = typeof styles

export { useStyles }
