import { createStyles } from "@/lib/styles"

import menuMeta from "./meta"

const { useStyles, styles } = createStyles(menuMeta, {
  base: {
    slots: {
      root: [
        "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden",
        "**:data-separator:my-1 **:data-separator:w-auto",
      ],
      item: [
        "relative flex w-full cursor-interactive items-center gap-2 outline-hidden select-ui disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0",
        "focus:bg-highlight focus:text-fg-on-highlight",
        "disabled:text-(--disabled-fg,currentColor) disabled:**:text-current",
        "has-data-menu-item-description:flex-col has-data-menu-item-description:items-start has-data-menu-item-description:gap-0 has-data-menu-item-description:has-[>svg]:pl-8 has-data-menu-item-description:*:[svg]:absolute has-data-menu-item-description:*:[svg]:top-2 has-data-menu-item-description:*:[svg]:left-2",
        "data-has-submenu:pr-8",
        "*:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted",
        // danger
        "data-[variant=danger]:text-fg-danger data-[variant=danger]:focus:bg-danger-muted",
      ],
      indicator: [
        "pointer-events-none absolute flex items-center justify-center",
      ],
      submenuIndicator: [
        "pointer-events-none absolute right-2 flex items-center justify-center",
      ],
      itemLabel: [""],
      itemDescription: ["text-fg-muted"],
      section: ["scroll-my-1"],
      sectionTitle: ["font-medium text-fg-muted"],
    },
  },
  density: {
    compact: {
      slots: {
        root: "text-xs/relaxed",
        item: "min-h-7 gap-2 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5",
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
  },
  params: {
    indicator: {
      "check-start": {
        slots: {
          item: "data-selection-mode:pl-8 data-selection-mode:has-data-menu-item-description:has-[>svg]:pl-14 data-selection-mode:has-data-menu-item-description:*:[svg]:left-8",
          indicator: "left-2",
        },
      },
      "check-end": {
        slots: {
          item: "data-selection-mode:pr-8",
          indicator: "right-2",
        },
      },
    },
    highlight: {
      accent: {
        slots: {
          item: "focus:**:text-current",
        },
      },
    },
    inset: {
      inset: {
        slots: {
          root: "p-1 **:data-separator:-mx-1",
          item: "rounded-(--menu-item-radius)",
        },
        density: {
          compact: { slots: { item: "px-2", sectionTitle: "px-2" } },
          default: { slots: { item: "px-1.5", sectionTitle: "px-1.5" } },
          comfortable: { slots: { item: "px-2", sectionTitle: "px-2" } },
        },
      },
      "full-bleed": {
        slots: {
          root: "py-1",
        },
        density: {
          compact: { slots: { item: "px-2.5", sectionTitle: "px-2.5" } },
          default: { slots: { item: "px-3", sectionTitle: "px-3" } },
          comfortable: { slots: { item: "px-3.5", sectionTitle: "px-3.5" } },
        },
      },
    },
    labels: {
      sentence: {
        slots: {
          sectionTitle: "text-xs",
        },
      },
      caps: {
        slots: {
          sectionTitle: "text-[0.6875rem] font-medium tracking-wider uppercase",
        },
      },
    },
  },
})

export type MenuStyles = typeof styles

export { useStyles }
