import { createStyles } from "@/lib/styles"

import tabsMeta from "./meta"

/* The `variant` prop is per-instance API; the `style` param sets its default
   for the design system. Every look ships, so each value only retargets
   `defaultVariants`. */

const { useStyles, styles } = createStyles(tabsMeta, {
  base: {
    slots: {
      root: "flex gap-2",
      list: "inline-flex w-fit items-center justify-center text-fg-muted",
      tab: [
        "relative isolate inline-flex flex-1 cursor-default items-center justify-center font-medium whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-none focus-visible:focus-ring",
        "text-fg-muted hover:text-fg disabled:pointer-events-none disabled:text-fg-disabled selected:text-fg",
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      ],
      selectionIndicator:
        "pointer-events-none absolute ease-out motion-safe:transition-[translate,width,height]",
      panel: "flex-1 outline-none data-[inert=true]:hidden",
    },
    variants: {
      orientation: {
        horizontal: {
          root: "flex-col",
          list: "h-(--tabs-list-height) flex-row",
          tab: "h-full",
        },
        vertical: {
          root: "flex-row",
          list: "h-fit flex-col",
          tab: "w-full justify-start",
        },
      },
      variant: {
        line: {
          list: "gap-3 orientation-horizontal:border-b orientation-vertical:border-r",
          tab: "rounded-md",
          selectionIndicator:
            "rounded-full bg-fg orientation-horizontal:-bottom-px orientation-horizontal:left-0 orientation-horizontal:h-0.5 orientation-horizontal:w-full orientation-vertical:top-0 orientation-vertical:-right-px orientation-vertical:h-full orientation-vertical:w-0.5",
        },
        pill: {
          list: "gap-1",
          tab: "rounded-full",
          selectionIndicator: "inset-0 rounded-full bg-muted",
        },
        enclosed: {
          list: "orientation-horizontal:items-end orientation-horizontal:border-b orientation-vertical:border-r",
          // The selected tab steps one pixel onto the list's edge and paints
          // over it, so tab and content read as one surface.
          tab: "border border-transparent orientation-horizontal:-mb-px orientation-horizontal:rounded-t-(--tabs-radius) orientation-vertical:-mr-px orientation-vertical:rounded-l-(--tabs-radius) selected:z-10 selected:border-border selected:bg-bg orientation-horizontal:selected:border-b-transparent orientation-vertical:selected:border-r-transparent",
          selectionIndicator: "hidden",
        },
      },
    },
    defaultVariants: {
      variant: "line",
    },
  },
  density: {
    compact: {
      slots: {
        root: "[--tabs-list-height:2rem]",
        tab: "gap-1.5 px-1.5 py-0.5 text-xs has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-3.5",
        panel: "text-xs/relaxed",
      },
    },
    default: {
      slots: {
        root: "[--tabs-list-height:2rem]",
        tab: "gap-1.5 px-1.5 py-0.5 text-sm has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-4",
        panel: "text-sm",
      },
    },
    comfortable: {
      slots: {
        root: "[--tabs-list-height:2.25rem]",
        tab: "gap-1.5 px-2.5 py-1 text-sm has-data-icon-end:pr-2 has-data-icon-start:pl-2 **:[svg]:not-with-[size]:size-4",
        panel: "text-sm",
      },
    },
  },
  params: {
    style: {
      line: { defaultVariants: { variant: "line" } },
      pill: { defaultVariants: { variant: "pill" } },
      enclosed: { defaultVariants: { variant: "enclosed" } },
    },
  },
})

export type TabsStyles = typeof styles

export { useStyles }
