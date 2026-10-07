import { createStyles } from "@/lib/styles"

import { CONTAINER_SURFACE } from "../card/styles"
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
      heading: "flex font-sans tracking-normal",
      trigger: [
        "focus-reset focus-visible:focus-ring",
        "flex flex-1 cursor-interactive items-start rounded-(--studio-accordion-trigger-radius) py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none",
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
    spacious: {},
    touch: {},
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
      none: {},
    },
    layout: {
      divided: {
        slots: { item: "not-last:border-b" },
      },
      // shadcn mira, maia, luma, rhea: one box, the open item filled.
      // The trigger spans the box, so its ring is drawn inside.
      contained: {
        slots: {
          root: [
            CONTAINER_SURFACE,
            "overflow-clip rounded-(--studio-accordion-radius)",
          ],
          item: "not-last:border-b expanded:bg-muted/50",
          trigger: "px-4 [--focus-ring-inset:inset]",
          panelContent: "px-4",
        },
      },
      // HeroUI splitted: a box per item, no open fill.
      separated: {
        slots: {
          root: "gap-2",
          item: [CONTAINER_SURFACE, "rounded-(--studio-accordion-radius)"],
          trigger: "px-4 [--focus-ring-inset:inset]",
          panelContent: "px-4",
        },
      },
      plain: {},
    },
    marker: {
      "trailing-chevron": {
        slots: {
          trigger: "justify-between gap-4",
          marker: "group-expanded/accordion-item:rotate-180",
        },
      },
      // The tree's expander: a caret that turns a quarter.
      "leading-caret": {
        slots: {
          trigger: "flex-row-reverse justify-end gap-2",
          marker: "group-expanded/accordion-item:rotate-90",
        },
      },
    },
  },
})

export type AccordionStyles = typeof styles

export { useStyles }
