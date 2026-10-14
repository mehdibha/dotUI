import { createStyles } from "@/lib/styles"

import emptyMeta from "./meta"

const { useStyles, styles } = createStyles(emptyMeta, {
  base: {
    slots: {
      base: [
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance",
        "border-dashed",
      ],
      header: "flex max-w-sm flex-col items-center",
      title: "font-heading",
      description:
        "text-sm/relaxed text-fg-muted [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
      content:
        "flex w-full max-w-sm min-w-0 flex-col items-center text-balance",
      media:
        "flex shrink-0 items-center justify-center **:[svg]:pointer-events-none **:[svg]:shrink-0",
    },
    variants: {
      variant: {
        default: {
          media: "bg-transparent",
        },
        icon: {
          media: "rounded-(--studio-empty-media-radius) bg-muted text-fg",
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
        base: "gap-4 rounded-(--studio-empty-radius) p-6",
        header: "gap-1",
        description: "text-xs/relaxed",
        content: "gap-2 text-xs/relaxed",
        media: "mb-2",
      },
      variants: {
        variant: {
          icon: {
            media: "size-8 **:[svg]:not-with-[size]:size-4",
          },
        },
      },
    },
    default: {
      slots: {
        base: "gap-4 rounded-(--studio-empty-radius) p-6",
        header: "gap-2",
        description: "text-sm/relaxed",
        content: "gap-2.5 text-sm",
        media: "mb-2",
      },
      variants: {
        variant: {
          icon: {
            media: "size-9 **:[svg]:not-with-[size]:size-5",
          },
        },
      },
    },
    comfortable: {
      slots: {
        base: "gap-4 rounded-(--studio-empty-radius) p-12",
        description: "text-sm/relaxed",
        content: "text-sm",
        media: "mb-2",
      },
      variants: {
        variant: {
          icon: {
            media: "size-10 **:[svg]:not-with-[size]:size-6",
          },
        },
      },
    },
    spacious: {
      slots: {
        base: "gap-4 rounded-(--studio-empty-radius) p-12",
        description: "text-sm/relaxed",
        content: "text-sm",
        media: "mb-2",
      },
      variants: {
        variant: {
          icon: {
            media: "size-10 **:[svg]:not-with-[size]:size-6",
          },
        },
      },
    },
    touch: {
      slots: {
        base: "gap-4 rounded-(--studio-empty-radius) p-12",
        description: "text-sm/relaxed",
        content: "text-sm",
        media: "mb-2",
      },
      variants: {
        variant: {
          icon: {
            media: "size-10 **:[svg]:not-with-[size]:size-6",
          },
        },
      },
    },
  },
  params: {
    titles: {
      quiet: {
        density: {
          compact: { slots: { title: "text-sm font-medium tracking-tight" } },
          default: { slots: { title: "text-base font-medium tracking-tight" } },
          comfortable: {
            slots: { title: "text-lg font-medium tracking-tight" },
          },
          spacious: {
            slots: { title: "text-lg font-medium tracking-tight" },
          },
          touch: {
            slots: { title: "text-lg font-medium tracking-tight" },
          },
        },
      },
      compact: {
        density: {
          compact: { slots: { title: "text-xs font-semibold" } },
          default: { slots: { title: "text-sm font-semibold" } },
          comfortable: { slots: { title: "text-sm font-semibold" } },
          spacious: { slots: { title: "text-sm font-semibold" } },
          touch: { slots: { title: "text-base font-semibold" } },
        },
      },
      tight: {
        density: {
          compact: { slots: { title: "text-sm font-semibold tracking-tight" } },
          default: {
            slots: { title: "text-base font-semibold tracking-tight" },
          },
          comfortable: {
            slots: { title: "text-lg font-semibold tracking-tight" },
          },
          spacious: {
            slots: { title: "text-lg font-semibold tracking-tight" },
          },
          touch: {
            slots: { title: "text-lg font-semibold tracking-tight" },
          },
        },
      },
      bold: {
        density: {
          compact: { slots: { title: "text-base font-bold" } },
          default: { slots: { title: "text-lg font-bold" } },
          comfortable: { slots: { title: "text-xl font-bold" } },
          spacious: { slots: { title: "text-xl font-bold" } },
          touch: { slots: { title: "text-xl font-bold" } },
        },
      },
      display: {
        density: {
          compact: { slots: { title: "text-lg font-normal" } },
          default: { slots: { title: "text-xl font-normal" } },
          comfortable: { slots: { title: "text-2xl font-normal" } },
          spacious: { slots: { title: "text-2xl font-normal" } },
          touch: { slots: { title: "text-2xl font-normal" } },
        },
      },
      caps: {
        density: {
          compact: {
            slots: { title: "text-sm font-semibold tracking-wider uppercase" },
          },
          default: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          comfortable: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          spacious: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          touch: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
        },
      },
    },
  },
})

export type EmptyStyles = typeof styles

export { useStyles }
