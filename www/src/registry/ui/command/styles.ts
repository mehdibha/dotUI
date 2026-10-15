import { createStyles } from "@/lib/styles"

import commandMeta from "./meta"

// A frameless input over a hairline that runs the full width of the surface.
const HAIRLINE_FIELD =
  "**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0 **:data-search-field:border-b"

const { useStyles, styles } = createStyles(commandMeta, {
  base: {
    base: [
      "group/command flex w-full flex-col gap-1 text-fg",
      // A popover is a picker: the tight inset of shadcn's popup combobox.
      "[--command-inset:--spacing(2)] in-data-popover:[--command-inset:--spacing(1)]",
      // The search field stays pinned; the list owns all the overflow so the
      // collection's own scroll (keyboard focus, scroll-into-view) works.
      "max-h-[inherit]",
      "**:data-search-field:shrink-0",
      "**:data-listbox:min-h-0 **:data-listbox:overflow-y-auto",
      // Modal and drawer commands are spotlight/touch surfaces — taller rows
      // than a dropdown. Their inline padding follows the inset param.
      "in-data-modal:**:data-listbox-item:py-2 in-data-modal:**:data-menu-item:py-2",
      "in-data-modal:**:data-listbox-item:rounded-(--studio-radius-inline-item) in-data-modal:**:data-menu-item:rounded-(--studio-radius-inline-item)",
      "in-data-drawer:**:data-listbox-item:py-2 in-data-drawer:**:data-menu-item:py-2",
      // Command rows and headings sit taller than a menu's (shadcn: py-1.5 in
      // every style), and headings carry weight so they read as group labels.
      // In a popover, rows keep the list's density, like shadcn's combobox.
      "not-in-data-popover:**:data-listbox-item:py-1.5 **:data-listbox-section-header:py-1.5 **:data-listbox-section-header:font-medium",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {
      // A picker's search matches its rows, not a form field (shadcn vega).
      base: "in-data-popover:**:[[data-search-field]_[data-input-group]]:[--input-h:--spacing(8)]",
    },
    spacious: {
      // A picker's search matches its rows, not a form field (shadcn vega).
      base: "in-data-popover:**:[[data-search-field]_[data-input-group]]:[--input-h:--spacing(9)]",
    },
    touch: {
      // A picker's search matches its rows, not a form field (shadcn vega).
      base: "in-data-popover:**:[[data-search-field]_[data-input-group]]:[--input-h:--spacing(10)]",
    },
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
          "**:data-search-field:px-(--command-inset) **:data-search-field:pt-(--command-inset) **:data-search-field:pb-0",
          "**:data-listbox:scroll-py-(--command-inset) **:data-listbox:pt-0 **:data-listbox:pb-(--command-inset)",
          "**:data-listbox:**:data-separator:my-(--command-inset)",
          // --surface-radius: set by whichever rounded surface contains the
          // command (popover, modal, card), so one rule stays concentric
          // everywhere.
          "**:[[data-search-field]>[data-input-group]]:rounded-[max(var(--studio-input-radius),calc(var(--surface-radius,var(--studio-radius-surface))-var(--command-inset)))]",
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
          "**:data-listbox:px-(--command-inset) **:data-listbox:**:data-separator:-mx-(--command-inset)",
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
