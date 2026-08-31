import { createStyles } from "@/lib/styles"

import attachmentMeta from "./meta"

const { useStyles, styles } = createStyles(attachmentMeta, {
  base: {
    slots: {
      root: [
        "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-(--attachment-radius) border bg-card text-fg transition-colors",
        "has-[>a,>button]:hover:bg-muted/50",
        "has-[[data-attachment-trigger]:focus-visible]:focus-ring",
        "data-[state=error]:border-border-danger data-[state=idle]:border-dashed",
      ],
      media: [
        "relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-(--radius-item) bg-muted text-fg **:[svg]:pointer-events-none",
        "group-data-[state=error]/attachment:bg-danger-muted group-data-[state=error]/attachment:text-fg-danger",
        "group-data-[orientation=vertical]/attachment:w-full",
      ],
      content:
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
      title: [
        "block max-w-full min-w-0 truncate font-medium",
        "group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
      ],
      description: [
        "mt-0.5 block max-w-full min-w-0 truncate text-fg-muted",
        "group-data-[state=error]/attachment:text-fg-danger",
      ],
      actions: [
        "relative z-20 flex shrink-0 items-center",
        "group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
      ],
      trigger: "absolute inset-0 z-10 cursor-interactive focus-reset",
      group:
        "flex min-w-0 snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain *:data-attachment:flex-none *:data-attachment:snap-start",
    },
    variants: {
      size: {
        xs: {},
        sm: {},
        md: {},
      },
      orientation: {
        horizontal: {
          root: "items-center",
        },
        vertical: {
          root: "flex-col",
        },
      },
      mediaVariant: {
        icon: {},
        image: {
          media: [
            "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100",
            "*:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
          ],
        },
      },
    },
    defaultVariants: {
      size: "md",
      orientation: "horizontal",
      mediaVariant: "icon",
    },
  },
  density: {
    compact: {
      slots: {
        group: "scroll-px-1 gap-2 py-1",
      },
      variants: {
        size: {
          xs: {
            root: "gap-1.5 text-xs has-data-attachment-content:px-1.5 has-data-attachment-content:py-1 has-data-attachment-media:p-1",
            media: "w-6 **:[svg]:not-with-[size]:size-3",
            description: "text-[0.625rem]",
          },
          sm: {
            root: "gap-2 text-xs has-data-attachment-content:px-1.5 has-data-attachment-content:py-1 has-data-attachment-media:p-1",
            media:
              "w-7 **:[svg]:not-with-[size]:size-3.5 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-5",
            description: "text-[0.625rem]",
          },
          md: {
            root: "gap-2 text-xs has-data-attachment-content:px-2 has-data-attachment-content:py-1.5 has-data-attachment-media:p-1.5",
            media:
              "w-8 **:[svg]:not-with-[size]:size-3.5 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-5",
            description: "text-[0.625rem]",
          },
        },
        orientation: {
          vertical: {
            root: "w-20 has-data-attachment-content:w-26",
          },
        },
      },
    },
    default: {
      slots: {
        group: "scroll-px-1 gap-3 py-1",
      },
      variants: {
        size: {
          xs: {
            root: "gap-1.5 text-xs has-data-attachment-content:px-1.5 has-data-attachment-content:py-1 has-data-attachment-media:p-1",
            media: "w-7 **:[svg]:not-with-[size]:size-3.5",
            description: "text-xs",
          },
          sm: {
            root: "gap-2.5 text-xs has-data-attachment-content:px-2 has-data-attachment-content:py-1.5 has-data-attachment-media:p-1.5",
            media:
              "w-8 **:[svg]:not-with-[size]:size-4 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
            description: "text-xs",
          },
          md: {
            root: "gap-2 text-sm has-data-attachment-content:px-2.5 has-data-attachment-content:py-2 has-data-attachment-media:p-2",
            media:
              "w-10 **:[svg]:not-with-[size]:size-4 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
            description: "text-xs",
          },
        },
        orientation: {
          vertical: {
            root: "w-24 has-data-attachment-content:w-30",
          },
        },
      },
    },
    comfortable: {
      slots: {
        group: "scroll-px-1 gap-3 py-1",
      },
      variants: {
        size: {
          xs: {
            root: "gap-2 text-xs has-data-attachment-content:px-2 has-data-attachment-content:py-1.5 has-data-attachment-media:p-1.5",
            media: "w-8 **:[svg]:not-with-[size]:size-4",
            description: "text-xs",
          },
          sm: {
            root: "gap-2.5 text-xs has-data-attachment-content:px-2.5 has-data-attachment-content:py-2 has-data-attachment-media:p-2",
            media:
              "w-9 **:[svg]:not-with-[size]:size-4 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
            description: "text-xs",
          },
          md: {
            root: "gap-2.5 text-sm has-data-attachment-content:px-3 has-data-attachment-content:py-2.5 has-data-attachment-media:p-2.5",
            media:
              "w-11 **:[svg]:not-with-[size]:size-4.5 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
            description: "text-xs",
          },
        },
        orientation: {
          vertical: {
            root: "w-26 has-data-attachment-content:w-32",
          },
        },
      },
    },
  },
})

export type AttachmentStyles = typeof styles

export { useStyles }
