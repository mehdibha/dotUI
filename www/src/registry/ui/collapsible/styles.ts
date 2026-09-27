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
  },
  params: {
    motion: {
      expand: {
        slots: { panel: [expand, "motion-safe:transition-[height]"] },
      },
      fade: {
        slots: {
          panel: [
            expand,
            "opacity-0 group-expanded/collapsible:opacity-100 motion-safe:transition-[height,opacity]",
          ],
        },
      },
      none: {},
    },
  },
})

export type CollapsibleStyles = typeof styles

export { useStyles }
