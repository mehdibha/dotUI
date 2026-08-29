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
          "p-1.5 **:data-listbox:p-0 **:data-search-field:pb-0 **:data-listbox:**:data-separator:-mx-1.5 **:data-listbox:**:data-separator:my-1.5 **:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--radius-panel)-(--spacing(1.5)))]",
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
          // Vercel ⌘K: padded shell, frameless input on an inset hairline, flush list.
          "gap-2 p-2 **:data-listbox:p-0",
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
