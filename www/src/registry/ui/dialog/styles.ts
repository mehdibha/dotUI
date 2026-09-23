import { createStyles } from "@/lib/styles"

import dialogMeta from "./meta"

const { useStyles, styles } = createStyles(dialogMeta, {
  base: {
    slots: {
      content:
        "relative flex max-h-[inherit] min-h-0 flex-col gap-4 p-(--dialog-padding) outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto",
      header: "flex flex-col",
      title: "font-heading",
      description: "text-fg-muted",
      body: "-mx-(--dialog-padding) flex min-h-0 flex-1 flex-col gap-2 px-(--dialog-padding) in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0",
      footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      closeButton: "absolute",
    },
    variants: {
      /* bar: a centered title between a leading and a trailing action, the
         navigation bar of an iOS sheet or a Material full-screen dialog. */
      layout: {
        stack: {},
        bar: {
          header:
            "grid grid-cols-[1fr_auto_1fr] items-center gap-2 *:first:justify-self-start *:last:justify-self-end *:data-[slot=dialog-heading]:col-start-2 *:data-[slot=dialog-heading]:justify-self-center *:data-[slot=dialog-heading]:text-center",
        },
      },
    },
    defaultVariants: {
      layout: "stack",
    },
  },
  density: {
    compact: {
      slots: {
        content:
          "text-xs/relaxed [--dialog-padding:--spacing(4)] in-data-popover:[--dialog-padding:--spacing(2.5)]",
        title: "text-sm font-medium",
        description: "",
        closeButton: "top-2 right-2",
      },
    },
    default: {
      slots: {
        content:
          "text-sm [--dialog-padding:--spacing(4)] in-data-popover:[--dialog-padding:--spacing(2.5)]",
        header: "gap-2 in-data-popover:gap-0.5",
        title: "font-medium in-data-modal:text-base in-data-modal:leading-none",
        description: "",
        closeButton: "top-2 right-2",
      },
    },
    comfortable: {
      slots: {
        content:
          "text-sm [--dialog-padding:--spacing(6)] in-data-popover:[--dialog-padding:--spacing(4)]",
        header: "gap-2 in-data-popover:gap-1",
        title:
          "text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium",
        description: "",
        closeButton: "top-4 right-4",
      },
    },
  },
  params: {
    header: {
      title: {},
      band: {
        slots: {
          content:
            "in-data-popover:has-data-[slot=dialog-heading]:[&~[data-slot=popover-arrow][data-placement=bottom]>svg]:fill-muted",
          title:
            "in-data-popover:-mx-(--dialog-padding) in-data-popover:-mt-(--dialog-padding) in-data-popover:mb-1 in-data-popover:rounded-t-[calc(var(--surface-radius)-1px)] in-data-popover:border-b in-data-popover:bg-muted in-data-popover:px-(--dialog-padding) in-data-popover:py-2",
        },
      },
    },
  },
})

export type DialogStyles = typeof styles

export { useStyles }
