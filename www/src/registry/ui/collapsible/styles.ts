import { createStyles } from "@/lib/styles"

import collapsibleMeta from "./meta"

/* The accordion's expand timing (accordion/styles.css). */
const expand =
  "duration-(--studio-accordion-enter-duration) ease-(--studio-accordion-ease)"

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
        slots: { panel: [expand, "motion-safe:transition-[height]"] },
      },
      none: {},
    },
  },
})

export type CollapsibleStyles = typeof styles

export { useStyles }
