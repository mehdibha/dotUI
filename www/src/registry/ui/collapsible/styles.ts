import { createStyles } from "@/lib/styles"

import collapsibleMeta from "./meta"

const { useStyles, styles } = createStyles(collapsibleMeta, {
  base: {
    slots: {
      root: "group/collapsible",
      trigger: "cursor-interactive focus-reset focus-visible:focus-ring",
      panel:
        "h-(--disclosure-panel-height) overflow-clip opacity-0 duration-300 ease-fluid-out group-expanded/collapsible:opacity-100 motion-safe:transition-[height,opacity]",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type CollapsibleStyles = typeof styles

export { useStyles }
