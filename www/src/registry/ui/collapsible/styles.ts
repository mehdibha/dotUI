import { createStyles } from "@/lib/styles"

import collapsibleMeta from "./meta"

const expand =
  "duration-(--studio-accordion-enter-duration) ease-(--studio-accordion-ease)"

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
        slots: { panel: [expand, "motion-safe:transition-[height]"] },
      },
      none: {},
    },
  },
})

export { useStyles }
