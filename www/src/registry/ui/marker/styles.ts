import { createStyles } from "@/lib/styles"

import markerMeta from "./meta"

const { useStyles, styles } = createStyles(markerMeta, {
  base: {
    slots: {
      root: [
        "group/marker relative flex w-full items-center text-left text-fg-muted",
        "**:[a]:underline **:[a]:underline-offset-3 **:[a]:hover:text-fg",
      ],
      icon: "shrink-0",
      content: [
        "min-w-0 wrap-break-word",
        "group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
      ],
    },
    variants: {
      variant: {
        default: {},
        separator: {
          root: "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        },
        border: {
          root: "border-b",
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
        root: "min-h-3.5 gap-2 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5",
        icon: "size-3.5",
      },
      variants: {
        variant: {
          border: { root: "pb-1.5" },
        },
      },
    },
    default: {
      slots: {
        root: "min-h-4 gap-2 text-sm **:[svg]:not-with-[size]:size-4",
        icon: "size-4",
      },
      variants: {
        variant: {
          border: { root: "pb-2" },
        },
      },
    },
    comfortable: {
      slots: {
        root: "min-h-4 gap-2.5 text-sm **:[svg]:not-with-[size]:size-4",
        icon: "size-4",
      },
      variants: {
        variant: {
          border: { root: "pb-2.5" },
        },
      },
    },
  },
})

export type MarkerStyles = typeof styles

export { useStyles }
