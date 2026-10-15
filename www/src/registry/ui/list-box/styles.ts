import { createStyles } from "@/lib/styles"

import { CAPS } from "../badge/styles"
import listBoxMeta from "./meta"

/* Supabase's heading-meta; sidebar group labels share it. */
export const MONO_CAPS = "font-mono text-xs tracking-wider uppercase"

/* List rows: one recipe for list-box, menu (imports it) and command. One row
   lights up at a time: the focused row where focus follows the pointer (menus,
   pickers), else the keyboard row, else the hovered one. */
export const LIST_ROWS = {
  base: {
    slots: {
      root: [
        "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden",
        "layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row",
        "layout-grid:grid layout-grid:gap-1",
        "layout-grid:orientation-vertical:grid-cols-2",
        "layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2",
        "**:data-separator:my-1 **:data-separator:w-auto",
        // A floating list sets its popover's width (popover/styles.ts): at
        // least the trigger's, at most the viewport's; past that, labels truncate.
        "in-data-trigger:min-w-[calc(max(var(--trigger-width,0px),--spacing(32))-2*var(--studio-overlay-stroke))] in-data-trigger:max-w-[calc(100vw-2rem)]",
      ],
      item: [
        "group/list-item relative flex w-full cursor-interactive items-center gap-2 outline-hidden select-ui in-data-trigger:whitespace-nowrap disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0",
        "disabled:text-(--disabled-fg,currentColor) disabled:**:text-current",
        "data-[variant=danger]:text-fg-danger",
        "has-[[slot=description]]:flex-col has-[[slot=description]]:items-start has-[[slot=description]]:gap-0 has-[[slot=description]]:has-[>svg]:pl-8 has-[[slot=description]]:*:[svg]:absolute has-[[slot=description]]:*:[svg]:top-2 has-[[slot=description]]:*:[svg]:left-2",
        "has-submenu:pr-8",
        "*:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted",
      ],
      indicator: [
        "pointer-events-none group-has-[[slot=description]]/list-item:absolute group-has-[[slot=description]]/list-item:top-2",
      ],
      submenuIndicator: [
        "pointer-events-none absolute right-2 flex items-center justify-center",
      ],
      itemLabel: [
        // Clipped sideways only, so descenders stay whole.
        "in-data-trigger:max-w-full in-data-trigger:min-w-0 in-data-trigger:overflow-x-clip in-data-trigger:text-ellipsis",
      ],
      itemDescription: ["whitespace-normal text-fg-muted"],
      loadMore: ["flex w-full items-center justify-center py-1 text-fg-muted"],
      section: ["scroll-my-1"],
      sectionTitle: ["font-medium text-fg-muted"],
    },
  },
  density: {
    compact: {
      slots: {
        root: "text-xs/relaxed",
        item: "gap-2 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5",
        sectionTitle: "py-1.5",
      },
    },
    default: {
      slots: {
        root: "text-sm",
        item: "gap-1.5 py-1 text-sm **:[svg]:not-with-[size]:size-4",
        sectionTitle: "py-1",
      },
    },
    comfortable: {
      slots: {
        root: "text-sm",
        item: "gap-2 py-1.5 text-sm **:[svg]:not-with-[size]:size-4",
        sectionTitle: "py-1.5",
      },
    },
    spacious: {
      slots: {
        root: "text-sm",
        item: "gap-2 py-2 text-sm **:[svg]:not-with-[size]:size-4",
        sectionTitle: "py-2",
      },
    },
    touch: {
      slots: {
        root: "text-base",
        item: "gap-3 py-2 text-base **:[svg]:not-with-[size]:size-5",
        sectionTitle: "py-2",
      },
    },
  },
  params: {
    indicator: {
      // The check takes the icon column, so check and icon rows share one
      // label edge.
      "check-start": {
        slots: {
          item: "data-selection-mode:has-[[slot=description]]:pl-8 data-selection-mode:has-[[slot=description]]:has-[>svg]:pl-14 data-selection-mode:has-[[slot=description]]:*:[svg]:left-8",
          indicator: "left-2 flex shrink-0 items-center justify-center",
        },
        density: {
          compact: { slots: { indicator: "w-3.5" } },
          default: { slots: { indicator: "w-4" } },
          comfortable: { slots: { indicator: "w-4" } },
          spacious: { slots: { indicator: "w-4" } },
          touch: { slots: { indicator: "w-5" } },
        },
      },
      "check-end": {
        slots: {
          item: "data-selection-mode:pr-8",
          indicator: "absolute right-2 flex items-center justify-center",
        },
      },
      none: {
        slots: {
          indicator: "hidden",
        },
      },
    },
    highlight: {
      // shadcn, Geist, Linear: a neutral wash; danger rows keep their ink.
      neutral: {
        slots: {
          item: [
            "focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-(--studio-list-box-highlight) focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight",
            "focus-visible:bg-(--studio-list-box-highlight) focus-visible:text-fg-on-highlight",
            "hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-(--studio-list-box-highlight) hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-highlight",
            "data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-danger-muted data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-danger",
            "data-[variant=danger]:focus-visible:bg-danger-muted data-[variant=danger]:focus-visible:text-fg-danger",
            "data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-danger-muted data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-danger",
          ],
        },
      },
      // Radix Themes, macOS: a solid fill every descendant inks on.
      accent: {
        slots: {
          item: [
            "focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-accent focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-accent focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:**:text-current",
            "focus-visible:bg-accent focus-visible:text-fg-on-accent focus-visible:**:text-current",
            "hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-accent hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-accent hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:**:text-current",
            "data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-danger data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-danger",
            "data-[variant=danger]:focus-visible:bg-danger data-[variant=danger]:focus-visible:text-fg-on-danger",
            "data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-danger data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-danger",
          ],
        },
      },
    },
    inset: {
      inset: {
        slots: {
          root: "p-1 **:data-separator:-mx-1",
          item: "rounded-(--studio-list-box-item-radius)",
        },
        density: {
          compact: { slots: { item: "px-2", sectionTitle: "px-2" } },
          default: { slots: { item: "px-1.5", sectionTitle: "px-1.5" } },
          comfortable: { slots: { item: "px-2", sectionTitle: "px-2" } },
          spacious: { slots: { item: "px-2.5", sectionTitle: "px-2.5" } },
          touch: { slots: { item: "px-3", sectionTitle: "px-3" } },
        },
      },
      // Square rows; the block padding clears half the surface's corner.
      "full-bleed": {
        slots: {
          root: "py-[max(--spacing(1),calc(var(--surface-radius,0px)/2))]",
        },
        density: {
          compact: { slots: { item: "px-2.5", sectionTitle: "px-2.5" } },
          default: { slots: { item: "px-3", sectionTitle: "px-3" } },
          comfortable: { slots: { item: "px-3.5", sectionTitle: "px-3.5" } },
          spacious: { slots: { item: "px-4", sectionTitle: "px-4" } },
          touch: { slots: { item: "px-4", sectionTitle: "px-4" } },
        },
      },
    },
    // Material 3, Carbon, Polaris: the selected row keeps the selected wash,
    // hovered or focused too, under either highlight.
    selected: {
      none: {},
      tint: {
        slots: {
          item: [
            "selected:bg-(--studio-list-box-selected) selected:text-fg-on-selected",
            "selected:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-(--studio-list-box-selected-highlight) selected:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-selected",
            "selected:focus-visible:bg-(--studio-list-box-selected-highlight) selected:focus-visible:text-fg-on-selected",
            "selected:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-(--studio-list-box-selected-highlight) selected:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-selected",
          ],
        },
      },
    },
    // Row height: the density's own rows (shadcn), the control height
    // (Radix Themes, Linear), or one step above it (Polaris, Stripe). Those
    // hold under any text size; a row with a description still grows.
    rows: {
      auto: { density: { compact: { slots: { item: "min-h-7" } } } },
      match: {
        slots: { item: "not-has-[[slot=description]]:py-0" },
        density: {
          compact: { slots: { item: "min-h-7" } },
          default: { slots: { item: "min-h-8" } },
          comfortable: { slots: { item: "min-h-9" } },
          spacious: { slots: { item: "min-h-10" } },
          touch: { slots: { item: "min-h-12" } },
        },
      },
      step: {
        slots: { item: "not-has-[[slot=description]]:py-0" },
        density: {
          compact: { slots: { item: "min-h-8" } },
          default: { slots: { item: "min-h-9" } },
          comfortable: { slots: { item: "min-h-10" } },
          spacious: { slots: { item: "min-h-12" } },
          touch: { slots: { item: "min-h-14" } },
        },
      },
    },
    labels: {
      sentence: { slots: { sectionTitle: "text-xs" } },
      caps: { slots: { sectionTitle: CAPS } },
      "mono-caps": { slots: { sectionTitle: MONO_CAPS } },
    },
  },
}

const { useStyles, styles } = createStyles(listBoxMeta, LIST_ROWS)

export type ListBoxStyles = typeof styles

export { useStyles }
