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
            "**:data-[ts-key=grid]:[stroke-dasharray:3_3] **:data-[ts-key^='ring:']:[stroke-dasharray:3_3] **:data-[ts-key^='spoke:']:[stroke-dasharray:3_3]",
        },
      },
      none: {
        slots: {
          container:
            "**:data-[ts-key=grid]:hidden **:data-[ts-key^='ring:']:hidden **:data-[ts-key^='spoke:']:hidden",
        },
      },
    },
  },
})

export type ChartStyles = typeof styles

export { useStyles }
