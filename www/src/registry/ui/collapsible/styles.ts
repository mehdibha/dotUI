import { createStyles } from "@/lib/styles"

import { EXPAND } from "../accordion/styles"
import collapsibleMeta from "./meta"

const { useStyles, styles } = createStyles(collapsibleMeta, {
  base: {
    slots: {
      root: "group/collapsible",
      trigger: "cursor-interactive focus-reset focus-visible:focus-ring",
      panel: "h-(--disclosure-panel-height) overflow-clip",
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
      expand: {
        slots: { panel: [EXPAND, "motion-safe:transition-[height]"] },
      },
      none: {},
    },
  },
})

export type CollapsibleStyles = typeof styles

export { useStyles }
