import { createStyles } from "@/lib/styles"

import accordionMeta from "./meta"

/* The expand's timing is the studio's (styles.css); the collapsible rides on
   it, and the marker turns in step with the panel. */
const expand =
  "duration-(--studio-accordion-enter-duration) ease-(--studio-accordion-ease)"

const { useStyles, styles } = createStyles(accordionMeta, {
  base: {
    slots: {
      root: "flex w-full flex-col",
      item: "group/accordion-item w-full disabled:text-(--disabled-fg,currentColor) disabled:**:[svg]:text-(--disabled-fg,currentColor)",
      heading: "flex",
      trigger: [
        "focus-reset focus-visible:focus-ring",
        "flex flex-1 cursor-interactive items-start gap-4 rounded-(--studio-accordion-trigger-radius) py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none",
      ],
      marker:
        "pointer-events-none shrink-0 translate-y-0.5 text-fg-muted **:[svg]:size-4",
      panel:
        "h-(--disclosure-panel-height) overflow-clip text-sm text-fg-muted",
      panelContent: "pb-3",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    motion: {
      // shadcn's: the height alone.
      expand: {
        slots: {
          marker: [expand, "transition-transform"],
          panel: [expand, "motion-safe:transition-[height]"],
        },
      },
      fade: {
        slots: {
          marker: [expand, "transition-transform"],
          panel: [
            expand,
            "opacity-0 group-expanded/accordion-item:opacity-100 motion-safe:transition-[height,opacity]",
          ],
        },
      },
      none: {},
    },
    container: {
      divided: {
        slots: {
          item: "not-last:border-b",
        },
      },
      boxed: {
        slots: {
          root: "rounded-(--studio-accordion-radius) border bg-card",
          item: "px-3 not-last:border-b",
        },
      },
      cards: {
        slots: {
          root: "gap-2",
          item: "rounded-(--studio-accordion-radius) border bg-card px-3",
        },
      },
    },
    marker: {
      chevron: {
        slots: {
          marker: "group-expanded/accordion-item:rotate-180",
        },
      },
      plus: {},
    },
    markerPosition: {
      trailing: {
        slots: {
          trigger: "justify-between",
        },
      },
      leading: {
        slots: {
          trigger: "flex-row-reverse justify-end",
        },
      },
    },
  },
})

export type AccordionStyles = typeof styles

export { useStyles }
