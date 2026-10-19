import { createStyles } from "@/lib/styles"

import { EXPAND } from "../accordion/styles"
import collapsibleMeta from "./meta"

const { useStyles } = createStyles(collapsibleMeta, {
  base: {
    slots: {
      root: "group/collapsible",
      trigger: "cursor-interactive focus-reset focus-visible:focus-ring",
      panel: "h-(--disclosure-panel-height) overflow-clip",
    },
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

export { useStyles }
