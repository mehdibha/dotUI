import { createStyles } from "@/lib/styles"

import commandMeta from "./meta"

// A frameless input over a hairline that runs the full width of the surface.
const HAIRLINE_FIELD =
  "**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0 **:data-search-field:border-b"

const { useStyles, styles } = createStyles(commandMeta, {
  base: {
    base: [
      "group/command flex w-full flex-col gap-1 text-fg",
      // The search field stays pinned; the list owns all the overflow so the
      // collection's own scroll (keyboard focus, scroll-into-view) works.
      "max-h-[inherit]",
      "**:data-search-field:shrink-0",
      "**:data-listbox:min-h-0 **:data-listbox:overflow-y-auto",
      // Modal and drawer commands are spotlight/touch surfaces — taller rows
      // than a dropdown. Their inline padding follows the inset param.
      "in-data-modal:**:data-listbox-item:py-2 in-data-modal:**:data-menu-item:py-2",
      "in-data-drawer:**:data-listbox-item:py-2 in-data-drawer:**:data-menu-item:py-2",
      // Command rows and headings sit taller than a menu's (shadcn: py-1.5 in
      // every style), and headings carry weight so they read as group labels.
      "**:data-listbox-item:py-1.5 **:data-listbox-section-header:py-1.5 **:data-listbox-section-header:font-medium",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    search: {
      field: {
        base: [
          // The shell inset lives on the search field and inside the scrolling
          // list — never on the root, so the list runs to the surface edge and
          // the scrollbar sits flush against it. The input radius stays
          // concentric by subtracting the inset from the container's own
          // radius var, floored at the input radius so small surfaces never
          // square it off.
          "**:data-search-field:px-2 **:data-search-field:pt-2 **:data-search-field:pb-0",
          "**:data-listbox:scroll-py-2 **:data-listbox:pt-0 **:data-listbox:pb-2",
          "**:data-listbox:**:data-separator:my-2",
          // --surface-radius: set by whichever rounded surface contains the
          // command (popover, modal, card), so one rule stays concentric
          // everywhere.
          "**:[[data-search-field]>[data-input-group]]:rounded-[max(var(--input-radius),calc(var(--surface-radius,var(--radius-surface))-(--spacing(2))))]",
        ],
      },
      bar: {
        base: [HAIRLINE_FIELD, "in-data-modal:**:data-search-field:p-0.5"],
      },
      prompt: {
        base: [
          HAIRLINE_FIELD,
          // Text only: the leading magnifier goes, and the prompt takes the
          // items' text inset (list gutter + item padding) so they line up.
          "**:[[data-search-field]_[data-input-group-addon]:first-child]:hidden",
          "**:[[data-search-field]_[data-input]]:pl-3 in-data-drawer:**:[[data-search-field]_[data-input]]:pl-3.5 in-data-modal:**:[[data-search-field]_[data-input]]:pl-4",
        ],
      },
    },
    inset: {
      inset: {
        base: [
          // The list gutter matches the field inset.
          "**:data-listbox:px-2 **:data-listbox:**:data-separator:-mx-2",
          "in-data-modal:**:data-listbox-item:px-2 in-data-modal:**:data-menu-item:px-2",
          "in-data-drawer:**:data-listbox-item:px-2 in-data-drawer:**:data-menu-item:px-2",
        ],
      },
      "full-bleed": {
        base: [
          "in-data-modal:**:data-listbox-item:px-4 in-data-modal:**:data-menu-item:px-4",
          "in-data-drawer:**:data-listbox-item:px-3.5 in-data-drawer:**:data-menu-item:px-3.5",
        ],
      },
    },
    scale: {
      default: {},
      large: {
        base: [
          // Input, rows and icons step up together (Raycast, Linear ⌘K).
          "**:[[data-search-field]_[data-input-group]]:[--icon-size:--spacing(5)] **:[[data-search-field]_[data-input-group]]:[--input-h:--spacing(11)]",
          "**:[[data-search-field]_[data-input]]:text-base",
          "**:data-listbox-item:py-2 **:data-listbox-item:text-base **:data-menu-item:py-2 **:data-menu-item:text-base",
          "**:[[data-listbox-item]>svg]:not-with-[size]:size-5 **:[[data-menu-item]>svg]:not-with-[size]:size-5",
        ],
      },
    },
  },
})

export type CommandStyles = typeof styles

export { useStyles }
