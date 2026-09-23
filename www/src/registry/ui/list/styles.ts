import { createStyles } from "@/lib/styles"

import listMeta from "./meta"

/* Rows are a four-column grid (the gridcell wrapper is display: contents) — icon | label over description | value |
   accessory — so every slot lands in place whichever are present. The
   separator is each row's bottom hairline, inset to the text column. */

const { useStyles, styles } = createStyles(listMeta, {
  base: {
    slots: {
      root: "flex flex-col outline-hidden",
      item: [
        "relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] content-center items-center *:[[role=gridcell]]:contents px-(--list-px) text-fg outline-hidden select-ui [--list-separator:var(--list-px)] has-data-[slot=list-item-icon]:[--list-separator:calc(var(--list-px)+var(--list-icon)+--spacing(3))]",
        "after:pointer-events-none after:absolute after:start-(--list-separator) after:end-0 after:bottom-0 after:h-px after:bg-border [&:not(:has(+[data-list-item]))]:after:hidden",
        "hover:cursor-interactive hover:bg-highlight focus-visible:bg-highlight disabled:text-(--disabled-fg,var(--color-fg-disabled)) disabled:**:text-current pressed:bg-highlight",
      ],
      itemIcon:
        "col-start-1 row-span-2 row-start-1 me-3 flex items-center justify-center text-fg-muted *:[svg]:size-(--list-icon) *:[svg]:shrink-0",
      itemLabel:
        "col-start-2 row-start-1 truncate [&:not(:has(~[data-slot=list-item-description]))]:row-span-2 [&:not(:has(~[data-slot=list-item-description]))]:self-center",
      itemDescription: "col-start-2 row-start-2 text-fg-muted",
      itemValue:
        "col-start-3 row-span-2 row-start-1 ms-3 flex items-center gap-2 text-fg-muted",
      itemAccessory:
        "col-start-4 row-span-2 row-start-1 ms-2 flex items-center *:[svg]:size-(--list-icon)",
      chevron: "text-fg-muted opacity-60",
      check: "text-selection",
      section: "flex flex-col",
      sectionHeader: "px-(--list-px) pb-2 text-fg-muted",
    },
    variants: {
      variant: {
        default: {},
        accent: {},
        danger: {
          item: "text-fg-danger",
          itemIcon: "text-fg-danger",
        },
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
  density: {
    compact: {
      slots: {
        root: "text-xs/relaxed",
        item: "min-h-8 py-1.5 [--list-icon:--spacing(3.5)] [--list-px:--spacing(2.5)]",
        itemDescription: "text-xs/relaxed",
        sectionHeader: "text-xs",
      },
    },
    default: {
      slots: {
        root: "text-sm",
        item: "min-h-10 py-2 [--list-icon:--spacing(4)] [--list-px:--spacing(3)]",
        itemDescription: "text-xs",
        sectionHeader: "text-xs",
      },
    },
    comfortable: {
      slots: {
        root: "text-base",
        item: "min-h-12 py-2.5 [--list-icon:--spacing(5)] [--list-px:--spacing(4)]",
        itemDescription: "text-sm",
        sectionHeader: "text-sm",
      },
    },
  },
  params: {
    style: {
      inset: {
        slots: {
          item: "bg-card first:rounded-t-(--studio-list-radius) [&:not(:has(+[data-list-item]))]:rounded-b-(--studio-list-radius) [:not([data-list-item])+&]:rounded-t-(--studio-list-radius)",
          section: "[[data-list-section]+&]:mt-8",
        },
      },
      plain: {
        slots: {
          item: "[&:not(:has(+[data-list-item]))]:after:start-0 [&:not(:has(+[data-list-item]))]:after:block",
          section: "[[data-list-section]+&]:mt-6",
        },
      },
    },
    tint: {
      accent: {
        variants: {
          variant: {
            accent: { item: "text-fg-accent", itemIcon: "text-fg-accent" },
          },
        },
      },
      neutral: {
        variants: {
          variant: {
            accent: { item: "font-medium" },
          },
        },
      },
      selection: {
        variants: {
          variant: {
            accent: { item: "text-selection", itemIcon: "text-selection" },
          },
        },
      },
    },
  },
})

export type ListStyles = typeof styles

export { useStyles }
