import { createStyles } from "@/lib/styles"

import messageMeta from "./meta"

const { useStyles, styles } = createStyles(messageMeta, {
  base: {
    slots: {
      group: "flex min-w-0 flex-col",
      root: "group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
      avatar:
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-[[data-message-footer]]/message:-translate-y-8",
      content: [
        "flex w-full min-w-0 flex-col wrap-break-word",
        "group-data-[align=end]/message:*:self-end",
      ],
      header: [
        "flex max-w-full min-w-0 items-center font-medium text-fg-muted",
        "group-has-[[data-variant=ghost]]/message:px-0",
      ],
      footer: [
        "flex max-w-full min-w-0 items-center font-medium text-fg-muted",
        "group-data-[align=end]/message:justify-end",
        "group-has-[[data-variant=ghost]]/message:px-0",
      ],
    },
  },
  density: {
    compact: {
      slots: {
        group: "gap-1.5",
        root: "gap-1.5 text-xs/relaxed",
        content: "gap-2",
        header: "px-2.5 text-[0.625rem]",
        footer: "px-2.5 text-[0.625rem]",
      },
    },
    default: {
      slots: {
        group: "gap-2",
        root: "gap-2 text-sm",
        content: "gap-2.5",
        header: "px-3 text-xs",
        footer: "px-3 text-xs",
      },
    },
    comfortable: {
      slots: {
        group: "gap-2.5",
        root: "gap-2.5 text-sm",
        content: "gap-2.5",
        header: "px-4 text-xs",
        footer: "px-4 text-xs",
      },
    },
  },
})

export type MessageStyles = typeof styles

export { useStyles }
