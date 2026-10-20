import { createStyles } from "@/lib/styles"

import commandMeta from "./meta"

const HAIRLINE_FIELD =
  "**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0 **:data-search-field:border-b"

const { useStyles } = createStyles(commandMeta, {
  base: {
    base: [
      "group/command flex w-full flex-col gap-1 text-fg",
      "[--command-inset:--spacing(2)] in-data-popover:[--command-inset:--spacing(1)]",
      // The list owns all the overflow so the collection's scroll-into-view works.
      "max-h-[inherit]",
      "**:data-search-field:shrink-0",
      "**:data-listbox:min-h-0 **:data-listbox:overflow-y-auto",
      "in-data-modal:**:data-listbox-item:py-2 in-data-modal:**:data-menu-item:py-2",
      "in-data-modal:**:data-listbox-item:rounded-(--studio-radius-inline-item) in-data-modal:**:data-menu-item:rounded-(--studio-radius-inline-item)",
      "in-data-sheet:**:data-listbox-item:py-2 in-data-sheet:**:data-menu-item:py-2",
      "not-in-data-popover:**:data-listbox-item:py-1.5 **:data-listbox-section-header:py-1.5 **:data-listbox-section-header:font-medium",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {
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
          // The inset lives on the field and list, never the root, so the scrollbar sits flush with the surface edge.
          "**:data-search-field:px-(--command-inset) **:data-search-field:pt-(--command-inset) **:data-search-field:pb-0",
          "**:data-listbox:scroll-py-(--command-inset) **:data-listbox:pt-0 **:data-listbox:pb-(--command-inset)",
          "**:data-listbox:**:data-separator:my-(--command-inset)",
          // --surface-radius is set by whichever rounded surface contains the command (popover, modal, card).
          "**:[[data-search-field]>[data-input-group]]:rounded-[max(var(--studio-input-radius),calc(var(--surface-radius,var(--studio-radius-surface))-var(--command-inset)))]",
        ],
      },
      bar: {
        base: [HAIRLINE_FIELD, "in-data-modal:**:data-search-field:p-0.5"],
      },
      prompt: {
        base: [
          HAIRLINE_FIELD,
          // Padding matches the items' text inset (list gutter + item padding).
          "**:[[data-search-field]_[data-input-group-addon]:first-child]:hidden",
          "**:[[data-search-field]_[data-input]]:pl-3 in-data-modal:**:[[data-search-field]_[data-input]]:pl-4 in-data-sheet:**:[[data-search-field]_[data-input]]:pl-3.5",
        ],
      },
    },
    inset: {
      inset: {
        base: [
          "**:data-listbox:px-(--command-inset) **:data-listbox:**:data-separator:-mx-(--command-inset)",
          "in-data-modal:**:data-listbox-item:px-2 in-data-modal:**:data-menu-item:px-2",
          "in-data-sheet:**:data-listbox-item:px-2 in-data-sheet:**:data-menu-item:px-2",
        ],
      },
      "full-bleed": {
        base: [
          "in-data-modal:**:data-listbox-item:px-4 in-data-modal:**:data-menu-item:px-4",
          "in-data-sheet:**:data-listbox-item:px-3.5 in-data-sheet:**:data-menu-item:px-3.5",
        ],
      },
    },
    scale: {
      default: {},
      large: {
        base: [
          "**:[[data-search-field]_[data-input-group]]:[--icon-size:--spacing(5)] **:[[data-search-field]_[data-input-group]]:[--input-h:--spacing(11)]",
          "**:[[data-search-field]_[data-input]]:text-base",
          "**:data-listbox-item:py-2 **:data-listbox-item:text-base **:data-menu-item:py-2 **:data-menu-item:text-base",
          "**:[[data-listbox-item]>svg]:not-with-[size]:size-5 **:[[data-menu-item]>svg]:not-with-[size]:size-5",
        ],
      },
    },
  },
})

export { useStyles }
