import { createStyles } from "@/lib/styles"

import commandMeta from "./meta"

const { useStyles, styles } = createStyles(commandMeta, {
  base: {
    base: [
      "group/command flex w-full flex-col gap-1 text-fg",
      // The search field stays pinned; the list owns all the overflow so the
      // collection's own scroll (keyboard focus, scroll-into-view) works.
      "max-h-[inherit]",
      "**:data-search-field:shrink-0",
      "**:data-listbox:min-h-0 **:data-listbox:overflow-y-auto",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      1: {
        base: [
          // The shell inset lives on the search field and inside the scrolling
          // list — never on the root, so the list runs to the surface edge and
          // the scrollbar sits flush against it. The input radius stays
          // concentric by subtracting the inset from the container's own
          // radius var.
          "**:data-search-field:px-1.5 **:data-search-field:pt-1.5 **:data-search-field:pb-0",
          "**:data-listbox:scroll-py-1.5 **:data-listbox:px-1.5 **:data-listbox:pt-0 **:data-listbox:pb-1.5",
          "**:data-listbox:**:data-separator:-mx-1.5 **:data-listbox:**:data-separator:my-1.5",
          "**:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--popover-radius)-(--spacing(1.5)))]",
          // Cards round with the panel radius, not the popover's.
          "in-data-card:**:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--card-radius)-(--spacing(1.5)))]",
          // The modal is a bigger surface — roomier inset to match.
          "in-data-modal:**:data-search-field:px-2 in-data-modal:**:data-search-field:pt-2",
          "in-data-modal:**:data-listbox:scroll-py-2 in-data-modal:**:data-listbox:px-2 in-data-modal:**:data-listbox:pb-2",
          "in-data-modal:**:data-listbox:**:data-separator:-mx-2",
          "in-data-modal:**:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--modal-radius)-(--spacing(2)))]",
        ],
      },
      2: {
        base: [
          "**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0",
          "**:data-search-field:border-b",
          "in-data-modal:**:data-search-field:p-0.5",
        ],
      },
      3: {
        base: [
          // Vercel ⌘K: padded shell, frameless input on an inset hairline,
          // flush list. The inset rides the search field (margins keep the
          // hairline's geometry) and the list's own padding, so the scrollbar
          // sits flush against the popover edge.
          "gap-2",
          // w-auto: margins keep the hairline inset, and the field's base
          // w-full would otherwise add them on top of the full width.
          "**:data-search-field:mx-2 **:data-search-field:mt-2 **:data-search-field:w-auto",
          "**:data-listbox:scroll-py-2 **:data-listbox:px-2 **:data-listbox:pt-0 **:data-listbox:pb-2",
          "**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0",
          "**:data-search-field:border-b **:data-search-field:pb-1.5",
          "**:data-listbox:**:data-separator:mx-0 **:data-listbox:**:data-separator:my-1.5",
        ],
      },
    },
  },
})

export type CommandStyles = typeof styles

export { useStyles }
